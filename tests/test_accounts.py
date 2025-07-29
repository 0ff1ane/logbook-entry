from django.test import TestCase
from apps.accounts.accounts import Accounts


class AccountsTestCase(TestCase):
    email1 = "user1@gg.com"
    email2 = "user2@gg.com"
    def setUp(self):
        Accounts.create_user(email=self.email1, password="oijasod")
        Accounts.create_user(email=self.email2, password="joaisjdosd")

    def test_users_exist(self):
        """Users created are in database"""
        self.assertIsNotNone(Accounts.get_user_by_email(self.email1))
        self.assertIsNotNone(Accounts.get_user_by_email(self.email2))
