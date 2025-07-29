from django.test import TestCase, Client

from apps.accounts.accounts import Accounts
from apps.todos.todos import Todos


class AccountsRoutesTest(TestCase):
    email = "user1@gg.com"
    password = "09u23alkdsj"

    def setUp(self) -> None:
        user = Accounts.create_user(email=self.email, password=self.password)
        Todos.add_todo(text="A todo todo", user_id=user.id)

    def test_listing_user_todos(self):
        django_client = Client()
        django_client.login(username=self.email, password=self.password)
        todos_response = django_client.get(path="/api/todos/")

        self.assertEqual(todos_response.status_code, 200)
        self.assertEqual(todos_response.json()[0]['text'], "A todo todo")
        self.assertEqual(todos_response.json()[0]['created_by']['email'], self.email)

    def test_adding_todos(self):
        django_client = Client()
        django_client.login(username=self.email, password=self.password)
        add_todo_response = django_client.post(path="/api/todos/", data={"text": "A new todo"}, content_type="application/json")
        self.assertEqual(add_todo_response.status_code, 200)
        self.assertEqual(add_todo_response.json()['text'], "A new todo")
        self.assertEqual(add_todo_response.json()['created_by']['email'], self.email)
