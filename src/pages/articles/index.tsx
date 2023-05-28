import Head from 'next/head'

import { Card } from '@/components/card'
import { SimpleLayout } from '@/components/simple-layout'
import { date } from '@/lib/date'
import { getAllArticles } from '@/lib/articles'
import { profile } from '@/../data/profile';
import { getTags, TagFilters, useQuery } from "@/components/tag-filters";
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { PageMeta, SocialHead } from "@/components/social-head";
import Image from "next/image";

export const meta: PageMeta = {
  title: `Articles - ${profile.author.name}`,
  description: profile.blog.title,
  image: {
    words: `Ideas, experiences, and opinions, from over 15 years of product work.`,
    image: profile.author.imagePath,
    author: false,
  }
}

function Article({ article }) {
  return (
    <article className="md:grid md:grid-cols-4 md:items-baseline">
      <Card className="md:col-span-3">
        <Card.Title href={`/articles/${article.slug}`}>
          {article.title}
        </Card.Title>
        <Card.Eyebrow
          as="time"
          className="md:hidden"
          decorate
        >
          {date(article.date)}
        </Card.Eyebrow>
        <Card.Description>{article.description}</Card.Description>
        <Card.Cta>Read article</Card.Cta>
      </Card>

      <Card.Eyebrow
        as="time"
        className="mt-1 hidden md:block"
      >
        {date(article.date)}
      </Card.Eyebrow>
    </article>
  )
}

export default function ArticlesIndex({ articles }) {
  const tags = getTags(articles);
  const query = useQuery();
  const entries = query ? articles.filter(x => x.tags.includes(query)) : articles;
  const [animationParent] = useAutoAnimate();

  return (
    <>
      <SocialHead {...meta} />
      <SimpleLayout
        title={profile.blog.title}
        intro={profile.blog.intro}
      >
        <TagFilters options={tags} path="/articles" />

        <div className="md:border-l md:border-zinc-100 md:pl-6 md:dark:border-zinc-700/40">
          <div ref={animationParent} className="flex max-w-3xl flex-col space-y-16">
            {entries.map((article) => (
              <Article key={article.slug} article={article} />
            ))}
          </div>
        </div>
      </SimpleLayout>
    </>
  )
}

export async function getStaticProps() {
  const articles = (await getAllArticles())
    .map(({ component, ...meta }) => meta);

  return {
    props: {
      articles,
    },
  }
}
