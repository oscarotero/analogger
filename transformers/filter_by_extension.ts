import { LogStream, Transformer } from "../types.ts";
import { extname } from "../deps.ts";

/** Transformer to filter the logs by some extensions */
export default function (allowedExtensions: string[]): Transformer {
  return async function* (logs: LogStream): LogStream {
    for await (const log of logs) {
      const { path } = log;
      const ext = path ? extname(path) : "";

      if (allowedExtensions.includes(ext)) {
        yield log;
      }
    }
  };
}
