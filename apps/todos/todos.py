from apps.todos.models import Todo


class Todos:
    @staticmethod
    def list_todos(user_id):
        return Todo.objects.filter(created_by_id=user_id).order_by("-created_at").all()

    @staticmethod
    def get_todo_by_id(todo_id):
        return Todo.objects.filter(id=todo_id).first()

    @staticmethod
    def add_todo(text: str, user_id: int):
        todo = Todo.objects.create(text=text, created_by_id=user_id)
        return todo

    @staticmethod
    def update_todo(todo_id: int, is_complete: bool):
        todo = Todos.get_todo_by_id(todo_id)
        todo.is_complete = is_complete
        todo.save()
        return todo
