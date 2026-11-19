"""List, create, rename and delete categories, scoped to the signed-in user.

Every handler depends on `get_current_user` (app/dependencies.py) and filters
by that user's id -- never anything the request body or path claims -- so one
account's categories are never visible or editable from another's token.
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user
from app.models import Category, Expense, User
from app.schemas import CategoryCreate, CategoryOut, CategoryUpdate

router = APIRouter(tags=["categories"])

_DUPLICATE_NAME_DETAIL = "You already have a category with that name"


def _require_name(name: str) -> str:
    """Blank/whitespace-only names are rejected with the contract's 422 shape,
    not pydantic's, so this is not a Field(min_length=1) validator."""
    stripped = name.strip()
    if not stripped:
        raise HTTPException(
            status_code=422, detail=[{"field": "name", "message": "Name is required"}]
        )
    return stripped


def _reject_duplicate(db: Session, user_id: str, name: str, exclude_id: str | None = None) -> None:
    query = db.query(Category).filter(
        Category.user_id == user_id, func.lower(Category.name) == name.lower()
    )
    if exclude_id is not None:
        query = query.filter(Category.id != exclude_id)
    if query.first() is not None:
        raise HTTPException(status_code=409, detail=_DUPLICATE_NAME_DETAIL)


@router.get("/categories", response_model=list[CategoryOut])
async def list_categories(
    user: User = Depends(get_current_user), db: Session = Depends(get_db)
) -> list[Category]:
    return db.query(Category).filter(Category.user_id == user.id).order_by(Category.name).all()


@router.post("/categories", response_model=CategoryOut, status_code=201)
async def create_category(
    payload: CategoryCreate,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> Category:
    name = _require_name(payload.name)
    _reject_duplicate(db, user.id, name)
    category = Category(user_id=user.id, name=name, is_default=False)
    db.add(category)
    try:
        db.commit()
    except IntegrityError as exc:
        # Two concurrent requests can both pass _reject_duplicate's check and
        # then race to commit; the unique index (ix_categories_user_id_lower_name)
        # catches the loser. Translate that into the same 409 a sequential
        # duplicate gets, instead of an unhandled 500.
        db.rollback()
        raise HTTPException(status_code=409, detail=_DUPLICATE_NAME_DETAIL) from exc
    db.refresh(category)
    return category


@router.patch("/categories/{id}", response_model=CategoryOut)
async def update_category(
    id: str,
    payload: CategoryUpdate,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> Category:
    category = db.query(Category).filter(Category.id == id, Category.user_id == user.id).first()
    if category is None:
        raise HTTPException(status_code=404, detail="Category not found")
    name = _require_name(payload.name)
    _reject_duplicate(db, user.id, name, exclude_id=category.id)
    category.name = name
    try:
        db.commit()
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(status_code=409, detail=_DUPLICATE_NAME_DETAIL) from exc
    db.refresh(category)
    return category


@router.delete("/categories/{id}", status_code=204)
async def delete_category(
    id: str,
    confirm: bool = False,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> None:
    category = db.query(Category).filter(Category.id == id, Category.user_id == user.id).first()
    if category is None:
        raise HTTPException(status_code=404, detail="Category not found")
    if category.is_default:
        raise HTTPException(status_code=409, detail="Default categories cannot be deleted")
    has_expenses = (
        db.query(Expense.id).filter(Expense.category_id == category.id).first() is not None
    )
    if has_expenses and not confirm:
        raise HTTPException(
            status_code=409,
            detail=(
                "This category has existing expenses; pass confirm=true to delete "
                "the category and those expenses"
            ),
        )
    db.delete(category)
    db.commit()
    return None
