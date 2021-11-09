import { Log, ReportData } from "../types.ts";
import { group, sortReport } from "../mod.ts";

export default function (logs: Log[]): ReportData {
  const report: Map<string, number> = new Map();

  // Group visits by sessionId
  const sessions = group(
    logs,
    "sessionId",
  );

  // Count sessions by search engine
  for (const session of sessions.values()) {
    const logs = session as Log[];
    const index = logs.findIndex((log) => log.searchEngine);
    const name = index === -1
      ? "Not organic"
      : logs[index].searchEngine as string;
    const total = report.get(name) || 0;
    report.set(name, total + logs.length);
  }

  // Generate the report
  let labels = [...report.keys()];
  let values = [...report.values()];

  [labels, values] = sortReport(labels, values);

  return {
    title: `Organic traffic:`,
    labels,
    datasets: [{ name: "Organic Traffic", values }],
  };
}
