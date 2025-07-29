from django.test import TestCase
from apps.accounts.accounts import Accounts
from apps.todos.todos import Todos


class TodosTestCase(TestCase):
    email = "user1@gg.com"

    def setUp(self):
        user = Accounts.create_user(email=self.email, password="oijasod")
        Todos.add_todo(text="initial todo", user_id=user.id)

    def test_adding_todos(self):
        """Todos can be created by user"""
        user = Accounts.get_user_by_email(self.email)

        # check initial todo is returned
        initial_todos = Todos.list_todos(user_id=user.id)
        self.assertEqual(len(initial_todos), 1)

        # add more todos
        Todos.add_todo(text="second todo", user_id=user.id)
        Todos.add_todo(text="another todo", user_id=user.id)

        todos = Todos.list_todos(user_id=user.id)
        self.assertEqual(len(todos), 3)

    def test_updating_todos(self):
        """Todos can be created by user"""
        user = Accounts.get_user_by_email(self.email)

        todos = Todos.list_todos(user_id=user.id)
        todo = todos[0]
        self.assertEqual(todo.is_complete, False)

        Todos.update_todo(todo_id=todo.id, is_complete=True)
        updated_todo = Todos.get_todo_by_id(todo_id=todo.id)
        self.assertEqual(updated_todo.is_complete, True)
