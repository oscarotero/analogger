import { Log, Transformer } from "../types.ts";
import { extname } from "../deps.ts";

/** Transformer to filter the logs by some extensions */
export default function (allowedExtensions: string[]): Transformer {
  return function (log: Log): Log | undefined {
    const { path } = log;
    const ext = path ? extname(path) : "";

    if (allowedExtensions.includes(ext)) {
      return log;
    }
  };
}
