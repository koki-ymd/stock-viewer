from .auth import router as auth_router
from .favorites import router as favorites_router
from .stocks import router as stocks_router

__all__ = [
    "auth_router",
    "favorites_router",
    "stocks_router",
]

