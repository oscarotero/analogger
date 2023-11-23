import { Log, Transformer } from "../types.ts";

/** Transformer to generate a session id automatically */
export default function (): Transformer {
  return async function (log: Log): Promise<Log> {
    log.sessionId = await sha1(
      `${log.ip}-${log.user}-${log.date?.toDateString()}-${log.userAgent}`,
    );
    return log;
  };
}

const decoder = new TextDecoder();
const encoder = new TextEncoder();
export async function sha1(message: string): Promise<string> {
  const hash = await crypto.subtle.digest("SHA-1", encoder.encode(message));
  return decoder.decode(hash);
}
