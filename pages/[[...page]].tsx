import { AnimatePresence, motion } from 'framer-motion';
import glob from 'glob';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import path from 'path';

import FeedEntry from '~/components/feed-entry';
import FilterButtons from '~/components/filter-buttons';
import SocialButtons from '~/components/social-buttons';

import data from '../generated/data.json';

const transition = {
  type: 'spring',
  stiffness: 500,
  damping: 50,
  mass: 1,
};

const categoryGroupMap = {
  library: 'open-source',
  article: 'articles',
  webapp: 'projects',
  release: 'releases',
};

function isItemVisible(item, filter) {
  return !filter || categoryGroupMap[item.type] === filter;
}

export default function Home({ pages }) {
  const { query } = useRouter();

  const page = Array.isArray(query.page) ? query.page[0] : query.page;
  const filtered = pages.filter((p) => isItemVisible(p, page));

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
              <FilterButtons />

              <div className="pt-6 w-full" data-stacked>
                <AnimatePresence initial={false}>
                  <motion.ul
                    key={page}
                    initial={{ opacity: 0, zIndex: 1 }}
                    animate={{ opacity: 1, transition: { duration: 0.4 } }}
                    exit={{
                      opacity: 0,
                      zIndex: 0,
                      transition: { duration: 0.4 },
                    }}
                    transition={transition}
                    className="w-full"
                    layout={false}
                  >
                    {filtered.map((item, idx) => (
                      <FeedEntry
                        key={item.published + item.url}
                        item={item}
                        isLast={idx === filtered.length - 1}
                      />
                    ))}
                  </motion.ul>
                </AnimatePresence>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export const getStaticPaths = async () => {
  const paths = Object.values(categoryGroupMap).map((path) => ({
    params: { page: path.split('/') },
  }));

  paths.push({ params: { page: null } });

  return {
    paths,
    fallback: false,
  };
};

const iconMap = {
  library: 'github',
};

export const getStaticProps = async () => {
  const pages = [];
  const cache = {};

  const svgs = new Set(
    glob
      .sync('logos/**/*.svg', {
        cwd: path.join(process.cwd(), 'public'),
      })
      .map((x) => `/${x}`),
  );

  for (const d of data) {
    const page: any = { ...d };

    // filter the releases so that only the first release is shown.
    // rendering all releases, might get a bit overwhelming.
    if (page.type === 'release' && cache[page.title]) {
      continue;
    }

    // when the page doesn't have an icon, we try to get one by convention
    if (!page.icon) {
      const potentialIcons = [
        `/logos/${page.title.toLowerCase()}/logo-48.svg`,
        `/logos/${page.title.toLowerCase()}/logo.svg`,
        `/logos/${page.type}.svg`,
        `/logos/${iconMap[page.type]}.svg`,
      ];

      page.icon = potentialIcons.find((icon) => svgs.has(icon)) || null;
    }

    if (page.type === 'release') {
      cache[page.title] = true;
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
