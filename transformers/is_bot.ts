import { LogStream, Transformer } from "../types.ts";

/** Transformer to add the `isBot` property to the logs */
export default function (): Transformer {
  return async function* (logs: LogStream): LogStream {
    for await (const log of logs) {
      log.isBot = isBot(log.userAgent);
      yield log;
    }
  };
}

const robots = new RegExp(
  [
    // GENERAL TERMS
    /bot/,
    /spider/,
    /crawl/,

    // GOOGLE ROBOTS
    /APIs-Google/,
    /AdsBot/,
    /Googlebot/,

    // OTHER ENGINES
    /mediapartners/,
    /Google Favicon/,
    /FeedFetcher/,
    /Google-Read-Aloud/,
    /DuplexWeb-Google/,
    /googleweblight/,
    /bing/,
    /yandex/,
    /baidu/,
    /duckduck/,
    /yahoo/,

    // SOCIAL MEDIA
    /ecosia/,
    /ia_archiver/,
    /facebook/,
    /instagram/,
    /pinterest/,
    /reddit/,

    // OTHER
    /slack/,
    /twitter/,
    /whatsapp/,
    /youtube/,
    /semrush/,
  ].map((r) => r.source).join("|"),
  "i",
); // BUILD REGEXP + "i" FLAG

function isBot(userAgent?: string): boolean {
  return typeof userAgent === "string" && robots.test(userAgent);
}
