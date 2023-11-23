import { Log, Transformer } from "../types.ts";

/** Transformer to filter the logs by some extensions */
export default function (allowedPaths: string[]): Transformer {
  return function (log: Log): Log | undefined {
    const { path } = log;

    if (path && allowedPaths.includes(path)) {
      return log;
    }
  };
}
