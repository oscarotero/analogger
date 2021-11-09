import { Log, ReportData } from "../types.ts";
import { group, sortReport } from "../mod.ts";

export default function (logs: Log[]): ReportData {
  // Remove logs without referrer or referrers from search engines or social networks
  logs = logs.filter((log) =>
    !!log.referrer && log.searchEngine === undefined &&
    log.socialNetwork === undefined
  );

  // Group logs by referrer
  const grouped = group(
    logs,
    "referrer",
  );

  // Count visits by referrers
  let labels = [];
  let values = [];

  for (const [referrer, sessions] of grouped) {
    if (!referrer) {
      continue;
    }

    labels.push(referrer as string);
    values.push((sessions as Log[]).length);
  }

  [labels, values] = sortReport(labels, values);

  return {
    title: `Referrers (${labels.length}):`,
    labels,
    datasets: [{ name: "Referrers", values }],
  };
}
