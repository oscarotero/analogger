import { Log, Transformer } from "../types.ts";

/** Transformer to limit the number of logs */
export default function (limit: number): Transformer {
  let count = 0;

  return function (log: Log): Log | undefined {
    if (++count <= limit) {
      return log;
    }
  };
}
