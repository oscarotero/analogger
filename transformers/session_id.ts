import { LogStream, Transformer } from "../types.ts";
import { createHash } from "../deps.ts";

/** Transformer to generate a session id automatically */
export default function (): Transformer {
  return async function* (logs: LogStream): LogStream {
    for await (const log of logs) {
      const sha1 = createHash("sha1");
      sha1.update(
        `${log.ip}-${log.user}-${log.date?.toDateString()}-${log.userAgent}`,
      );
      log.sessionId = sha1.toString();
      yield log;
    }
  };
}
