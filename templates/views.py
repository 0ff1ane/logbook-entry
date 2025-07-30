from inertia import inertia
from django.template import loader
from django.shortcuts import redirect
from django.views.decorators.csrf import csrf_exempt, ensure_csrf_cookie

from apps.accounts.schemas import CustomUserSchema



@ensure_csrf_cookie
@inertia("Login")
def login(request):
    return {}


@ensure_csrf_cookie
@inertia("Todos")
def todos(request):
    current_user = request.user
    print(current_user)
    if not current_user.is_authenticated:
        return redirect("/")
    return {"current_user": CustomUserSchema.model_validate(current_user).model_dump()}


@ensure_csrf_cookie
@inertia("LogBooksTable")
def logbooks(request):
    current_user = request.user
    if not current_user.is_authenticated:
        return redirect("/")
    return {"current_user": CustomUserSchema.model_validate(current_user).model_dump()}

@ensure_csrf_cookie
@inertia("NewLogBook")
def new_logbook(request):
    current_user = request.user
    if not current_user.is_authenticated:
        return redirect("/")
    return {"current_user": CustomUserSchema.model_validate(current_user).model_dump()}

@ensure_csrf_cookie
@inertia("LogBook")
def logbook(request, logbook_id: int):
    current_user = request.user
    if not current_user.is_authenticated:
        return redirect("/")
    return {
        "logbook_id": logbook_id,
        "current_user": CustomUserSchema.model_validate(current_user).model_dump(),
    }

@ensure_csrf_cookie
@inertia("Log")
def log(request):
    current_user = request.user
    print(current_user)
    if not current_user.is_authenticated:
        return redirect("/")
    return {"current_user": CustomUserSchema.model_validate(current_user).model_dump()}
