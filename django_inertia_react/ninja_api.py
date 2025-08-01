from ninja import NinjaAPI
from ninja.security import django_auth

from apps.accounts.routes import router as accounts_router
from apps.logbooks.logbooks_routes import router as logbooks_router
from apps.logbooks.logentries_routes import router as logentries_router
from apps.todos.routes import router as todos_router

ninja_api = NinjaAPI(auth=django_auth)

ninja_api.add_router("/accounts/", accounts_router)
ninja_api.add_router("/logbooks/", logbooks_router)
ninja_api.add_router("/logentries/", logentries_router)
ninja_api.add_router("/todos/", todos_router)
