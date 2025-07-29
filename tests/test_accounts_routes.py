from django.test import TestCase

from .testclient import SessionTestClient
from apps.accounts.routes import router as accounts_router

class AccountsRoutesTest(TestCase):
    def test_register(self):
        client = SessionTestClient(accounts_router)
        register_response = client.post(path="/register", data=None, json={"email": "john", "password": "smith"})

        self.assertEqual(register_response.status_code, 200)
        self.assertEqual(register_response.json(), {'message': 'User registered', 'success': True})

        login_response = client.post(path="/login", data=None, json={"email": "john", "password": "smith"})

        self.assertEqual(login_response.status_code, 200)
        self.assertEqual(login_response.json(), {'message': None, 'success': True})
