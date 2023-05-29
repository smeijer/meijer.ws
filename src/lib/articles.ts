import glob from 'fast-glob'
import * as path from 'path'

async function importArticle(articleFilename) {
  let { meta, default: component } = await import(
    `../pages/articles/${articleFilename}`
  )

  return {
    ...meta,
    component,
  }
}

export async function getAllArticles() {
  const articleFilenames = await glob(['*.mdx', '*/index.mdx'], {
    cwd: path.join(process.cwd(), 'src/pages/articles'),
  });

  const articles = await Promise.all(articleFilenames.map(importArticle))
  return articles
    .filter(x => x.published !== false)
    .sort((a, z) => new Date(z.date).getTime() - new Date(a.date).getTime())
}

export async function getArticle(slug: string) {
  const articleFilenames = await glob(['*.mdx', '*/index.mdx'], {
    cwd: path.join(process.cwd(), 'src/pages/articles'),
  });

  const slugs = articleFilenames.map((filename) => filename.split('/')[0]);
  return slugs.find((s) => s === slug);
}
