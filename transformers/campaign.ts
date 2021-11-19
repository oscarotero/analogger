import { Log, Transformer } from "../types.ts";

/** Transformer detect the campaign of the log */
export default function (...parameters: string[]): Transformer {
  return function (log: Log): Log {
    if (log.searchParams) {
      for (const parameter of parameters) {
        const value = log.searchParams.get(parameter);

        if (value) {
          log.campaign = value;
          break;
        }
      }
    }
    return log;
  };
}
