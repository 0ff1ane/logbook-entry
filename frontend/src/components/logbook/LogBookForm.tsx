import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Button,
  Checkbox,
  NumberInput,
  Paper,
  Text,
  TextInput,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";

import {
  appsLogbooksLogbooksRoutesAddLogbook,
  appsLogbooksLogentriesRoutesAddLogentry,
  type CreateLogBookSchema,
  type CreateLogEntrySchema,
  type CustomUserSchema,
  type LogBookSchema,
} from "../../../generated/client";
import LogChart from "./LogChart";
import { useMutation } from "@tanstack/react-query";
import { router, usePage } from "@inertiajs/react";
import dayjs from "dayjs";

interface IProps {
  logbook: LogBookSchema | null;
  onUpdateLogEntry?: () => void;
}

const DEFAULT_FORM_DATA = {
  driver_name: "",
  driver_initials: "",
  driver_number: "",
  operating_center_address: "",
  vehicle_number: "",
  trailer_number: "",
  shipper: "",
  commodity: "",
  load_number: "",
  start_date: dayjs().format("YYYY-MM-DD"),
};

type Entries<T> = {
  [K in keyof T]: [K, T[K]];
}[keyof T];

export default function LogBookForm({ logbook, onUpdateLogEntry }: IProps) {
  const { props } = usePage();
  const current_user = props.current_user as unknown as CustomUserSchema;

  const [logBookFormData, setLogBookFormData] = useState<CreateLogBookSchema>({
    ...DEFAULT_FORM_DATA,
    driver_name: current_user.name,
    driver_initials: current_user.initials,
  });

  const updateFormData = useCallback(
    (keyval: Entries<CreateLogBookSchema>) => {
      if (keyval) {
        setLogBookFormData({ ...logBookFormData, [keyval[0]]: keyval[1] });
      }
    },
    [logBookFormData],
  );

  // on mount
  useEffect(() => {
    if (logbook?.id) {
      setLogBookFormData({
        ...logbook,
      });
    }
  }, [logbook]);

  const isValidDriverName =
    logBookFormData.driver_name.length >= 5 &&
    logBookFormData.driver_name.length <= 20;
  const isValidDriverInitials =
    logBookFormData.driver_initials.length >= 2 &&
    logBookFormData.driver_initials.length <= 5;
  const isValidDriverNumber =
    logBookFormData.driver_number.length >= 5 &&
    logBookFormData.driver_number.length <= 20;
  const isValidOperatingAddress =
    logBookFormData.operating_center_address.length >= 5 &&
    logBookFormData.operating_center_address.length <= 20;
  const isValidVehicleNumber =
    logBookFormData.vehicle_number.length >= 5 &&
    logBookFormData.vehicle_number.length <= 20;
  const isValidTrailerNumber =
    logBookFormData.trailer_number.length >= 5 &&
    logBookFormData.trailer_number.length <= 20;
  const isValidShipper =
    logBookFormData.shipper.length >= 5 && logBookFormData.shipper.length <= 20;
  const isValidCommodity =
    logBookFormData.commodity.length >= 5 &&
    logBookFormData.commodity.length <= 20;
  const isValidLoadNumber =
    logBookFormData.load_number.length >= 5 &&
    logBookFormData.load_number.length <= 20;
  const isValidStartDate = logBookFormData.start_date.length >= 5;
  const isValidFormData = useMemo(() => {
    return (
      isValidDriverName &&
      isValidDriverNumber &&
      isValidOperatingAddress &&
      isValidVehicleNumber &&
      isValidTrailerNumber &&
      isValidShipper &&
      isValidCommodity &&
      isValidLoadNumber &&
      isValidStartDate
    );
  }, [
    isValidDriverName,
    isValidDriverNumber,
    isValidOperatingAddress,
    isValidVehicleNumber,
    isValidTrailerNumber,
    isValidShipper,
    isValidCommodity,
    isValidLoadNumber,
    isValidStartDate,
  ]);

  const addLogBookMutation = useMutation({
    mutationFn: () =>
      appsLogbooksLogbooksRoutesAddLogbook({
        body: logBookFormData,
        headers: { "X-XSRF-TOKEN": window.csrftoken },
      }),
    onSuccess: (resp) => {
      console.log(resp);
      if (resp.error) {
        alert(resp.error);
      } else if (resp.data?.success === false) {
        alert(resp.data.message);
      } else if (resp.data?.success && resp.data?.payload?.id) {
        console.log("redirect to /logbook/{id}");
        router.get(`/logbook/${resp.data?.payload?.id}`, {}, { replace: true });
      } else {
        alert("Unable to add Log Book");
      }
    },
  });

  const addLogEntryMutation = useMutation({
    mutationFn: (params: CreateLogEntrySchema) =>
      appsLogbooksLogentriesRoutesAddLogentry({
        body: {
          ...params,
          logbook_id: logbook?.id ?? -1,
        },
        headers: { "X-XSRF-TOKEN": window.csrftoken },
      }),
    onSuccess: (resp) => {
      console.log(resp);
      if (resp.error) {
        alert(resp.error);
      } else if (resp.data?.success === false) {
        alert(resp.data.message);
      } else if (resp.data?.success) {
        console.log("reload logbook data");
        onUpdateLogEntry?.();
      }
    },
  });

  const addLogBook = useCallback(() => {
    addLogBookMutation.mutate();
  }, [addLogBookMutation]);

  return (
    <Paper shadow="xs" p="xl" className="min-w-4xl">
      <div className="flex flex-col items-center">
        <Text fw={700} size="lg" c="blue">
          DRIVERS' DAILY LOG
        </Text>
        <Text size="xs" c="blue">
          One Calendar day(24 hours)
        </Text>
        <Text size="xs" c="blue">
          DRIVERS' DAILY LOG
        </Text>
      </div>
      <div className="flex justify-between">
        <div className="flex flex-col py-4">
          {/* Driver details */}
          <TextInput
            className="text-blue-500"
            label="Driver Name"
            placeholder="Your Driver Name"
            error={
              !isValidDriverName ? "Must be between 5 and 20 letters" : null
            }
            value={logBookFormData?.driver_name}
            onChange={(e) =>
              updateFormData(["driver_name", e.currentTarget.value])
            }
          />
          <TextInput
            className="text-blue-500"
            label="Driver Initials"
            placeholder="Your Initials"
            error={
              !isValidDriverInitials ? "Must be between 2 and 5 letters" : null
            }
            value={logBookFormData?.driver_initials}
            onChange={(e) =>
              updateFormData(["driver_initials", e.currentTarget.value])
            }
          />
          <TextInput
            className="text-blue-500"
            label="Driver Number"
            placeholder="Your Driver Number"
            error={
              !isValidDriverNumber ? "Must be between 5 and 20 letters" : null
            }
            value={logBookFormData?.driver_number}
            onChange={(e) =>
              updateFormData(["driver_number", e.currentTarget.value])
            }
          />
          <TextInput
            className="text-blue-500"
            label="Co-Driver Name(Optional)"
            placeholder="Your Co-Driver Name"
            value={logBookFormData?.codriver_name ?? ""}
            onChange={(e) =>
              updateFormData(["codriver_name", e.currentTarget.value])
            }
          />
          <TextInput
            className="text-blue-500"
            label="HOME OPERATING CENTER AND ADDRESS"
            placeholder=""
            error={
              !isValidOperatingAddress
                ? "Must be between 5 and 20 letters"
                : null
            }
            value={logBookFormData?.operating_center_address}
            onChange={(e) =>
              updateFormData([
                "operating_center_address",
                e.currentTarget.value,
              ])
            }
          />
        </div>
        {/* Vehicle details */}
        <div className="flex flex-col py-4">
          <TextInput
            className="text-blue-500"
            label="Vehicle Number"
            placeholder=""
            error={
              !isValidVehicleNumber ? "Must be between 5 and 20 letters" : null
            }
            value={logBookFormData?.vehicle_number}
            onChange={(e) =>
              updateFormData(["vehicle_number", e.currentTarget.value])
            }
          />
          <TextInput
            className="text-blue-500"
            label="Trailer Number"
            placeholder=""
            error={
              !isValidTrailerNumber ? "Must be between 5 and 20 letters" : null
            }
            value={logBookFormData?.trailer_number}
            onChange={(e) =>
              updateFormData(["trailer_number", e.currentTarget.value])
            }
          />
          <NumberInput
            className="text-blue-500"
            label="Miles Driven"
            placeholder=""
            disabled={typeof logbook?.id !== "number"}
          />
        </div>
        {/* Date details */}
        <div className="flex flex-col py-4 gap-3">
          <DatePickerInput
            className="min-w-3xs text-blue-500"
            label="Start date"
            placeholder="Start date"
            error={!isValidStartDate ? "Please enter a date" : null}
            value={
              logBookFormData?.start_date.length > 0
                ? logBookFormData?.start_date
                : new Date()
            }
            onChange={(date) => date && updateFormData(["start_date", date])}
          />
          <Checkbox
            label="Check if multiday log"
            size="md"
            className="text-blue-500 py-1"
          />
          <DatePickerInput
            className="min-w-3xs text-blue-500"
            label="End date"
            placeholder="End date"
            disabled={typeof logbook?.id !== "number"}
          />
        </div>
      </div>
      {logbook?.id && (
        <LogChart
          onAddLogEntry={(newLogEntry) =>
            addLogEntryMutation.mutate(newLogEntry)
          }
          logEntries={logbook?.log_entries ?? []}
        />
      )}
      {/* Shipping/Commodity Details */}
      <div className="w-full flex justify-between py-4">
        <TextInput
          className="text-blue-500"
          label="Shipper"
          placeholder="Shipper"
          error={!isValidShipper ? "Must be between 5 and 20 letters" : null}
          value={logBookFormData?.shipper}
          onChange={(e) => updateFormData(["shipper", e.currentTarget.value])}
        />
        <TextInput
          className="text-blue-500"
          label="Commodity"
          placeholder="Commodity"
          error={!isValidCommodity ? "Must be between 5 and 20 letters" : null}
          value={logBookFormData?.commodity}
          onChange={(e) => updateFormData(["commodity", e.currentTarget.value])}
        />
        <TextInput
          className="text-blue-500"
          label="Load Number"
          placeholder="Load Number"
          error={!isValidLoadNumber ? "Must be between 5 and 20 letters" : null}
          value={logBookFormData?.load_number}
          onChange={(e) =>
            updateFormData(["load_number", e.currentTarget.value])
          }
        />
      </div>
      {logbook === null && (
        <Button disabled={!isValidFormData} onClick={() => addLogBook()}>
          Create LogBook
        </Button>
      )}
    </Paper>
  );
}
