import nextMDX from '@next/mdx'
import remarkGfm from 'remark-gfm'
import rehypePrism from '@mapbox/rehype-prism'
import grayMatter from 'gray-matter';
import stringify from 'stringify-object';
import readingTime from 'reading-time';
import AST from "abstract-syntax-tree";
import path from 'path';
import { createHmac } from 'node:crypto';
import fs from 'fs';

function hmac(...values) {
  const hmac = createHmac('sha256', process.env.OG_HMAC_KEY);
  hmac.update(JSON.stringify(values));
  return hmac.digest('hex');
}

const log = () => (tree, file) => {
  const filename = path.basename(file.history[0]);
  console.log('parse', filename);
}

const coverImageExtensions = ['png', 'jpg'];

const matterMore = () => (tree, file) => {
  const { data: frontMatter, content } = grayMatter(file.value)
  const filepath = '/' + path.relative(path.join(process.cwd(), 'src', 'pages'), file.history[0]);
  const slug = filepath.split(/[\/.]/).filter(Boolean).reverse().find(x => x !== 'mdx' && x !== 'index');

  frontMatter.cover = coverImageExtensions
    .map(ext => `/articles/${slug}.${ext}`)
    .find(file => fs.existsSync(path.join(process.cwd(), 'public', file))) || null;

  if (!frontMatter.cover) {
    console.warn(`WARN: No cover image found for ${slug}`);
  }

  // remove frontmatter from tree
  if (tree.children[0].type === 'thematicBreak') {
    const firstHeadingIndex = tree.children.findIndex(t => t.type === 'heading')

    if (firstHeadingIndex !== -1) {
      // we will mutate the tree.children by removing these nodes
      tree.children.splice(0, firstHeadingIndex + 1)
    }
  }

  const title = tree.children.find(t => t.type === 'heading')?.children?.[0]?.value;
  const intro = tree.children.find(t => t.type === 'paragraph')?.children?.[0]?.value;

  frontMatter.date = frontMatter.date instanceof Date ? frontMatter.date.toISOString().slice(0, 10) : frontMatter.date;
  frontMatter.timeToRead = readingTime(content).text;
  frontMatter.title = frontMatter.title || title || null;
  frontMatter.intro = frontMatter.intro || intro || null;
  frontMatter.tags = Array.isArray(frontMatter.tags) ? frontMatter.tags : typeof frontMatter.tags === 'string' ? frontMatter.tags.split(',').map(x => x.trim()) : [];
  frontMatter.slug = slug;
  frontMatter.path = filepath;

  const { layout: name = 'ArticleLayout', ...meta } = frontMatter
  const layoutFileName = name.replace(/[A-Z]/g, m => "-" + m.toLowerCase()).replace(/^-/, "");

  const metaExport = `export const meta = ${stringify(frontMatter)};`;
  const layout = {
    import: `import { ${name} } from '@/components/${layoutFileName}';`,
    export: `export default (props) => ${name}({ meta: ${stringify(meta)}, ...props });`,
  };

  tree.children.push(
    {
      type: "mdxjsEsm",
      value: layout.import,
      data: { estree: AST.parse(layout.import) },
    },
    {
      type: 'mdxjsEsm',
      value: metaExport,
      data: { estree: AST.parse(metaExport) },
    },
    {
      type: "mdxjsEsm",
      default: true,
      value: layout.export,
      data: { estree: AST.parse(layout.export) },
    }
  );
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['ts', 'tsx', 'mdx'],
  reactStrictMode: true,
  experimental: {
    scrollRestoration: true,
  },
}

const withMDX = nextMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [remarkGfm, matterMore],
    rehypePlugins: [rehypePrism],
  },
})

export default withMDX(nextConfig)
