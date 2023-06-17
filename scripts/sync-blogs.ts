import fs from 'fs/promises';
import dotenv from 'dotenv';

const BASE_URL = 'https://meijer.ws/articles';
const COUNT = 1000;
const UPDATE_CANONICAL = true;

const { parsed: env } = dotenv.config({ path: '.env.local' });

const dt = (path: string, data?: Record<string, unknown>) => {
  path = `https://dev.to/api/articles/${String(path).replace(/^\//, '')}`;

  return fetch(path, {
    method: data ? 'PUT' : 'GET',
    headers: {
      'accept': 'application/vnd.forem.api-v1+json',
      'api-key': env.DEV_TO_API_KEY,
      'content-type': 'application/json',
    },
    body: data ? JSON.stringify({ article: data }) : undefined,
  }).then(async (x) => x.json());
}

const renamed = {
  'a-typescript-valueof-implementation-and-how-it-s-built-4gim': 'how-to-implement-a-generic-valueof-utility-in-typescript',
};

function cleanSlug(slug: string) {
  if (renamed[slug]) return renamed[slug];

  return slug
    .replace(/-\w+$/, '')
    .replaceAll('it-s', 'its')
    .replaceAll('don-t', 'dont');
}

async function main() {
  const articles = await dt(`me?per_page=${COUNT}`);

  for (let { id, path } of articles) {
    const article = await dt(id);

    // remove the hash from the slug`
    const slug = cleanSlug(article.slug);

    const canonicalUrl = `${BASE_URL}/${slug}`;
    if (UPDATE_CANONICAL && article.canonical_url !== canonicalUrl) {
      console.log(`updating canonical to ${canonicalUrl}`);
      // dev.to has a bug where it doesn't update the canonical if it was already set
      await dt(id, { canonicalUrl: null });
      await dt(id, { canonicalUrl });
    }

    let content = article.body_markdown;

    // add frontmatter
    const matter = `date: ${article.created_at.slice(0, 10)}\n`
    content = content.replace(/^---\n\n/m, `${matter}---\n\n`);
    content = content.replace(/^cover_image.*\n/m, '');

    // bump all headings one level if we used h1s'
    if (/^# /m.test(content)) {
      content = content.replace(/^(#+) /gm, '$1# ');
    }

    // remove tweet embeds
    content = content.replace(/{% twitter [0-9]* %}/gm, '');

    // replace dev.to links with local links
    content = content.replace(/https?:\/\/dev.to\/smeijer\/([\w-]+)/gm, (match, slug) =>
      `${BASE_URL}/${cleanSlug(slug)}`
    );

    // replace ```typescript with ```ts
    content = content.replace(/```typescript/gm, '```tsx');

    // remove footer
    content = content.replace(/^---\n*_:wave:.*\n*/m, '');
    console.log(`saving ${slug}`);
    await fs.writeFile(`src/pages/articles/${slug}.mdx`, content);
  }
}

main()
