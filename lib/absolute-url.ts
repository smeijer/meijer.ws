function join(url: string, ...path: string[]): string {
  return [url, path.join('/')].join(path[0]?.[0] === '/' ? '' : '/');
}

export function absoluteUrl(...path: string[]): string {
  return join(process.env.NEXT_PUBLIC_BASE_URL, ...path);
}

export function absoluteApiUrl(...path: string[]): string {
  return join(process.env.NEXT_PUBLIC_API_URL, ...path);
}

export function absoluteAppUrl(...path: string[]): string {
  return join(process.env.NEXT_PUBLIC_BASE_URL, 'app', ...path).replace(
    /\/+$/,
    '',
  );
}
