import datetime
from django.db import models
from django.db.models.functions import Now

from apps.accounts.models import CustomUser

class LogBook(models.Model):
    # TODO - add validators
    # Driver details
    driver_name = models.CharField(max_length=200)
    driver_initials = models.CharField(max_length=10)
    driver_number = models.CharField(max_length=200)
    codriver_name = models.CharField(max_length=200, null=True)
    # operating center and address
    operating_center_address = models.CharField(max_length=200)
    # vehicle details
    vehicle_number = models.CharField(max_length=200)
    trailer_number = models.CharField(max_length=200)
    miles_driven = models.PositiveIntegerField(null=True)
    # load details
    shipper = models.CharField(max_length=200)
    commodity = models.CharField(max_length=200)
    load_number = models.CharField(max_length=200)
    # dates
    start_date = models.DateField()
    end_date = models.DateField(null=True)

    created_by = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    created_at = models.DateTimeField("Created at", db_default=Now())

    def __str__(self):
        return f"{self.driver_name} @ {self.start_date}"


class DriverStatuses(models.TextChoices):
    OFF_DUTY = "OFF_DUTY", "OFF_DUTY"
    SLEEPER_BERTH = "SLEEPER_BERTH", "SLEEPER_BERTH"
    DRIVING = "DRIVING", "DRIVING"
    ON_DUTY = "ON_DUTY", "ON_DUTY"
    DELIVERED = "DELIVERED", "DELIVERED"


class LogEntry(models.Model):
    status = models.CharField(max_length=20, choices=DriverStatuses.choices)
    time_point = models.PositiveIntegerField()
    remark = models.CharField(max_length=200)

    logbook = models.ForeignKey(LogBook, related_name="log_entries", on_delete=models.CASCADE)
    created_at = models.DateTimeField("Created at", db_default=Now())

    def __str__(self):
        return f"{self.status} @ {self.time_point}"
