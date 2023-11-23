import { Log, Transformer } from "../types.ts";

/** Transformer to filter the logs using a custom filter function */
export default function (fn: (log: Log) => boolean): Transformer {
  return function filter(log: Log): Log | undefined {
    if (fn(log)) {
      return log;
    }
  };
}
