from typing import List, Optional
from ninja import Router

from apps.logbooks.logbooks import LogBooks
from apps.logbooks.schemas import CreateLogBookResponseSchema, CreateLogBookSchema, UpdateLogBookSchema, LogBookSchema

router = Router()

@router.get('/', response=List[LogBookSchema])
def list_logbooks(request):
    current_user = request.user
    return LogBooks.list_logbooks(user_id=current_user.id)

@router.get('/{logbook_id}', response=Optional[LogBookSchema])
def get_logbook(request, logbook_id: int):
    return LogBooks.get_logbook_by_id(logbook_id)


@router.post('/', response=CreateLogBookResponseSchema, auth=None)
def add_logbook(request, payload: CreateLogBookSchema):
    current_user = request.user
    if not current_user.is_authenticated:
        return CreateLogBookResponseSchema(success=False, message="Your session may have timed out. Please login again")

    (ok, logbook_or_err) = LogBooks.add_logbook(
        user_id=current_user.id,
        driver_name=payload.driver_name,
        driver_initials=payload.driver_initials,
        driver_number=payload.driver_number,
        codriver_name=payload.codriver_name,
        operating_center_address=payload.operating_center_address,
        vehicle_number=payload.vehicle_number,
        trailer_number=payload.trailer_number,
        shipper=payload.shipper,
        commodity=payload.commodity,
        load_number=payload.load_number,
        start_date=payload.start_date
    )
    if not ok:
        return CreateLogBookResponseSchema(success=False, message=logbook_or_err)

    return CreateLogBookResponseSchema(success=True, payload=logbook_or_err)



@router.put('/', response=LogBookSchema, auth=None)
def update_logbook(request, payload: UpdateLogBookSchema):
    current_user = request.user
    if not current_user.is_authenticated:
        return CreateLogBookResponseSchema(success=False, message="Your session may have timed out. Please login again")

    return LogBooks.update_logbook(
        logbook_id=payload.logbook_id,
        miles_driven=payload.miles_driven,
        end_date=payload.end_date,
    )
