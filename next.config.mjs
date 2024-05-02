import nextMDX from '@next/mdx'
import remarkGfm from 'remark-gfm'
import grayMatter from 'gray-matter';
import stringify from 'stringify-object';
import readingTime from 'reading-time';
import AST from "abstract-syntax-tree";
import path from 'path';
import { createHmac } from 'node:crypto';
import fs from 'fs';

import { createCommentNotationTransformer } from '@shikijs/transformers';
import rehypeShiki from '@shikijs/rehype'
import { transformerNotationDiff, transformerNotationHighlight, transformerNotationFocus, transformerNotationErrorLevel } from '@shikijs/transformers';
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { rehypeGithubAlerts } from 'rehype-github-alerts'

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
  async headers() {
    return ['/giscus.css', '/giscus-light.css', '/giscus-dark.css'].map(source => ({
      source,
      headers: [
        { key: "Access-Control-Allow-Origin", value: "https://giscus.app" },
        { key: "Access-Control-Allow-Methods", value: "OPTIONS, GET" },
      ],
    }));
  },
  async redirects() {
    return [
      { source: '/blog', destination: '/articles', permanent: true },

      // short links
      { source: '/twitter', destination: 'https://go.meijer.ws/twitter', permanent: false },
      { source: '/github', destination: 'https://go.meijer.ws/github', permanent: false },
      { source: '/linkedin', destination: 'https://go.meijer.ws/linkedin', permanent: false },
      { source: '/email', destination: 'https://go.meijer.ws/email', permanent: false },
      { source: '/devto', destination: 'https://go.meijer.ws/devto', permanent: false },
      { source: '/noor', destination: 'https://go.meijer.ws/noor', permanent: false },
      { source: '/sponsor', destination: 'https://go.meijer.ws/sponsor', permanent: false },
      { source: '/sponsor-once', destination: 'https://go.meijer.ws/sponsor-once', permanent: false },

      // moved articles
      { source: '/articles/a-typescript-valueof-implementation-and-how-its-built', destination: '/articles/how-to-implement-a-generic-valueof-utility-in-typescript', permanent: true },
    ];
  },
}

function transformShellOutput() {
  const className = 'shell-output';

  return createCommentNotationTransformer(
    'shikijs-plain',
    // comment-start             | marker    | word           | range | comment-end
    /^\s*(?:\/\/|\/\*|<!--|#)\s+\[!code plain]\s*(?:\*\/|-->)?/,
    function ([_, word, range], line) {
      this.addClassToHast(line, 'plain')
      return true
    },
    true, // remove empty lines
  )
}

const withMDX = nextMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [remarkGfm, matterMore],
    rehypePlugins: [
      [rehypeSlug, {}],
      [rehypeAutolinkHeadings, {
        behavior: 'wrap',
        properties: {
          tabIndex: -1,
          className: 'hash-link'
        }
      }],
      [rehypeShiki, {
        theme: 'dracula-soft',
        transformers: [
          transformerNotationDiff(),
          transformerNotationHighlight(),
          transformerNotationFocus(),
          transformerNotationErrorLevel(),
          transformShellOutput(),
        ]
      }],
      [rehypeGithubAlerts, {
        alerts: [
          {
            keyword: 'NOTE',
            icon: '<svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8Zm8-6.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13ZM6.5 7.75A.75.75 0 0 1 7.25 7h1a.75.75 0 0 1 .75.75v2.75h.25a.75.75 0 0 1 0 1.5h-2a.75.75 0 0 1 0-1.5h.25v-2h-.25a.75.75 0 0 1-.75-.75ZM8 6a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z"></path></svg>',
            title: 'Note',
          },
          {
            keyword: 'TIP',
            icon: '<svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M8 1.5c-2.363 0-4 1.69-4 3.75 0 .984.424 1.625.984 2.304l.214.253c.223.264.47.556.673.848.284.411.537.896.621 1.49a.75.75 0 0 1-1.484.211c-.04-.282-.163-.547-.37-.847a8.456 8.456 0 0 0-.542-.68c-.084-.1-.173-.205-.268-.32C3.201 7.75 2.5 6.766 2.5 5.25 2.5 2.31 4.863 0 8 0s5.5 2.31 5.5 5.25c0 1.516-.701 2.5-1.328 3.259-.095.115-.184.22-.268.319-.207.245-.383.453-.541.681-.208.3-.33.565-.37.847a.751.751 0 0 1-1.485-.212c.084-.593.337-1.078.621-1.489.203-.292.45-.584.673-.848.075-.088.147-.173.213-.253.561-.679.985-1.32.985-2.304 0-2.06-1.637-3.75-4-3.75ZM5.75 12h4.5a.75.75 0 0 1 0 1.5h-4.5a.75.75 0 0 1 0-1.5ZM6 15.25a.75.75 0 0 1 .75-.75h2.5a.75.75 0 0 1 0 1.5h-2.5a.75.75 0 0 1-.75-.75Z"></path></svg>',
            title: 'Tip',
          },
          {
            keyword: 'IMPORTANT',
            icon: '<svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M0 1.75C0 .784.784 0 1.75 0h12.5C15.216 0 16 .784 16 1.75v9.5A1.75 1.75 0 0 1 14.25 13H8.06l-2.573 2.573A1.458 1.458 0 0 1 3 14.543V13H1.75A1.75 1.75 0 0 1 0 11.25Zm1.75-.25a.25.25 0 0 0-.25.25v9.5c0 .138.112.25.25.25h2a.75.75 0 0 1 .75.75v2.19l2.72-2.72a.749.749 0 0 1 .53-.22h6.5a.25.25 0 0 0 .25-.25v-9.5a.25.25 0 0 0-.25-.25Zm7 2.25v2.5a.75.75 0 0 1-1.5 0v-2.5a.75.75 0 0 1 1.5 0ZM9 9a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z"></path></svg>',
            title: 'Important',
          },
          {
            keyword: 'WARNING',
            icon: '<svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M6.457 1.047c.659-1.234 2.427-1.234 3.086 0l6.082 11.378A1.75 1.75 0 0 1 14.082 15H1.918a1.75 1.75 0 0 1-1.543-2.575Zm1.763.707a.25.25 0 0 0-.44 0L1.698 13.132a.25.25 0 0 0 .22.368h12.164a.25.25 0 0 0 .22-.368Zm.53 3.996v2.5a.75.75 0 0 1-1.5 0v-2.5a.75.75 0 0 1 1.5 0ZM9 11a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z"></path></svg>',
            title: 'Warning',
          },
          {
            keyword: 'CAUTION',
            icon: '<svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M4.47.22A.749.749 0 0 1 5 0h6c.199 0 .389.079.53.22l4.25 4.25c.141.14.22.331.22.53v6a.749.749 0 0 1-.22.53l-4.25 4.25A.749.749 0 0 1 11 16H5a.749.749 0 0 1-.53-.22L.22 11.53A.749.749 0 0 1 0 11V5c0-.199.079-.389.22-.53Zm.84 1.28L1.5 5.31v5.38l3.81 3.81h5.38l3.81-3.81V5.31L10.69 1.5ZM8 4a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 8 4Zm0 8a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z"></path></svg>',
            title: 'Caution',
          }
        ]
      }],
    ],
  },
})

export default withMDX(nextConfig)
