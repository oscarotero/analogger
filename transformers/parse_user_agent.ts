import { Log, Transformer } from "../types.ts";
import { UAParser } from "../deps.ts";

/** Transformer to parse the user-agent string and store the values in different properties */
export default function (): Transformer {
  return function parse(log: Log): Log {
    try {
      if (log.userAgent) {
        const parsed = parseUA(log.userAgent);
        return { ...log, ...parsed };
      }
    } catch {
      // ignore
    }

    return log;
  };
}

interface UserAgent {
  browserName?: string;
  browserVersion?: string;
  deviceModel?: string;
  deviceType?: string;
  deviceVendor?: string;
  engineName?: string;
  engineVersion?: string;
  osName?: string;
  osVersion?: string;
}

const uaParser = new UAParser();

function parseUA(ua: string): UserAgent {
  const results = uaParser.setUA(ua).getResult();

  return {
    browserName: results.browser.name,
    browserVersion: results.browser.version,
    deviceModel: results.device.model,
    deviceType: results.device.type,
    deviceVendor: results.device.vendor,
    engineName: results.engine.name,
    engineVersion: results.engine.version,
    osName: results.os.name,
    osVersion: results.os.version,
  };
}
