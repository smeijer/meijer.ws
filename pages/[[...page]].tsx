import { AnimatePresence, motion } from 'framer-motion';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { memo, useState } from 'react';

import { absoluteUrl } from '~/lib/absoluteUrl';

import data from '../data/data.json';

const entities = {
  amp: '&',
  apos: "'",
  '#x27': "'",
  '#x2F': '/',
  '#39': "'",
  '#47': '/',
  lt: '<',
  gt: '>',
  nbsp: ' ',
  quot: '"',
};

function decodeHTMLEntities(text) {
  return text.replace(/&([^;]+);/gm, function (match, entity) {
    return entities[entity] || match;
  });
}

const intl = Intl.DateTimeFormat('en-US', {
  month: 'long',
  day: 'numeric',
  year: 'numeric',
});

function navigateAway(cb: () => void): void {
  setTimeout(() => {
    window.onpageshow = (e) => {
      e.persisted && document.body.classList.remove('fade-out');
    };

    window.onblur = () => {
      setTimeout(() => {
        document.body.classList.remove('fade-out');
      }, 500);
    };

    document.body.classList.add('fade-out');

    setTimeout(async () => {
      try {
        await cb();
      } catch (e) {
        console.error(e);
        document.body.classList.remove('fade-out');
      }
    }, 300);
  }, 500);
}

const transition = { type: 'spring', stiffness: 500, damping: 50, mass: 1 };

function Page({ page, isLast, small = false }) {
  const openUrl = (event) => {
    if (!page.url) {
      return;
    }

    event.preventDefault();

    navigateAway(() => {
      document.body.dataset.target = new URL(page.url).hostname;
      window.location.href = page.url;
    });

    return false;
  };

  return (
    <li className="hover:bg-blue-900 p-4 transition">
      <div className="relative">
        {!isLast ? (
          <span
            className="absolute top-12 -bottom-6 left-5 -ml-px w-0.5 bg-gray-100 dark:bg-gray-700"
            aria-hidden="true"
          />
        ) : null}

        <div className="flex items-start space-x-3">
          {small ? (
            <div className="px-1">
              <div className="h-8 w-8 rounded-full flex items-center justify-center">
                <img
                  className="h-5 w-5 rounded-full flex items-center justify-center"
                  src={page.icon}
                  alt=""
                />
              </div>
            </div>
          ) : (
            <img
              className="h-10 w-10 rounded-full flex items-center justify-center"
              src={page.icon}
              alt=""
            />
          )}

          <div className="min-w-0 flex-1 space-y-0.5">
            <a
              href={page.url}
              onClick={openUrl}
              className="text-sm font-medium text-gray-900 dark:text-gray-100"
            >
              <div className="absolute inset-0" />
              <span>{decodeHTMLEntities(page.title)}</span>
            </a>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {intl.format(new Date(page.published))}
            </p>
            <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
              {page.description}
            </p>
          </div>
        </div>
      </div>
    </li>
  );
}

function FilterButton({ children, img, type, current }) {
  let className =
    'cursor-pointer flex focus:outline-none transition py-2 px-4 items-center justify-start whitespace-nowrap relative';

  if (type === current) {
    className += ' border-b border-blue-400 hover:border-blue-400';
  } else {
    className +=
      ' border-b border-gray-600 hover:border-blue-400 hover:opacity-80';
  }

  const target = Object.entries(pageToFilter).find((x) => x[1] === type)[0];

  return (
    <Link href={`/${target}`} shallow>
      <motion.a className={className}>
        <img className="w-6 h-6 mr-2" src={img} />
        <span>{children}</span>
      </motion.a>
    </Link>
  );
}

function SocialButtons() {
  return (
    <div className="flex space-x-4">
      <SocialButton href="/twitter" icon="/logos/twitter.svg" />
      <SocialButton href="/github" icon="/logos/github.svg" />
      <SocialButton href="/linkedin" icon="/logos/linkedin.svg" />
    </div>
  );
}

function SocialButton({ href, icon }) {
  const url = absoluteUrl(href);

  const openUrl = (event) => {
    event.preventDefault();

    navigateAway(() => {
      document.body.dataset.target = new URL(url).hostname;
      window.location.href = url;
    });

    return false;
  };

  return (
    <a
      className="opacity-100 hover:opacity-75 transition"
      href={url}
      onClick={openUrl}
    >
      <img className="w-6 h-6" src={icon} />
    </a>
  );
}

const pageToFilter = {
  articles: 'article',
  projects: 'webapp',
  repositories: 'library',
  releases: 'release',
};

const FilterButtons = memo(function FilterButtons(props: { current: unknown }) {
  return (
    <div className="w-full grid grid-cols-4">
      <FilterButton type="webapp" current={props.current} img="logos/apps.svg">
        apps
      </FilterButton>
      <FilterButton
        type="article"
        current={props.current}
        img="/logos/article.svg"
      >
        articles
      </FilterButton>
      <FilterButton
        type="release"
        current={props.current}
        img="/logos/release.svg"
      >
        <span className="hidden sm:inline">libraries</span>
        <span className="sm:hidden">libs</span>{' '}
      </FilterButton>
      <FilterButton
        type="library"
        current={props.current}
        img="/logos/github.svg"
      >
        <span className="hidden sm:inline">repositories</span>
        <span className="sm:hidden">repos</span>
      </FilterButton>
    </div>
  );
});

export default function Home({ pages }) {
  const { query } = useRouter();

  const page = Array.isArray(query.page) ? query.page[0] : query.page;
  const [filter, setFilter] = useState(pageToFilter[page] || null);

  const filtered = filter
    ? pages.filter((page) => page.type === filter)
    : pages;

  useEffect(() => {
    setFilter(pageToFilter[page] || null);
  }, [page]);

  return (
    <div className="flex flex-col min-h-screen">
      <Head>
        <title>Stephan Meijer</title>
      </Head>
      <div className="max-w-xl mx-auto">
        <div className="relative">
          <img className="w-full" src="/header.svg" />
          <Link href="/" shallow>
            <img
              className="absolute cursor-pointer bottom-0 w-1/5 object-cover rounded-full"
              src="/headshot.png"
              style={{ transform: 'translateY(50%)', left: '4%' }}
            />
          </Link>
        </div>
        <main>
          <section className="py-12">
            <div className="flex flex-col text-gray-100 p-4 space-y-4">
              <div className="flex justify-between items-center">
                <h1 className="whitespace-nowrap text-xl">Stephan Meijer</h1>
                <SocialButtons />
              </div>
              <p>
                I build software using node.js, mongodb and react. I blog when I
                have a moment of time and inspiration, and maintain various open
                source projects.
              </p>
              <p>
                In the lists below, you'll find my work as maker, and open
                source maintainer.
              </p>
            </div>
            <div className="pt-2">
              <FilterButtons current={filter} />

              <div className="pt-6">
                <div data-stacked>
                  <AnimatePresence initial={false}>
                    <motion.ul
                      key={filter}
                      initial={{ opacity: 0, zIndex: 1 }}
                      animate={{
                        opacity: 1,
                        transition: { duration: 0.4 },
                      }}
                      exit={{
                        opacity: 0,
                        zIndex: 0,
                        transition: { duration: 0.2 },
                      }}
                      transition={transition}
                      className="w-full"
                      layout={false}
                    >
                      {filtered.map((page, idx) => (
                        <Page
                          key={page.published + page.url}
                          page={page}
                          isLast={idx === filtered.length - 1}
                        />
                      ))}
                    </motion.ul>
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export const getStaticPaths = async () => {
  const paths = Object.keys(pageToFilter).map((page) => ({
    params: { page: [page] },
  }));
  paths.push({ params: { page: null } });

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps = async ({ params }) => {
  const pages = [];
  const cache = {};

  for (const d of data) {
    const page = { ...d };

    if (page.type === 'release' && cache[page.title]) {
      continue;
    }

    if (page.type === 'article') {
      page.icon = page.icon || '/logos/article.svg';
    } else if (page.type === 'release') {
      cache[page.title] = true;
      page.icon = page.icon || '/logos/release.svg';
    } else if (page.repo) {
      page.icon = page.icon || '/logos/github.svg';
    }

    pages.push(page);
  }

  pages.sort(
    (a, b) => new Date(b.published).getTime() - new Date(a.published).getTime(),
  );

  return {
    props: {
      pages,
    },
  };
};
