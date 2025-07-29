from typing import Optional
from django.views.decorators.csrf import csrf_exempt
from ninja import Router
from ninja.security import django_auth
from django.contrib.auth import authenticate, login as django_login, logout as django_logout
from django.middleware.csrf import get_token

from apps.accounts.accounts import Accounts
from .schemas import RegisterResponseSchema, SignInSchema, CustomUserSchema, LoginResponseSchema


router = Router()


@router.get("/set-csrf-token")
def get_csrf_token(request):
    return {"csrftoken": get_token(request)}


@router.post("/login", auth=None, response=LoginResponseSchema)
def login(request, payload: SignInSchema) -> LoginResponseSchema:
    user = authenticate(request, username=payload.email, password=payload.password)
    if user is not None:
        django_login(request, user)
        return LoginResponseSchema(success=True)
    return LoginResponseSchema(success= False, message= "Invalid credentials")


@router.post("/logout", auth=None)
def logout(request):
    django_logout(request)
    return {"message": "Logged out"}


@router.get("/me", auth=None, response=Optional[CustomUserSchema])
def me(request):
    if request.user.is_authenticated:
        return {
            "username": request.user.username,
            "email": request.user.email,
        }
    else:
        return None


@router.post("/register", auth=None, response=RegisterResponseSchema)
def register(request, payload: SignInSchema) -> RegisterResponseSchema:
    try:
        Accounts.create_user(email=payload.email, password=payload.password)
        return RegisterResponseSchema(success=True, message= "User registered")
    except Exception as e:
        print(e)
        return RegisterResponseSchema(success=False, message="Unable to register user")
