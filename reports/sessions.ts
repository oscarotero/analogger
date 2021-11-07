import { Log, LogGroup, ReportData, TimeInterval } from "../types.ts";
import { dateToString, group } from "../mod.ts";

export default function (
  logs: Log[],
  interval: TimeInterval = "daily",
): ReportData {
  const grouped = group(
    logs,
    (log) => dateToString(log.date!, interval),
    "sessionId",
  );

  const labels = [];
  const data = [];

  for (const [time, sessions] of grouped) {
    labels.push(time as string);
    data.push((sessions as LogGroup).size);
  }

  return {
    title: `Sessions (${interval})`,
    labels,
    datasets: [{ name: "Sessions", values: data }],
  };
}
