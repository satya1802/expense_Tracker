"""Password hashing shared by every handler that creates or checks a password.

One place to change the hashing scheme later; sign-up, sign-in and the
startup seed below all call this rather than calling passlib or bcrypt
directly. `backend/conftest.py` lowers bcrypt's work factor under pytest
only, so these are still real bcrypt hashes in every environment, just a
cheap one in tests.

`bcrypt` has only ever used a password's first 72 bytes; versions before
5.0 truncated the rest silently, 5.0+ raises `ValueError` instead. The
`passlib==1.7.4` this project depends on (the latest release published on
PyPI) predates that change: its one-time backend self-test hashes a
deliberately oversized probe string to check for a historical wraparound
bug, and with bcrypt>=5.0 that self-test itself now raises before a single
real password is ever hashed -- independently of how long an actual
password is. Restoring bcrypt's old silent-truncation behaviour here (which
is also what passlib's self-test, and bcrypt itself before 5.0, always
assumed) fixes that without downgrading bcrypt below the version the
architecture requires.
"""

import secrets
from types import SimpleNamespace

import bcrypt
from passlib.context import CryptContext

# A second, harmless side effect of the same version gap: passlib looks for the
# `bcrypt.__about__.__version__` attribute pybcrypt used to publish; `bcrypt`>=4
# dropped it in favour of the plain `__version__` passlib already falls back to,
# but only after logging a caught "error reading bcrypt version". Supplying the
# attribute avoids that log without changing which version passlib detects.
if not hasattr(bcrypt, "__about__"):
    bcrypt.__about__ = SimpleNamespace(__version__=bcrypt.__version__)

_bcrypt_hashpw = bcrypt.hashpw


def _bcrypt_hashpw_truncated(password: bytes, salt: bytes) -> bytes:
    return _bcrypt_hashpw(password[:72], salt)


bcrypt.hashpw = _bcrypt_hashpw_truncated

_pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    """Hash a plaintext password for storage. Never store the plaintext."""
    return _pwd_context.hash(password)


def verify_password(password: str, password_hash: str) -> bool:
    """Check a plaintext password against a hash produced by `hash_password`."""
    return _pwd_context.verify(password, password_hash)


def generate_session_token() -> str:
    """An opaque, unguessable session token. Fits the `sessions.token` column
    (String(64)); `token_urlsafe(32)` produces 43 characters."""
    return secrets.token_urlsafe(32)
