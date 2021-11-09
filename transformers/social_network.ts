import { Log, Transformer } from "../types.ts";

export type SocialNetworkList = Map<string, URLPattern[]>;

export const socialNetworks: SocialNetworkList = new Map([
  ["instagram", [new URLPattern({ hostname: "l.instagram.com" })]],
  ["facebook", [new URLPattern({ hostname: "*.facebook.com" })]],
  ["linkedin", [new URLPattern({ hostname: "(www.linkedin.*|lnkd.in)" })]],
  [
    "linkedin android",
    [
      new URLPattern({
        hostname: "com.linkedin.android",
        protocol: "android-app",
      }),
    ],
  ],
  ["twitter", [new URLPattern({ hostname: "t.co" })]],
  ["youtube", [new URLPattern({ hostname: "www.youtube.com" })]],
  ["pinterest", [new URLPattern({ hostname: "*.pinterest.*" })]],
  [
    "pinterest android",
    [new URLPattern({ hostname: "com.pinterest", protocol: "android-app" })],
  ],
  [
    "telegram android",
    [
      new URLPattern({
        hostname: "org.telegram.messenger",
        protocol: "android-app",
      }),
    ],
  ],
]);

/** Transformer to generate the searchEngine property automatically */
export default function (
  customSocialNetworks: SocialNetworkList = socialNetworks,
): Transformer {
  return function (log: Log): Log | undefined {
    log.socialNetwork = log.referrer
      ? getSocialNetwork(log.referrer, customSocialNetworks)
      : undefined;
    return log;
  };
}

function getSocialNetwork(
  url: URL,
  engines: SocialNetworkList,
): string | undefined {
  for (const [name, patterns] of engines) {
    if (patterns.some((pattern) => pattern.test(url))) {
      return name;
    }
  }
}
