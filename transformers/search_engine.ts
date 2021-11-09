import { Log, Transformer } from "../types.ts";

export type EngineList = Map<string, URLPattern[]>;

export const engines: EngineList = new Map([
  ["google", [
    new URLPattern({ hostname: "(www.)?google.*" }),
    new URLPattern({ hostname: "webcache.googleusercontent.com" }),
  ]],
  ["bing", [
    new URLPattern({ hostname: "bing.com" }),
    new URLPattern({ hostname: "*.bing.com" }),
  ]],
  ["yahoo", [
    new URLPattern({ hostname: "*.search.yahoo.com" }),
    new URLPattern({ hostname: "search.yahoo.com" }),
  ]],
  ["baidu", [new URLPattern({ hostname: "(www.)?baidu.com" })]],
  ["yandex", [new URLPattern({ hostname: "(www.)?yandex.ru" })]],
  ["ecosia", [new URLPattern({ hostname: "(www.)?ecosia.org" })]],
  ["becovi", [new URLPattern({ hostname: "search.becovi.com" })]],
  ["qwant", [new URLPattern({ hostname: "www.qwant.com" })]],
  ["petal", [new URLPattern({ hostname: "www.petalsearch.com" })]],
  ["duckduckgo", [new URLPattern({ hostname: "(www.)?duckduckgo.com" })]],
  ["google android", [
    new URLPattern({
      hostname: "com.google.android.googlequicksearchbox",
      protocol: "android-app",
    }),
    new URLPattern({
      hostname: "com.google.android.gm",
      protocol: "android-app",
    }),
  ]],
]);

/** Transformer to generate the searchEngine property automatically */
export default function (customEngines: EngineList = engines): Transformer {
  return function (log: Log): Log | undefined {
    log.searchEngine = log.referrer
      ? getSearchEngine(log.referrer, customEngines)
      : undefined;
    return log;
  };
}

function getSearchEngine(url: URL, engines: EngineList): string | undefined {
  for (const [name, patterns] of engines) {
    if (patterns.some((pattern) => pattern.test(url))) {
      return name;
    }
  }
}
