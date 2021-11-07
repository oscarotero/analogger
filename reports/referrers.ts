import { Log, ReportData } from "../types.ts";
import { group } from "../mod.ts";

export default function (
  logs: Log[],
): ReportData {
  const grouped = group(
    logs,
    "referrer",
  );

  const labels = [];
  const data = [];

  for (const [referrer, sessions] of grouped) {
    if (!referrer) {
      continue;
    }

    labels.push(referrer as string);
    data.push((sessions as Log[]).length);
  }

  return {
    title: `Referrers:`,
    labels,
    datasets: [{ name: "Referrers", values: data }],
  };
}
