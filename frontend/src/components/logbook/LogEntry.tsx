import { Paper, Text } from "@mantine/core";
import { timeStringfromTimePoint } from "../../utils/time";

export default function LogEntry({
  status,
  timePoint,
  remark,
}: {
  status: string;
  timePoint: number;
  remark: string;
}) {
  return (
    <Paper shadow="xs" p="xl" className="max-w-sm">
      <Text fw={500} size="md">
        {status}
      </Text>
      <Text>At: {timeStringfromTimePoint(timePoint)}</Text>
      <Text>Remarks: {remark}</Text>
    </Paper>
  );
}
