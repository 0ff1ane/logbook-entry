from ninja import NinjaAPI
from ninja.security import django_auth

from apps.accounts.routes import router as accounts_router
from apps.todos.routes import router as todos_router

ninja_api = NinjaAPI(auth=django_auth)

ninja_api.add_router("/accounts/", accounts_router)
ninja_api.add_router("/todos/", todos_router)
