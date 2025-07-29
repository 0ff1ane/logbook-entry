from typing import Optional
from pydantic import BaseModel
from ninja import ModelSchema

from apps.accounts.schemas import CustomUserSchema
from .models import Todo


class CreateTodoSchema(BaseModel):
    text: str


class UpdateTodoSchema(BaseModel):
    todo_id: int
    is_complete: bool


class TodoSchema(ModelSchema):
    created_by: CustomUserSchema
    class Meta:
        model = Todo
        fields = ['id', 'text', 'is_complete']
