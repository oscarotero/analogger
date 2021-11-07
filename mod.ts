import {
  Log,
  LogGroup,
  LogStream,
  ReportData,
  TimeInterval,
  Transformer,
} from "./types.ts";
import { iterateReader } from "./deps.ts";

/** Transform a stream of logs and return an array */
export async function transform(
  stream: LogStream,
  ...transformers: Transformer[]
): Promise<Log[]> {
  while (transformers.length) {
    const transformer = transformers.shift();
    if (transformer) {
      stream = transformer(stream);
    }
  }

  const result = [];

  for await (const log of stream) {
    result.push(log);
  }

  return result;
}

/** Read logs from a file */
export async function* read(path: string): LogStream {
  const file = await Deno.open(path);
  const iterator = iterateReader(file);
  const decoder = new TextDecoder();
  let buffer = "";

  for await (const chunk of iterator) {
    buffer += decoder.decode(chunk);

    if (buffer.includes("\n")) {
      const logs = buffer.split("\n");
      buffer = logs.pop()!;

      for (const raw of logs) {
        yield { raw };
      }
    }
  }

  file.close();
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
    const name = typeof key === "function"
      ? key(log)
      : (log[key] as string | number);

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
