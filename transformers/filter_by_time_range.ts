import { LogStream, Transformer } from "../types.ts";

/** Transformer to filter logs by a specific time range */
export default function (from?: Date, to?: Date): Transformer {
  return async function* (logs: LogStream): LogStream {
    for await (const log of logs) {
      if (!log.date) {
        continue;
      }

      if (from && log.date < from) {
        continue;
      }

      if (to && log.date > to) {
        continue;
      }

      yield log;
    }
  };
}
