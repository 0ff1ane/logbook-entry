from django.test import TestCase

from apps.accounts.accounts import Accounts
from apps.logbooks.logbooks import LogBooks
from apps.logbooks.models import DriverStatuses


class LogBooksTestCase(TestCase):
    email = "user1@gg.com"

    def setUp(self):
        user = Accounts.create_user(email=self.email, password="oijasod", name="Dummy", initials="YSB")
        LogBooks.add_logbook(
            user_id=user.id,
            driver_name="Original Driver",
            driver_initials="OD",
            driver_number="1233123",
            codriver_name=None,
            operating_center_address="Bora Bora",
            vehicle_number="V821323",
            trailer_number="T123231",
            shipper="Acme Machines",
            commodity="Paper Planes",
            load_number="L121233",
            start_date="2025-01-01"
        )

    def test_adding_logbook(self):
        """LogBooks can be created by user"""
        user = Accounts.get_user_by_email(self.email)

        # check initial logbook is returned
        initial_logbooks = LogBooks.list_logbooks(user_id=user.id)
        self.assertEqual(len(initial_logbooks), 1)

        # add more todos
        LogBooks.add_logbook(
            user_id=user.id,
            driver_name="Driver Name second",
            driver_initials="DSN",
            driver_number="1233123",
            codriver_name=None,
            operating_center_address="Bora Bora",
            vehicle_number="V821323",
            trailer_number="T123231",
            shipper="Acme Machines",
            commodity="Paper Planes",
            load_number="L121233",
            start_date="2025-01-01"
        )
        LogBooks.add_logbook(
            user_id=user.id,
            driver_name="Driver Name Second",
            driver_initials="DSN",
            driver_number="1233123",
            codriver_name=None,
            operating_center_address="Bora Bora",
            vehicle_number="V821323",
            trailer_number="T123231",
            shipper="Acme Machines",
            commodity="Paper Planes",
            load_number="L121233",
            start_date="2025-01-01"
        )

        logbooks = LogBooks.list_logbooks(user_id=user.id)
        self.assertEqual(len(logbooks), 3)

    def test_adding_logentries(self):
        """Todos can be created by user"""
        user = Accounts.get_user_by_email(self.email)
        logbook = LogBooks.list_logbooks(user_id=user.id)[0]
        initial_logbook = LogBooks.get_logbook_by_id(logbook_id=logbook.id)

        self.assertEqual(initial_logbook.driver_name, "Original Driver")
        self.assertEqual(len(initial_logbook.log_entries.all()), 0)

        LogBooks.add_logentry(logbook_id=logbook.id, status=DriverStatuses.OFF_DUTY, time_point=3, remark="Some remark")
        updated_logbook = LogBooks.get_logbook_by_id(logbook_id=logbook.id)
        self.assertEqual(updated_logbook.driver_name, "Original Driver")
        self.assertEqual(len(updated_logbook.log_entries.all()), 1)
