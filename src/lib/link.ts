import { UrlObject } from "url";

export function isLocalLink(href: string | UrlObject) {
  href = String(href);
  if (href.startsWith('/') || href.startsWith('#')) return true;
  if (href.startsWith('./') || href.startsWith('../')) return true;
  if (href.startsWith(process.env.NEXT_PUBLIC_SITE_URL)) return true;
  return /https?:\/\//i.test(href) === false;
}

export function stripLinks(text: string) {
  return text.replaceAll(/\[(.*?)]\((.*?)\)/g, '$1')
}
