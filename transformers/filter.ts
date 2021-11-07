import { Log, LogStream, Transformer } from "../types.ts";

/** Transformer to filter the logs using a custom filter function */
export default function (filter: (log: Log) => boolean): Transformer {
  return async function* (logs: LogStream): LogStream {
    for await (const log of logs) {
      if (filter(log)) {
        yield log;
      }
    }
  };
}
