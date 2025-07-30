import { Fragment, useMemo } from "react";

import LogEntry from "../components/logbook/LogEntry";
import LogBookForm from "../components/logbook/LogBookForm";
import { useQuery } from "@tanstack/react-query";
import { appsLogbooksLogbooksRoutesGetLogbook } from "../../generated/client";
import { Alert, Loader } from "@mantine/core";
import { IconInfoCircle } from "@tabler/icons-react";

export default function LogBook(props) {
  const logBookQuery = useQuery({
    queryKey: ["logbook", props.logbook_id],
    queryFn: () =>
      appsLogbooksLogbooksRoutesGetLogbook({
        path: {
          logbook_id: props.logbook_id,
        },
      }),
  });
  const logBookData = useMemo(() => logBookQuery.data?.data, [logBookQuery]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      {logBookQuery.isFetching ? (
        <div>
          <Loader />
        </div>
      ) : logBookQuery.error ? (
        <Alert
          variant="light"
          color="red"
          title={logBookQuery.error.name}
          icon={<IconInfoCircle />}
        >
          {logBookQuery.error.message}
        </Alert>
      ) : logBookData === null || logBookData === undefined ? (
        <Alert
          variant="light"
          color="orange"
          title="Cannot load Log Book details"
          icon={<IconInfoCircle />}
        >
          Sorry, we are unable to load the Log Book details. Please try again
          later
        </Alert>
      ) : (
        <div className="flex flex-col gap-3 items-center">
          <LogBookForm
            logbook={logBookData}
            onUpdateLogEntry={() => logBookQuery.refetch()}
          />
          <div className="w-4xl flex gap-3 overflow-x-scroll">
            {(logBookData.log_entries ?? []).map((logEntry, idx) => (
              <Fragment key={idx}>
                <LogEntry
                  status={logEntry.status}
                  timePoint={logEntry.time_point}
                  remark={logEntry.remark}
                />
              </Fragment>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
