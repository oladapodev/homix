export type HtmxAttrs = {
  "hx-get"?: string;
  "hx-post"?: string;
  "hx-put"?: string;
  "hx-delete"?: string;
  "hx-target"?: string;
  "hx-swap"?: string;
  "hx-trigger"?: string;
  "hx-push-url"?: string;
  "hx-indicator"?: string;
};

export const hx = <T extends HtmxAttrs>(attrs: T) => attrs;

export function isHtmx(headers: Headers) {
  return headers.get("HX-Request") === "true";
}
