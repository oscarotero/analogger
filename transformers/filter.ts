import { Log, Transformer } from "../types.ts";

/** Transformer to filter the logs using a custom filter function */
export default function (filter: (log: Log) => boolean): Transformer {
  return function (log: Log): Log | undefined {
    if (filter(log)) {
      return log;
    }
  };
}
