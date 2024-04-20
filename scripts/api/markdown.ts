export function extractMatter(markdown: string) {
  const [match, sourceMatter] = markdown.match(/^---\n([\s\S]+?)\n---\n\n/);

  const matter = Object.fromEntries(sourceMatter.split('\n').map((x) => {
    const idx = x.indexOf(':');
    return [x.slice(0, idx), x.slice(idx + 1).trim()];
  }));

  let body = markdown.slice(match.length);

  return {
    matter,
    body,
  }
}

export function objectToMatter(obj: Record<string, unknown>) {
  return Object.entries(obj).map(([key, value]) => `${key}: ${value}`).join('\n') + '\n';
}
