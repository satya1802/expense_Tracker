"""`app.security` is the one place every ticket that touches a password should
call into, so its round trip -- and the bcrypt>=5/passlib compatibility fix it
carries -- has to actually work before anyone builds sign-up or sign-in on it.
"""

from app.security import hash_password, verify_password


def test_hash_password_round_trips() -> None:
    password = "correct horse battery staple"

    hashed = hash_password(password)

    assert hashed != password
    assert verify_password(password, hashed) is True


def test_verify_password_rejects_wrong_password() -> None:
    hashed = hash_password("the-right-password")

    assert verify_password("not-the-right-password", hashed) is False
