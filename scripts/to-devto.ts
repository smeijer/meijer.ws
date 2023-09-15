import fs from 'fs/promises';
import dotenv from 'dotenv';
import glob from "fast-glob";
import path from "path";

const BASE_URL = 'https://meijer.ws/articles';

const { parsed: env } = dotenv.config({ path: '.env.local' });

function getOg(slug: string) {
  return `https://meijer.ws/api/og?path=/articles/${slug}`;
}

const get = () => {
  return fetch('https://dev.to/api/articles/me?per_page=1000', {
    method: 'GET',
    headers: {
      'accept': 'application/vnd.forem.api-v1+json',
      'api-key': env.DEV_TO_API_KEY,
      'content-type': 'application/json',
    },
  }).then(async (x) => x.json());
}

const post = (article: {
  title: string,
  body_markdown: string
  published: boolean
  main_image: string
  canonical_url: string;
  description: string;
  tags: string;
}) => {
  return fetch('https://dev.to/api/articles', {
    method: 'POST',
    headers: {
      'accept': 'application/vnd.forem.api-v1+json',
      'api-key': env.DEV_TO_API_KEY,
      'content-type': 'application/json',
    },
    body: JSON.stringify({ article }),
  }).then(async (x) => x.json()).then(x => {
    if (x.error) {
      console.log(`error: ${x.error}`)
    }

    return x;
  });
}

function objectToMatter(obj: Record<string, unknown>) {
  return Object.entries(obj).map(([key, value]) => `${key}: ${value}`).join('\n') + '\n';
}

function extractMatter(markdown: string) {
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

async function main() {
  const root = 'src/pages/articles';
  const articleFilenames = await glob(['*.mdx', '*/index.mdx'], {
    cwd: path.join(process.cwd(), root),
  });

  const articles = [];
  for await (let filename of articleFilenames) {
    articles.push({
      filename,
      slug: path.basename(filename.replace('/index', ''), '.mdx'),
      markdown: await fs.readFile(path.join(process.cwd(), root, filename), 'utf-8'),
    });
  }

  const devTo = await get();

  let didPublish = false;

  for (let article of articles) {
    const canonicalUrl = `${BASE_URL}/${article.slug}`;
    const onDevTo = devTo.find((x) => x.canonical_url === canonicalUrl);

    const { matter, body } = extractMatter(article.markdown);

    if (String(onDevTo?.published) === matter.published || matter.published !== 'true') {
      continue;
    }


    // add footer
    const footer =`
      ---
      Liked this article? Share your thoughts on [Twitter](https://twitter.com/intent/tweet?url=${canonicalUrl}), and check my other [articles](${BASE_URL}).
    `.split('\n').map((x) => x.trim()).join('\n').trim() + '\n';

    // wait a bit before publishing again. Publish has a tight rate limit
    if (didPublish) await new Promise((resolve) => setTimeout(resolve, 10_000));
    didPublish = true;

    console.log(`[devto] publish: ${canonicalUrl}`);

    await post({
      body_markdown: [body, footer].join('\n'),
      canonical_url: canonicalUrl,
      description: matter.description,
      main_image: getOg(article.slug),
      published: matter.published === 'true',
      tags: matter.tags,
      title: matter.title,
    });
  }
}

main()
