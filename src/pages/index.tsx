import Image from "next/image";
import Link, { LinkProps } from "next/link";

import { Button } from '@/components/button'
import { Card } from '@/components/card'
import { Container } from '@/components/container'
import {
  GitHubIcon,
  InstagramIcon,
  LinkedInIcon,
  BlueSkyIcon,
} from '@/components/social-icons'

import { date } from '@/lib/date'
import { generateRssFeed } from '@/lib/rss-feed'
import { getAllArticles } from '@/lib/articles'
import { profile } from '@/../data/profile';
import React, { ComponentType, ReactNode, useState } from "react";
import { Newsletter } from "@/components/newsletter";
import Markdown from "markdown-to-jsx";
import stripIndent from "strip-indent";
import { generatePageList } from "@/lib/open-graph";
import { PageMeta, SocialHead } from "@/components/social-head";

export const meta: PageMeta = {
  title: profile.author.name,
  description: profile.author.bio,
  image: {
    words: `${profile.author.pitch}`,
    image: profile.author.imagePath,
    author: false,
  }
}

function BriefcaseIcon(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path
        d="M2.75 9.75a3 3 0 0 1 3-3h12.5a3 3 0 0 1 3 3v8.5a3 3 0 0 1-3 3H5.75a3 3 0 0 1-3-3v-8.5Z"
        className="fill-zinc-100 stroke-zinc-400 dark:fill-zinc-100/10 dark:stroke-zinc-500"
      />
      <path
        d="M3 14.25h6.249c.484 0 .952-.002 1.316.319l.777.682a.996.996 0 0 0 1.316 0l.777-.682c.364-.32.832-.319 1.316-.319H21M8.75 6.5V4.75a2 2 0 0 1 2-2h2.5a2 2 0 0 1 2 2V6.5"
        className="stroke-zinc-400 dark:stroke-zinc-500"
      />
    </svg>
  )
}

function ArrowDownIcon(props) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" {...props}>
      <path
        d="M4.75 8.75 8 12.25m0 0 3.25-3.5M8 12.25v-8.5"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function Article({ article }) {
  return (
    <Card as="article">
      <Card.Title href={`/articles/${article.slug}`}>
        {article.title}
      </Card.Title>
      <Card.Eyebrow as="time" decorate>
        {date(article.date)}
      </Card.Eyebrow>
      <Card.Description>{article.description}</Card.Description>
      <Card.Cta>Read article</Card.Cta>
    </Card>
  )
}

function SocialLink({ icon: Icon, ...props }: { icon: ComponentType<any> } & LinkProps) {
  return (
    <Link className="group -m-1 p-1" {...props}>
      <Icon className="h-6 w-6 fill-zinc-500 transition group-hover:fill-zinc-600 dark:fill-zinc-400 dark:group-hover:fill-zinc-300" />
    </Link>
  )
}

function Resume() {
  const resume = [
    ...profile.resume.entries.filter(x => isNaN(Date.parse(x.end))),
    ...profile.projects.entries.filter(x => x.highlight).map(x => ({
      ...x,
      company: x.name,
      title: 'Founder',
      start: String(new Date(x.date).getFullYear()),
      end: 'Present',
    })).slice(0, 4).sort(x => x.stars),
  ]

  return (
    <div className="rounded-2xl border border-zinc-100 p-6 dark:border-zinc-700/40">
      <h2 className="flex text-sm font-semibold text-zinc-900 dark:text-zinc-100">
        <BriefcaseIcon className="h-6 w-6 flex-none" />
        <span className="ml-3">Active projects</span>
      </h2>
      <ol className="mt-6 space-y-4">
        {resume.map((role, roleIndex) => (
          <li key={roleIndex} className="flex gap-4 group relative">
            <div className="z-10 relative mt-1 flex h-10 w-10 flex-none items-center justify-center rounded-full shadow-md shadow-zinc-800/5 ring-1 ring-zinc-900/5 dark:border dark:border-zinc-700/50 dark:bg-zinc-800 bg-white dark:ring-0">
              {'content' in role.logo
                ? <div dangerouslySetInnerHTML={{ __html: role.logo.content }} className="h-7 w-7 [&>*]:h-7 [&>*]:w-7" />
                : <Image src={role.logo} alt="" className="h-7 w-7" unoptimized />
              }
            </div>
            <dl className="flex flex-auto flex-wrap gap-x-2">
              <dt className="sr-only">Company</dt>
              <dd className="w-full flex-none text-sm font-medium text-zinc-900 dark:text-zinc-100">
                {'link' in role && role.link
                  ?
                    <>
                      <div className="absolute -inset-x-4 -inset-y-2 z-0 scale-95 bg-zinc-50 opacity-0 transition group-hover:scale-100 group-hover:opacity-100 dark:bg-zinc-800/50 rounded-2xl" />
                      <Link target="_blank" href={role.link}>
                        <span className="absolute -inset-x-4 -inset-y-6 z-20 sm:-inset-x-6 sm:rounded-2xl" />
                        <span className="relative z-10">{role.company}</span>
                      </Link>
                    </>
                  : role.company}
                  </dd>
              <dt className="sr-only">Role</dt>
              <dd className="text-xs text-zinc-500 dark:text-zinc-400 relative">
                {role.title}
              </dd>
              <dt className="sr-only">Date</dt>
               <dd
                className="ml-auto text-xs text-zinc-400 dark:text-zinc-500 relative"
                aria-label={`${role.start} until ${role.end}`}
              >
                <time dateTime={role.start}>
                  {role.start}
                </time>{' '}
                {((role.start) !== role.end) && (
                  <>
                    <span aria-hidden="true">—</span>{' '}
                    <time dateTime={role.end}>
                      {role.end}
                    </time>
                  </>
                )}
              </dd>
            </dl>
          </li>
        ))}
      </ol>
      {profile.resume.link ? (
      <Button href={profile.resume.link} variant="secondary" className="group mt-6 w-full">
        Download CV
        <ArrowDownIcon className="h-4 w-4 stroke-zinc-400 transition group-active:stroke-zinc-600 dark:group-hover:stroke-zinc-50 dark:group-active:stroke-zinc-50" />
      </Button>
      ) : null}
    </div>
  )
}

export default function Home({ articles, articleCount }) {
  return (
    <>
      <SocialHead {...meta} />

      <Container className="bg-zinc-50 dark:bg-black sm:pl-8">
        <div className="flex gap-4 sm:gap-16 items-center flex-col sm:flex-row">
          <div className="pt-16 lg:py-32 sm:pb-16 lg:pb-32 sm:w-1/2">
            <h2 className="text-4xl font-bold tracking-tight text-zinc-500 dark:text-zinc-400 sm:text-5xl">
              {`I'm `}<span className="text-zinc-900 dark:text-zinc-100">{profile.author.callSign}</span>
            </h2>
            <p className="prose mt-6 text-xl sm:text-2xl text-zinc-600 dark:text-zinc-400">
              <Markdown>{stripIndent(profile.author.bio)}</Markdown>
            </p>
            <div className="mt-6 flex gap-6">
              {profile.links.bluesky ? (<SocialLink href={profile.links.bluesky} aria-label="Follow on BlueSky" icon={BlueSkyIcon} />) : null}
              {profile.links.github ? (<SocialLink href={profile.links.github} aria-label="Follow on GitHub" icon={GitHubIcon} />): null}
              {profile.links.linkedin ? (<SocialLink href={profile.links.linkedin} aria-label="Follow on LinkedIn" icon={LinkedInIcon} />) : null}
              {profile.links.instagram ? (<SocialLink href={profile.links.instagram} aria-label="Follow on Instagram" icon={InstagramIcon} />) : null}
            </div>
          </div>

          <div className="flex justify-center py-8 sm:w-1/2">
            <Image
              src={profile.author.profilePhoto}
              alt=""
              sizes="(min-width: 1024px) 32rem, 20rem"
              className="w-full h-72 sm:max-w-xs sm:h-auto aspect-video sm:aspect-square rounded-2xl object-cover object-[0_-20px] sm:object-[0_0] sm:rotate-3"
            />
          </div>
        </div>
      </Container>

      <Container.Outer className="bg-zinc-50 dark:bg-black">
        <div className="relative h-12">
          <div className="absolute top-0 -left-px -right-px rounded-t-2xl bg-white dark:bg-zinc-900 h-12 border-b-0 border border-zinc-100 dark:border-zinc-300/10 "/>
        </div>
      </Container.Outer>

      <Container className="mt-2 md:mt-14">
        <div className="mx-auto grid max-w-xl grid-cols-1 gap-y-20 lg:max-w-none lg:grid-cols-2">
          <div className="flex flex-col gap-16">
            {articles.map((article) => (
              <Article key={article.slug} article={article} />
            ))}

            <Button variant="secondary" href="/articles">Read more articles</Button>
          </div>
          <div className="space-y-10 lg:pl-16 xl:pl-24">
            <Newsletter />
            <Resume />
          </div>
        </div>
      </Container>
    </>
  )
}

export async function getStaticProps() {
  if (process.env.NODE_ENV === 'production') {
    await generateRssFeed()
  }

  await generatePageList();

  const allArticles = await getAllArticles();
  const articles =  allArticles
    .slice(0, 4)
    .map(({ component, ...meta }) => meta);

  return {
    props: {
      articles,
      articleCount: allArticles.length,
    },
  }
}
