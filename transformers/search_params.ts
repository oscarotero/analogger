import { Log, Transformer } from "../types.ts";

/** Transformer to parse the URL search params */
export default function (): Transformer {
  return function (log: Log): Log {
    if (log.path?.includes("?")) {
      const [path, query] = log.path.split("?");
      log.path = path;
      log.searchParams = new URLSearchParams(query);
    }
    return log;
  };
}
