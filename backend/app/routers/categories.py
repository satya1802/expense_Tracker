"""List, create, rename and delete categories, scoped to the signed-in user.

Every handler depends on `get_current_user` (app/dependencies.py) and filters
by that user's id -- never anything the request body or path claims -- so one
account's categories are never visible or editable from another's token.
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user
from app.models import Category, User
from app.schemas import CategoryCreate, CategoryOut, CategoryUpdate

router = APIRouter(tags=["categories"])


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
        raise HTTPException(status_code=409, detail="You already have a category with that name")


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
    db.commit()
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
    db.commit()
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
    db.delete(category)
    db.commit()
    return None
