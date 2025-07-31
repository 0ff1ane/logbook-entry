from ninja import Router

from apps.logbooks.schemas import CreateLogEntryResponseSchema, CreateLogEntrySchema
from apps.logbooks.logbooks import LogBooks

router = Router()


@router.post('/', response=CreateLogEntryResponseSchema, auth=None)
def add_logentry(request, payload: CreateLogEntrySchema):
    current_user = request.user
    if not current_user.is_authenticated:
        return CreateLogEntryResponseSchema(success=False, message="Your session may have timed out. Please login again")

    logbook = LogBooks.get_logbook_by_id(payload.logbook_id)
    if logbook.created_by_id != current_user.id:
        return CreateLogEntryResponseSchema(
            success=False,
            message="Only user who created Log can add entries"
        )
    (ok, log_entry_or_error) = LogBooks.add_logentry(
        logbook_id=payload.logbook_id,
        status=payload.status,
        time_point=payload.time_point,
        remark=payload.remark
    )
    if not ok:
        return CreateLogEntryResponseSchema(
            success=False,
            message=log_entry_or_error
        )
    return CreateLogEntryResponseSchema(
        success=True,
        payload=log_entry_or_error
    )
