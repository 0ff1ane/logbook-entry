from typing import List, Optional
from pydantic import BaseModel
from ninja import ModelSchema

from apps.accounts.schemas import CustomUserSchema
from .models import DriverStatuses, LogBook, LogEntry


class LogEntrySchema(ModelSchema):
    status: DriverStatuses
    class Meta:
        model = LogEntry
        fields = [
        'time_point',
        'remark',
 ]

class LogBookSchema(ModelSchema):
    created_by: CustomUserSchema
    log_entries: List[LogEntrySchema]

    class Meta:
        model = LogBook
        fields = [
        'id',
        'driver_name',
        'driver_initials',
        'driver_number',
        'codriver_name',
        'operating_center_address',
        'vehicle_number',
        'trailer_number',
        'miles_driven',
        'shipper',
        'commodity',
        'load_number',
        'start_date',
        'end_date',
        'created_at',
 ]


class CreateLogBookSchema(BaseModel):
    driver_name: str
    driver_initials: str
    driver_number: str
    codriver_name: Optional[str] = None
    operating_center_address: str
    vehicle_number: str
    trailer_number: str
    shipper: str
    commodity: str
    load_number: str
    start_date: str


class CreateLogBookResponseSchema(BaseModel):
    success: bool
    message: Optional[str] = None
    payload: Optional[LogBookSchema] = None


class UpdateLogBookSchema(BaseModel):
    logbook_id: int
    miles_driven: int
    end_date: str


class CreateLogEntrySchema(BaseModel):
    logbook_id: int
    status: DriverStatuses
    time_point: int
    remark: str


class CreateLogEntryResponseSchema(BaseModel):
    success: bool
    message: Optional[str] = None
    payload: Optional[LogEntrySchema] = None
