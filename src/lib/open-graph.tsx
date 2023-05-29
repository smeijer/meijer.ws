import glob from "fast-glob";
import path from "path";
import fs from "fs/promises";

import { getAllArticles } from "@/lib/articles";

type Page = {
  title: string;
  description: string;
  image?: { words: string; image: string },
  path: string;
}

function cleanPath(path: string) {
  return '/' + path.replace(/^\//, '').replace(/(\/index|^index)?\..*$/g, '')
}

export async function generatePageList() {
  const outfile = path.join(process.cwd(), 'public/og/pages.json');

  const pagePaths = await glob(['**/*.tsx'], {
    cwd: path.join(process.cwd(), 'src/pages'),
    ignore: ['api/**', 'articles/*/**/*.tsx', '_*.*'],
  });

  const pages: Page[] = await Promise.all(pagePaths.map(page => import(
    `../pages/${page}`
    ).then(x => ({
      ...x.meta,
      path: cleanPath(page),
  }))));

  const articles: Page[] = await getAllArticles({
    includeDrafts: true,
  }).then(x => x.map(article => ({
    title: article.title,
    description: article.description,
    path: cleanPath(article.path),
    image: {
      words: article.title,
      image: article.cover,
    },
    url: article.url,
  })));

  const index = {};
  for (const { path, ...page } of [...pages, ...articles]) {
    index[path] = page;
  }

  await fs.mkdir(path.dirname(outfile), { recursive: true });
  await fs.writeFile(
    outfile,
    JSON.stringify(index, null, 2),
    {  encoding: 'utf-8' },
  );
}

