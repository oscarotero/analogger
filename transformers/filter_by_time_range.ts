import { Log, Transformer } from "../types.ts";

/** Transformer to filter logs by a specific time range */
export default function (from?: Date, to?: Date): Transformer {
  return function (log: Log): Log | undefined {
    if (!log.date) {
      return;
    }

    if (from && log.date < from) {
      return;
    }

    if (to && log.date > to) {
      return;
    }

    return log;
  };
}
