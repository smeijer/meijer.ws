export function getBaseUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL ?? process.env.NEXT_PUBLIC_VERCEL_URL
};

export function getPublicURL(path = '/', protocol = true) {
  let url = path.startsWith(getBaseUrl()) ? path : `${getBaseUrl()}/${path.replace(/^\//, '')}`;

  // drop protocol if desired
  if (!protocol) {
    url = url.replace(/^https?:\/\//, '');
  }

  // drop trailing slash, unless it's the root
  if (url.includes('?')) return url;
  return url.replace(/\/$/, '');
}
