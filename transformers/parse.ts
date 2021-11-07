import { LogStream, Transformer } from "../types.ts";

/** Only "combined" format is supported */
export type Format = "combined";

/** Transformer to parse the raw log */
export default function (format: Format = "combined"): Transformer {
  if (format !== "combined") {
    throw new Error(`Unsupported format: ${format}`);
  }

  return async function* parse(logs: LogStream): LogStream {
    for await (const log of logs) {
      try {
        const parsed = parseLog(log.raw);
        yield {
          ...log,
          ...parsed,
        };
      } catch {
        // ignore
      }
    }
  };
}

interface ParsedLog {
  ip: string;
  user?: string;
  date: Date;
  method: string; //"GET" | "POST" | "PUT" | "DELETE" | "HEAD" | "OPTIONS" | "CONNECT" | "TRACE" | "PATCH";
  path: string;
  protocol: string;
  status: number;
  size: number;
  referrer?: string;
  userAgent?: string;
}

const pattern =
  /([\d.]+)[\s-]+([^\s]*)[\s-]+\[(\d{2})\/(\w+)\/(\d{4})\:(\d{2})\:(\d{2})\:(\d{2})\s+([\+\d]+)\]\s+"(\w+)\s+([^\s]+)\s+([\w\/\.\d]+)"\s+(\d+)\s+(\d+)\s+"([^"]*)"\s+"([^"]*)"/;

function parseLog(log: string): ParsedLog {
  const match = pattern.exec(log);

  if (!match) {
    throw new Error(`Invalid log format: ${log}`);
  }

  const ip = match[1];
  const user = str(match[2]);
  const date = new Date(
    `${match[3]} ${match[4]} ${match[5]} ${match[6]}:${match[7]}:${match[8]} ${
      match[9]
    }`,
  );
  const method = match[10];
  const path = match[11];
  const protocol = match[12];
  const status = parseInt(match[13]);
  const size = parseInt(match[14]);
  const referrer = str(match[15]);
  const userAgent = str(match[16]);

  return {
    ip,
    user,
    date,
    method,
    path,
    protocol,
    status,
    size,
    referrer,
    userAgent,
  };
}

function str(value: string): string | undefined {
  value = value.trim();
  if (!value || value === "-") {
    return undefined;
  }

  return value;
}
