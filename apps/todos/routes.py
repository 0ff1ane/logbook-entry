from typing import List, Optional
from ninja import Router

from apps.todos.schemas import CreateTodoSchema, TodoSchema, UpdateTodoSchema
from apps.todos.todos import Todos

router = Router()

@router.get('/', response=List[TodoSchema])
def list_todos(request):
    current_user = request.user
    return Todos.list_todos(user_id=current_user.id)

@router.get('/{todo_id}', response=Optional[TodoSchema])
def get_todo(request, todo_id: int):
    return Todos.get_todo_by_id(todo_id)


@router.post('/', response=TodoSchema)
def add_todo(request, payload: CreateTodoSchema):
    current_user = request.user
    return Todos.add_todo(text=payload.text, user_id=current_user.id)


@router.put('/', response=TodoSchema)
def update_todo(request, payload: UpdateTodoSchema):
    return Todos.update_todo(todo_id=payload.todo_id, is_complete=payload.is_complete)
