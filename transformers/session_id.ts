import { Log, Transformer } from "../types.ts";
import { createHash } from "../deps.ts";

/** Transformer to generate a session id automatically */
export default function (): Transformer {
  return function (log: Log): Log | undefined {
    const sha1 = createHash("sha1");
    sha1.update(
      `${log.ip}-${log.user}-${log.date?.toDateString()}-${log.userAgent}`,
    );
    log.sessionId = sha1.toString();
    return log;
  };
}
