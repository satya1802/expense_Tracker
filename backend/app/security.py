"""Password hashing shared by every handler that creates or checks a password.

One place to change the hashing scheme later; sign-up, sign-in and the
startup seed below all call this rather than calling passlib or bcrypt
directly. `backend/conftest.py` lowers bcrypt's work factor under pytest
only, so these are still real bcrypt hashes in every environment, just a
cheap one in tests.

`bcrypt` has only ever used a password's first 72 bytes; versions before
5.0 truncated the rest silently, 5.0+ raises `ValueError` instead. The
`passlib==1.7.4` this project depends on (the latest release published on
PyPI) predates that change: the first time its bcrypt handler is used, it
runs a one-time backend self-test that hashes a deliberately oversized probe
string to check for a historical wraparound bug, and with bcrypt>=5.0 that
self-test itself now raises before a single real password is ever hashed --
independently of how long an actual password is, and before this module's
own `hash_password`/`verify_password` (which pass through passlib's own
truncation first) ever touch `bcrypt.hashpw`.
"""

import contextlib
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


@contextlib.contextmanager
def _restore_pre_5_0_truncation():
    """Restore bcrypt's pre-5.0 silent-truncation behaviour, but only for the
    duration of this context -- not for the rest of the process. Used solely
    to get passlib's one-time backend self-test (see module docstring) past
    its oversized probe string; every other caller of `bcrypt.hashpw`,
    including this module's own real password hashing (once the self-test
    has already run) and any other package that imports `bcrypt`, is
    unaffected once the block exits.
    """
    original_hashpw = bcrypt.hashpw

    def _truncated(password: bytes, salt: bytes) -> bytes:
        return original_hashpw(password[:72], salt)

    bcrypt.hashpw = _truncated
    try:
        yield
    finally:
        bcrypt.hashpw = original_hashpw


_pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
with _restore_pre_5_0_truncation():
    # Forces the bcrypt backend to load now -- running its self-test while the
    # truncation patch above is active -- rather than lazily on this process's
    # first real call to hash_password/verify_password.
    _pwd_context.hash("backend-self-test-probe")


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
