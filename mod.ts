import {
  Log,
  LogGroup,
  ReportData,
  TimeInterval,
  Transformer,
} from "./types.ts";

import { TextLineStream } from "./deps.ts";
export * as transformers from "./transformers.ts";
export * as reports from "./reports.ts";

/** Transform a stream of logs and return an array */
export async function transform(
  input: AsyncIterableIterator<Log>,
  ...transformers: Transformer[]
): Promise<Log[]> {
  const logs: Log[] = [];

  logs: for await (let log of input) {
    for (const transformer of transformers) {
      const result = await transformer(log);

      if (!result) {
        continue logs;
      }
      log = result;
    }

    logs.push(log);
  }

  return logs;
}

/** Read logs from a file */
export async function* read(
  url: string,
  limit = 10000,
): AsyncIterableIterator<Log> {
  // Read a file line by line
  const res = await fetch(url);
  const lines = res.body!
    .pipeThrough(new TextDecoderStream())
    .pipeThrough(new TextLineStream());

  // Parse each line
  let count = 0;
  for await (const raw of lines) {
    yield { raw };

    if (++count >= limit) {
      break;
    }
  }
}

export type Key = string | number | ((log: Log) => string | number);

/** Group an array of logs */
export function group(logs: Log[], ...keys: Key[]): LogGroup {
  const map = new Map<string | number, Log[]>();
  const key = keys.shift();

  if (!key) {
    throw new Error("No key provided");
  }

  for (const log of logs) {
    let name = typeof key === "function"
      ? key(log)
      : (log[key] as string | number | URL);

    if (name instanceof URL) {
      name = name.href;
    }

    if (!map.has(name)) {
      map.set(name, []);
    }
    map.get(name)!.push(log);
  }

  if (keys.length) {
    const grouped = new Map<string | number, LogGroup>();
    for (const [name, logs] of map) {
      grouped.set(name, group(logs, ...keys));
    }
    return grouped;
  }

  return map;
}

/** Format a Date object to a string */
export function dateToString(
  date: Date,
  interval: TimeInterval = "daily",
): string {
  switch (interval) {
    case "hourly":
      return `${date.getFullYear()}-${
        date.getMonth() + 1
      }-${date.getDate()} ${date.getHours()}`;
    case "daily":
      return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    case "weekly": {
      const oneJan = new Date(date.getFullYear(), 0, 1);
      const weekNumber = Math.ceil(
        (((date.getTime() - oneJan.getTime()) / 86400000) + oneJan.getDay() +
          1) / 7,
      );
      return `${date.getFullYear()}-${weekNumber}`;
    }
    case "monthly":
      return `${date.getFullYear()}-${date.getMonth() + 1}`;
    case "yearly":
      return `${date.getFullYear()}`;
  }
}

export interface ShowOptions {
  library: string;
  server: Deno.ListenOptions;
}

export async function show(
  data: ReportData,
  options: ShowOptions = { library: "frappe_charts", server: { port: 8888 } },
) {
  console.log(
    `See the "${data.title}" report at http://localhost:${options.server.port}`,
  );

  for await (const conn of Deno.listen(options.server)) {
    for await (const request of Deno.serveHttp(conn)) {
      request.respondWith(
        new Response(await generateHtml(data, options.library), {
          headers: new Headers({
            "Content-Type": "text/html; charset=utf-8",
            "Cache-Control": "no-cache no-store must-revalidate",
          }),
        }),
      );
    }
  }
}

export async function saveHTML(
  file: string,
  data: ReportData,
  library = "frappe_charts",
) {
  await Deno.writeTextFile(file, await generateHtml(data, library));
}

export async function saveJSON(file: string, data: ReportData) {
  await Deno.writeTextFile(file, JSON.stringify(data));
}

async function generateHtml(data: ReportData, library: string) {
  const file: URL = new URL(`./libraries/${library}.js`, import.meta.url);
  const content = await Deno.readTextFile(file);

  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Report: ${data.title}</title>
  </head>
  <body>
    <div id="chart"></div>
    <script type="module">
      const data = ${JSON.stringify(data)};
      ${content}
    </script>
  </body>
  </html>
  `;
}

export function sortReport(
  labels: string[],
  values: number[],
): [string[], number[]] {
  const sorted = labels.map((label, index) => ({
    label,
    value: values[index],
  }));
  sorted.sort((a, b) => b.value - a.value);

  return [
    sorted.map((item) => item.label),
    sorted.map((item) => item.value),
  ];
}
