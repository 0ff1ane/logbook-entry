from typing import Optional, Tuple
from apps.logbooks.models import DriverStatuses, LogBook, LogEntry
from apps.logbooks.schemas import LogBookSchema


class LogBooks:
    @staticmethod
    def list_logbooks(user_id):
        return LogBook.objects.filter(created_by_id=user_id).order_by("-created_at").prefetch_related("log_entries").all()

    @staticmethod
    def get_logbook_by_id(logbook_id):
        logbook = LogBook.objects.filter(id=logbook_id).prefetch_related("log_entries").first()
        return logbook

    @staticmethod
    def add_logbook(
        user_id: int,
        driver_name: Optional[str],
        driver_initials: str,
        driver_number: str,
        codriver_name: Optional[str],
        operating_center_address: str,
        vehicle_number: str,
        trailer_number: str,
        shipper: str,
        commodity: str,
        load_number: str,
        start_date: str
    ) -> Tuple[bool, str | LogBookSchema]:
        try:
            logbook = LogBook.objects.create(
                created_by_id=user_id,
                driver_name=driver_name,
                driver_initials=driver_initials,
                driver_number=driver_number,
                codriver_name=codriver_name,
                operating_center_address=operating_center_address,
                vehicle_number=vehicle_number,
                trailer_number=trailer_number,
                shipper=shipper,
                commodity=commodity,
                load_number=load_number,
                start_date=start_date
            )
            return (ok := True, logbook)
        except Exception as e:
            print(e)
            return (ok := False, "Unable to create Log")

    @staticmethod
    def update_logbook(logbook_id, miles_driven: int | None = None, end_date: str | None = None):
        logbook = LogBooks.get_logbook_by_id(logbook_id)
        if miles_driven is not None:
            logbook.miles_driven = miles_driven
        if end_date is not None:
            logbook.end_date = end_date
        logbook.save()
        return logbook


    @staticmethod
    def add_logentry(
        logbook_id: int,
        status: str,
        time_point: int,
        remark: str
    ):
        most_recent_logentry = LogBooks.get_most_recent_logentry(logbook_id)
        if most_recent_logentry is None and status != DriverStatuses.OFF_DUTY:
            return (ok := False, "First entry must be OFF_DUTY")
        elif most_recent_logentry is not None and most_recent_logentry.status == status:
            return (ok := False, "New entry cannot have same status as most recent entry")
        else:
            logentry = LogEntry.objects.create(
                logbook_id=logbook_id,
                status=status,
                time_point=time_point,
                remark=remark
            )
            return (ok := True, logentry)

    @staticmethod
    def get_most_recent_logentry(logbook_id):
        logentry = LogEntry.objects.filter(logbook_id=logbook_id).order_by('-time_point').first()
        return logentry
