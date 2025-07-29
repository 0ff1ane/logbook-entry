from typing import Optional
from pydantic import BaseModel
from ninja import ModelSchema

from .models import CustomUser


class SignInSchema(BaseModel):
    email: str
    password: str


class CustomUserSchema(ModelSchema):
    class Meta:
        model = CustomUser
        fields = ['email', 'username']


class LoginResponseSchema(BaseModel):
    success: bool
    message: Optional[str] = None


class RegisterResponseSchema(BaseModel):
    success: bool
    message: Optional[str] = None
