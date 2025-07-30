const timeFromTimePoint = (timepoint: number) => {
  const hours = Math.floor(timepoint / 4);
  const minutes = (timepoint - hours * 4) * 15;
  return [hours, minutes];
};

const timeStringfromTimePoint = (timepoint: number) => {
  const [hours, minutes] = timeFromTimePoint(timepoint);
  const hoursStr = hours < 10 ? `0${hours}` : `${hours}`;
  const minutesStr = minutes < 10 ? `0${minutes}` : `${minutes}`;
  const postFix = timepoint < 12 * 4 ? "AM" : "PM";
  return `${hoursStr}:${minutesStr} ${postFix}`;
};

export { timeFromTimePoint, timeStringfromTimePoint };
