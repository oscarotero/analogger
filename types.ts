/** The log format */
export interface Log {
  raw: string;
  ip?: string;
  user?: string;
  sessionId?: string;
  date?: Date;
  method?: string;
  path?: string;
  protocol?: string;
  status?: number;
  size?: number;
  referrer?: URL;
  userAgent?: string;
  isBot?: boolean;
  browserName?: string;
  browserVersion?: string;
  deviceModel?: string;
  deviceType?: string;
  deviceVendor?: string;
  engineName?: string;
  engineVersion?: string;
  osName?: string;
  osVersion?: string;
  searchEngine?: string;
  socialNetwork?: string;
  searchParams?: URLSearchParams;
  campaign?: string;
  [index: string]: unknown;
}

/** A group of logs */
export type LogGroup = Map<string | number, Log[] | LogGroup>;

/** The function to transform a logs */
export type Transformer = (
  log: Log,
) => Log | undefined | Promise<Log | undefined>;

/** Available time intervals used by reports */
export type TimeInterval = "hourly" | "daily" | "weekly" | "monthly" | "yearly";

/** A report result */
export interface ReportData {
  title: string;
  labels: string[];
  datasets: Array<{
    name: string;
    values: number[];
  }>;
}
