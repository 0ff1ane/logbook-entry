import datetime
from django.db import models
from django.db.models.functions import Now

from apps.accounts.models import CustomUser


class Todo(models.Model):
    text = models.CharField(max_length=200)
    is_complete = models.BooleanField(default=False)
    created_by = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    created_at = models.DateTimeField("Created at", db_default=Now())

    def __str__(self):
        return self.text
