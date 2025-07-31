import { Button, Modal, Text, TextInput } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  Fragment,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Stage,
  Layer,
  Rect,
  Text as KonvaText,
  Line,
  Circle,
} from "react-konva";
import { timeStringfromTimePoint } from "../../utils/time";
import type {
  CreateLogEntrySchema,
  DriverStatuses,
  LogEntrySchema,
} from "../../../generated/client";

interface ITimeSliceLineProps {
  colIdx: number;
  rowIdx: number;
  sliceIdx: number;
  rectWidth: number;
  status: string;
  timePoint: number;
  xOffset: number;
  yOffset: number;
  canBeActivated: boolean;
  onClick: (status: string, timePoint: number) => void;
}
function TimeSliceLine({
  colIdx,
  rowIdx,
  rectWidth,
  status,
  xOffset,
  yOffset,
  canBeActivated,
  timePoint,
  onClick,
  sliceIdx,
}: ITimeSliceLineProps) {
  const [isHovered, setIsHovered] = useState(false);
  const lineHeight =
    sliceIdx === 0
      ? rectWidth
      : sliceIdx === 1
        ? rectWidth / 2
        : sliceIdx === 2
          ? (rectWidth * 2) / 3
          : rectWidth / 2;
  return (
    <Line
      key={`timeslice-line-${colIdx}-${rowIdx}`}
      points={[
        xOffset + rowIdx * rectWidth + (sliceIdx * rectWidth) / 4,
        yOffset + rectWidth * (colIdx + 1),
        xOffset + rowIdx * rectWidth + (sliceIdx * rectWidth) / 4,
        yOffset + rectWidth * (colIdx + 1) - lineHeight,
        // yOffset + rectWidth * colIdx + lineHeight,
      ]}
      stroke="blue"
      strokeWidth={canBeActivated && isHovered ? 5 : 2}
      onMouseEnter={() => {
        if (!canBeActivated) {
          return;
        }
        setIsHovered(true);
      }}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => {
        if (!canBeActivated) {
          return;
        }
        onClick(status, timePoint);
      }}
    />
  );
}

interface IProps {
  logEntries: LogEntrySchema[];
  onAddLogEntry: (newLogEntry: CreateLogEntrySchema) => void;
  addLogEntryMutationPending: boolean;
}

export default function LogChart({
  logEntries,
  onAddLogEntry,
  addLogEntryMutationPending,
}: IProps) {
  const ref = useRef(null);
  const [viewWidth, setViewWidth] = useState(0);

  useLayoutEffect(() => {
    if (ref.current) setViewWidth(ref.current?.offsetWidth);
  }, []);

  const viewHeight = 250;
  // Divide by 30 parts
  // 1 for yaxis labels
  // 24 for hours
  // 1 for white space
  // 4 for totals
  const rectWidth = 800 / 30;
  const xOffset = 30;
  const hoursContainerXOffset = xOffset + rectWidth;
  const totalsContainerXOffset = xOffset + (1 + 24 + 1) * rectWidth;
  const yOffset = 50;
  const statuses: DriverStatuses[] = [
    "OFF_DUTY",
    "SLEEPER_BERTH",
    "DRIVING",
    "ON_DUTY",
    "DELIVERED",
  ];
  const statusIndexes: Record<DriverStatuses, number> = {
    OFF_DUTY: 0,
    SLEEPER_BERTH: 1,
    DRIVING: 2,
    ON_DUTY: 3,
    DELIVERED: 4,
  };
  const axes: string[] = ["Midnight"].concat(
    [...Array(11)].map((x, idx) => `${idx + 1}`),
    ["Noon"],
    [...Array(11)].map((x, idx) => `${idx + 1}`),
  );
  const [modalOpened, { open: openModal, close: closeModal }] =
    useDisclosure(false);

  useEffect(() => {
    if (!addLogEntryMutationPending) {
      closeModal();
    }
  }, [addLogEntryMutationPending, closeModal]);

  const lastLogEntry = useMemo(
    () => logEntries[logEntries.length - 1] as LogEntrySchema | undefined,
    [logEntries],
  );
  const [newLogEntry, setNewLogEntry] =
    useState<Partial<CreateLogEntrySchema> | null>(null);
  const [newLogEntryRemark, setNewLogEntryRemark] = useState("");
  const isNewLogEntryValid = useMemo(
    () =>
      newLogEntry?.status !== undefined &&
      newLogEntry?.time_point !== undefined &&
      newLogEntryRemark.length > 5,
    [newLogEntry, newLogEntryRemark],
  );

  const logEntryPairs = useMemo(
    () =>
      logEntries
        .slice(0, -1)
        .map((logEntry, idx) => [logEntry, logEntries[idx + 1]]),
    [logEntries],
  );
  const stageTotalTimePoints = useMemo(
    () =>
      logEntryPairs
        .map(([from, to]) => ({
          stage: from.status,
          diff: to.time_point - from.time_point,
        }))
        .reduce(
          (acc, { stage, diff }) => {
            return {
              ...acc,
              [stage]: diff + (acc[stage as DriverStatuses] ?? 0),
            };
          },
          {} as Record<DriverStatuses, number>,
        ),
    [logEntryPairs],
  );

  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [tooltipData, setTooltipData] = useState<LogEntrySchema | null>(null);
  const [isTooltipVisible, setTooltipVisible] = useState(false);
  const handleMouseMove = (e, logEntry: LogEntrySchema) => {
    const stage = e.target.getStage();
    const pos = stage.getPointerPosition();
    setTooltipPos({
      x: pos.x + 5,
      y: pos.y + 5,
    });
    setTooltipData(logEntry);
    setTooltipVisible(true);
  };
  return (
    <>
      <div>
        <Text fw={500} size="lg" c="blue">
          Click on the lines on the chart to add a Log Entry
        </Text>
        <Text fw={500} size="xs" c="red">
          First entry must be Off-Duty, any subsequent entries cannot have the
          same status as the previous entry or a time-slot before the last entry
        </Text>
      </div>
      <div className="w-full min-h-56" ref={ref}>
        <Stage width={viewWidth} height={viewHeight}>
          <Layer>
            {/* Draw circles to highlight log entries */}
            {logEntryPairs.map(([from, to], idx) => (
              <Line
                key={`statuslineh-${idx}`}
                points={[
                  hoursContainerXOffset + (from.time_point * rectWidth) / 4,
                  yOffset +
                    rectWidth * (statusIndexes[from.status] + 1) -
                    rectWidth / 2,
                  hoursContainerXOffset + (to.time_point * rectWidth) / 4,
                  yOffset +
                    rectWidth * (statusIndexes[from.status] + 1) -
                    rectWidth / 2,
                ]}
                stroke="black"
                strokeWidth={4}
              />
            ))}
            {/* Draw lines between two connected entries */}
            {logEntryPairs.map(([from, to], idx) => (
              <Line
                key={`statuslinev-${idx}`}
                points={[
                  hoursContainerXOffset + (to.time_point * rectWidth) / 4,
                  yOffset +
                    rectWidth * (statusIndexes[from.status] + 1) -
                    rectWidth / 2,
                  hoursContainerXOffset + (to.time_point * rectWidth) / 4,
                  yOffset +
                    rectWidth * (statusIndexes[to.status] + 1) -
                    rectWidth / 2,
                ]}
                stroke="black"
                strokeWidth={4}
              />
            ))}
            {statuses.map((status, statusIdx) => (
              <>
                <KonvaText
                  key={`yaxis-${statusIdx}`}
                  text={status}
                  width={40}
                  x={0}
                  y={yOffset + rectWidth * statusIdx}
                />

                {Object.entries(stageTotalTimePoints)
                  .filter(([currStage, total]) => currStage === status)
                  .map(([currStage, total]) => (
                    <Fragment key={`total-rect-${currStage}`}>
                      <Rect
                        x={totalsContainerXOffset}
                        y={yOffset + rectWidth * statusIdx}
                        stroke="black"
                        width={rectWidth * 4}
                        height={rectWidth}
                      />
                      <KonvaText
                        text={
                          timeStringfromTimePoint(total).split(" ")[0] + " H"
                        }
                        fontSize={18}
                        width={4 * rectWidth}
                        x={totalsContainerXOffset + 20}
                        y={yOffset + rectWidth * statusIdx + 5}
                      />
                    </Fragment>
                  ))}

                {axes.map((ax, idx) => (
                  <Fragment key={`axes-${statusIdx}-${idx}`}>
                    <KonvaText
                      text={ax}
                      width={rectWidth}
                      x={xOffset + rectWidth * (idx + 1)}
                      y={yOffset - 20}
                    />
                    <KonvaText
                      text={ax}
                      width={rectWidth}
                      x={xOffset + rectWidth * (idx + 1)}
                      y={rectWidth * 4 + yOffset * 2 - 10}
                    />
                  </Fragment>
                ))}
                {[...Array(24)].map((x, rowIdx) => (
                  <Fragment key={`hour-rect-${statusIdx}-${rowIdx}`}>
                    <Rect
                      x={hoursContainerXOffset + rowIdx * rectWidth}
                      y={yOffset + rectWidth * statusIdx}
                      stroke="black"
                      width={rectWidth}
                      height={rectWidth}
                    />
                    {[0, 1, 2, 3].map((sliceIdx) => (
                      <TimeSliceLine
                        rectWidth={rectWidth}
                        xOffset={hoursContainerXOffset}
                        yOffset={yOffset}
                        colIdx={statusIdx}
                        rowIdx={rowIdx}
                        sliceIdx={sliceIdx}
                        timePoint={rowIdx * 4 + sliceIdx}
                        status={status}
                        canBeActivated={
                          !(
                            lastLogEntry === undefined && status !== "OFF_DUTY"
                          ) &&
                          !(lastLogEntry?.status === status) &&
                          !(
                            lastLogEntry?.time_point &&
                            rowIdx * 4 + sliceIdx <= lastLogEntry.time_point
                          )
                        }
                        onClick={(status, time_point) => {
                          setNewLogEntry({ status, time_point });
                          openModal();
                        }}
                      />
                    ))}
                  </Fragment>
                ))}
                {logEntries
                  .filter((logEntry) => logEntry.status === status)
                  .map((logEntry, logEntryIdx) => (
                    <Circle
                      fill="red"
                      key={`point-${status}-${logEntryIdx}`}
                      x={
                        hoursContainerXOffset +
                        (logEntry.time_point * rectWidth) / 4
                      }
                      y={yOffset + statusIdx * rectWidth + rectWidth / 2}
                      radius={5}
                      onMouseMove={(e) => handleMouseMove(e, logEntry)}
                      onMouseOut={() => setTooltipVisible(false)}
                    />
                  ))}
              </>
            ))}
          </Layer>
          {/* Tooltip layer */}
          <Layer>
            <Rect
              x={tooltipPos.x}
              y={tooltipPos.y}
              height={100}
              width={300}
              fill="white"
              visible={isTooltipVisible}
            />
            <KonvaText
              text={`${tooltipData?.status} @ ${tooltipData?.time_point ? timeStringfromTimePoint(tooltipData?.time_point) : ""} `}
              x={tooltipPos.x + 20}
              y={tooltipPos.y + 30}
              height={20}
              width={300}
              fontSize={16}
              visible={isTooltipVisible}
            />
            <KonvaText
              text={`"${tooltipData?.remark}"`}
              x={tooltipPos.x + 20}
              y={tooltipPos.y + 50}
              height={20}
              width={300}
              fontSize={16}
              visible={isTooltipVisible}
            />
          </Layer>
        </Stage>

        <Modal
          opened={modalOpened}
          onClose={closeModal}
          title="Log Entry"
          centered
        >
          <div className="flex gap-5">
            <Text>{newLogEntry?.status}</Text>
            <Text>
              @
              {newLogEntry?.time_point !== undefined
                ? timeStringfromTimePoint(newLogEntry.time_point)
                : "--:--"}
            </Text>
          </div>
          <TextInput
            label="Remark"
            placeholder="Remark"
            value={newLogEntryRemark}
            onChange={(e) => {
              setNewLogEntryRemark(e.currentTarget?.value);
            }}
            error={
              newLogEntryRemark.length <= 5
                ? "Remark must be atleast 6 letters"
                : null
            }
          />
          <Button
            className="my-4"
            disabled={!isNewLogEntryValid || addLogEntryMutationPending}
            onClick={() => {
              if (newLogEntryRemark) {
                onAddLogEntry({ ...newLogEntry, remark: newLogEntryRemark });
                // closeModal();
              }
            }}
          >
            {addLogEntryMutationPending
              ? "Adding Log Entry.."
              : "Add Log Entry"}
          </Button>
        </Modal>
      </div>
    </>
  );
}
