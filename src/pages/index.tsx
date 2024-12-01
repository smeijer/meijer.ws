import Image from "next/image";
import Link, { LinkProps } from "next/link";

import { Button } from '@/components/button'
import { Card } from '@/components/card'
import { Container } from '@/components/container'
import {
  GitHubIcon,
  InstagramIcon,
  LinkedInIcon,
  BlueSkyIcon, TwitterIcon
} from "@/components/social-icons";

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
import clsx from "clsx";

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

function Article({ article, showDate }: { article: any, showDate?: boolean}) {
  return (
    <Card as="article">
      <Card.Title href={`/articles/${article.slug}`}>
        {article.title}
      </Card.Title>
      {showDate ?
        <Card.Eyebrow as="time" decorate>
          {date(article.date)}
        </Card.Eyebrow>
        : null}
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

const activeProjects = [
  ...profile.resume.entries.filter(x => isNaN(Date.parse(x.end))),
  ...profile.projects.entries.filter(x => x.highlight).map(x => ({
    ...x,
    company: x.name,
    title: 'Founder',
    start: String(new Date(x.date).getFullYear()),
    end: 'Present',
  })).slice(0, 4).sort(x => x.stars),
]


const recentProjects = [
  ...profile.resume.entries.filter(x => !isNaN(Date.parse(x.end))),
]

function Projects({ title, projects, showDate = false }: { title: string, showDate?: boolean, projects?: typeof activeProjects[number][] }) {

  return (
    <div className="rounded-2xl border border-zinc-100 p-6 dark:border-zinc-700/40">
      <h2 className="flex text-base font-semibold text-zinc-900 dark:text-zinc-100">
        <BriefcaseIcon className="h-6 w-6 flex-none" />
        <span className="ml-3">{title}</span>
      </h2>
      <ol className="mt-6 space-y-4">
        {projects.map((role, roleIndex) => (
          <li key={roleIndex} className="flex gap-4 group relative">
            <div
              className="z-10 relative mt-1 flex h-10 w-10 flex-none items-center justify-center rounded-full shadow-md shadow-zinc-800/5 ring-1 ring-zinc-900/5 dark:border dark:border-zinc-700/50 dark:bg-zinc-800 bg-white dark:ring-0">
              {"content" in role.logo
                ?
                <div dangerouslySetInnerHTML={{ __html: role.logo.content }} className="h-7 w-7 [&>*]:h-7 [&>*]:w-7" />
                : <Image src={role.logo} alt="" className="h-7 w-7" unoptimized />
              }
            </div>
            <dl className="flex flex-auto flex-wrap gap-x-2">
              <dt className="sr-only">Company</dt>
              <dd className="w-full flex-none text-base font-medium text-zinc-900 dark:text-zinc-100">
                {role.link || ('caseStudy' in role && role.caseStudy.link)
                  ?
                  <>
                    <div
                      className="absolute -inset-x-4 -inset-y-2 z-0 scale-95 bg-zinc-50 opacity-0 transition group-hover:scale-100 group-hover:opacity-100 dark:bg-zinc-800/50 rounded-2xl" />
                    <Link target={role['casetudy']?.link ? '_blank' : '_self'} href={role['caseStudy']?.link || role.link}>
                      <span className="absolute -inset-x-4 -inset-y-6 z-20 sm:-inset-x-6 sm:rounded-2xl" />
                      <span className="relative z-10">{role.company}</span>
                    </Link>
                  </>
                  : role.company}
              </dd>
              <dt className="sr-only">Role</dt>
              <dd className="text-sm text-zinc-500 dark:text-zinc-400 relative">
                {role.title}
              </dd>

              {showDate ?
                <>
                  <dt className="sr-only">Date</dt>
                  <dd
                    className="ml-auto text-sm text-zinc-400 dark:text-zinc-500 relative"
                    aria-label={`${role.start} until ${role.end}`}
                  >
                    <time dateTime={role.start}>
                      {role.start}
                    </time>
                    {" "}
                    {((role.start) !== role.end) && (
                      <>
                        <span aria-hidden="true">—</span>{" "}
                        <time dateTime={role.end}>
                          {role.end}
                        </time>
                      </>
                    )}
                  </dd>
                </>
                : null}
            </dl>
          </li>
        ))}
      </ol>

      {profile.resume.link ? (
        <Button href={profile.resume.link} variant="secondary" className="group mt-6 w-full">
          Download CV
          <ArrowDownIcon
            className="h-4 w-4 stroke-zinc-400 transition group-active:stroke-zinc-600 dark:group-hover:stroke-zinc-50 dark:group-active:stroke-zinc-50" />
        </Button>
      ) : null}
    </div>
  )
}

function Title({ children, inverse }: { children?: ReactNode, inverse?: boolean }) {
  return (
    <h2 className={clsx("text-2xl font-medium tracking-tight", inverse ? 'dark:text-zinc-900 text-zinc-100': 'text-zinc-900 dark:text-zinc-100' )}>
      {children}
    </h2>
  );
}

function Paragraph({ children, inverse }: { children: ReactNode, inverse?: boolean }){
  return (
    <p className={clsx("mt-6 text-xl", inverse ? 'dark:text-zinc-600 text-zinc-400' : 'text-zinc-600 dark:text-zinc-400')}>
      {children}
    </p>
  )
}

function Caption({ children }){
  return (
    <p className="text-lg font-medium mb-2 text-sky-500">
      {children}
    </p>
  )
}

function MaskedImage({ src }) {
  return (
    <svg viewBox="0 0 655 680" fill="none" className="h-full">
      <g clipPath="url(#:S1:-clip)" className="group">
        <g className="origin-center scale-100 transition duration-500 motion-safe:group-hover:scale-105">
          <foreignObject width="655" height="680">
            <Image alt="" src={src} width={2400} height={3000} decoding="async" className="w-full bg-neutral-100 object-cover" style={{ aspectRatio: "655/680", color: "transparent" }} />
          </foreignObject>
        </g>
        <use href="#:S1:-shape" strokeWidth="2" className="stroke-neutral-950/10"></use>
      </g>
      <defs>
        <clipPath id=":S1:-clip">
          <path id=":S1:-shape"
                d="M537.827 9.245A11.5 11.5 0 0 1 549.104 0h63.366c7.257 0 12.7 6.64 11.277 13.755l-25.6 128A11.5 11.5 0 0 1 586.87 151h-28.275a15.999 15.999 0 0 0-15.689 12.862l-59.4 297c-1.98 9.901 5.592 19.138 15.689 19.138h17.275l.127.001c.85.009 1.701.074 2.549.009 11.329-.874 21.411-7.529 24.88-25.981.002-.012.016-.016.023-.007.008.009.022.005.024-.006l24.754-123.771A11.5 11.5 0 0 1 580.104 321h63.366c7.257 0 12.7 6.639 11.277 13.755l-25.6 128A11.5 11.5 0 0 1 617.87 472H559c-22.866 0-28.984 7.98-31.989 25.931-.004.026-.037.035-.052.014-.015-.02-.048-.013-.053.012l-24.759 123.798A11.5 11.5 0 0 1 490.87 631h-29.132a14.953 14.953 0 0 0-14.664 12.021c-4.3 21.502-23.18 36.979-45.107 36.979H83.502c-29.028 0-50.8-26.557-45.107-55.021l102.4-512C145.096 91.477 163.975 76 185.902 76h318.465c10.136 0 21.179-5.35 23.167-15.288l10.293-51.467Zm-512 160A11.5 11.5 0 0 1 37.104 160h63.366c7.257 0 12.7 6.639 11.277 13.755l-25.6 128A11.5 11.5 0 0 1 74.87 311H11.504c-7.257 0-12.7-6.639-11.277-13.755l25.6-128Z"
                fillRule="evenodd" clipRule="evenodd"></path>
        </clipPath>
      </defs>
    </svg>
  )
}


function BulletList({ reverse, image, items }: { reverse?: boolean; image: string; items: { heading: string; description: string }[] }) {
  return (
    <div className="bg-zinc-50 dark:bg-black mx-auto max-w-7xl px-6 lg:px-8 pb-14 text-zinc-600 dark:text-zinc-400">
      <div className="mx-auto max-w-2xl lg:max-w-none">
        <div
          className={clsx(
            'lg:flex lg:items-center',
            reverse ? 'lg:flex-row-reverse lg:justify-start' : 'lg:justify-end'
          )}
        >
          <div
            className={clsx(
              'flex justify-center lg:w-1/2',
              reverse ? 'lg:justify-start lg:pl-12' : 'lg:justify-end lg:pr-12'
            )}
          >
            <div className="w-[33.75rem] flex-none lg:w-[45rem]">
              <div className="justify-center lg:justify-end relative flex aspect-[719/680] w-full grayscale">
                <MaskedImage src={image} />
              </div>
            </div>
          </div>

          <div>
            <ul
              role="list"
              className="text-lg pt-16 lg:mt-0 lg:w-1/2 lg:pl-4 lg:min-w-[33rem]"
            >
              {items.map((item, idx) => (
                <li key={idx} className="group mt-10 first:mt-0">
                  <div>
                    <div className="pt-10 group-first:pt-0 group-first:before:hidden group-first:after:hidden relative before:absolute after:absolute before:bg-zinc-950 before:dark:bg-zinc-50 after:bg-zinc-950/10 after:dark:bg-zinc-50/20 before:left-0 before:top-0 before:h-px before:w-6 after:left-8 after:right-0 after:top-0 after:h-px">
                      <strong className="font-semibold">{item.heading}</strong>{' '}
                      {item.description}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function GridList({ items }: { items: { heading: string; description: string }[] }) {
  return (
    <div className="mx-auto max-w-2xl lg:max-w-none text-zinc-600 dark:text-zinc-400">
      <ul
        role="list"
        className="text-lg pt-16 lg:mt-0 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-12"
      >
        {items.map((item, idx) => (
          <li key={idx}>
            <div className="space-y-2">
              <strong className="font-semibold">{item.heading}</strong>{' '}
              {item.description}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
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
              Product Engineer, innovator, and your dedicated partner in turning ideas into startups. With a proven
              track record in building robust, scalable solutions, I specialize in bringing visions to life, using code.
            </p>
            <div className="mt-6 flex gap-6">
              {profile.links.bluesky ? (
                <SocialLink href={profile.links.bluesky} aria-label="Follow on BlueSky" icon={BlueSkyIcon} />) : null}
              {profile.links.twitter ? (
                <SocialLink href={profile.links.twitter} aria-label="Follow on Twitter" icon={TwitterIcon} />) : null}
              {profile.links.github ? (
                <SocialLink href={profile.links.github} aria-label="Follow on GitHub" icon={GitHubIcon} />) : null}
              {profile.links.linkedin ? (<SocialLink href={profile.links.linkedin} aria-label="Follow on LinkedIn"
                                                     icon={LinkedInIcon} />) : null}
              {profile.links.instagram ? (<SocialLink href={profile.links.instagram} aria-label="Follow on Instagram"
                                                      icon={InstagramIcon} />) : null}
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

      <Container className="bg-zinc-50 dark:bg-black sm:pl-8">
        <div className="py-2 md:py-14 max-w-2xl">
          <Caption>What I do</Caption>
          <Title>Launch Startups, Build Solutions</Title>
          <Paragraph>
            From MVPs to full-scale applications, I help startups get off the ground with the right technology stack,
            seamless user experiences, and scalable foundations. Whether you’re a founder with an idea or an established
            startup looking for a tech refresh, I’m here to engineer your success.
          </Paragraph>
        </div>
      </Container>


      <Container className="bg-zinc-50 dark:bg-black sm:pl-8">
        <div className="py-2 md:py-14">

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {profile.resume.entries.filter(x => x.caseStudy?.highlight).map(((x, idx) => (
              <div key={idx} className="flex">
                <article
                  className="relative flex w-full flex-col rounded-3xl p-6 ring-1 ring-neutral-950/5 transition sm:p-8 hover:bg-zinc-100 hover:dark:bg-zinc-900">
                  <h3>
                    <Link href={x.caseStudy.link}>
                      <span className="absolute inset-0 rounded-3xl"></span>
                      <Image loading="lazy" width="36" height="36" src={x.logo} alt="" className="h-16 w-16"
                             unoptimized />
                    </Link>
                  </h3>
                  <p className="mt-6 flex gap-x-2 text-sm text-zinc-600 dark:text-zinc-400">
                    <time dateTime="2023" className="font-semibold">{x.caseStudy.year}</time>
                    <span className="text-neutral-300" aria-hidden="true">/</span><span>Case study</span></p>
                  <p className="mt-6 font-display text-2xl font-semibold text-zinc-800 dark:text-zinc-100">
                    {x.caseStudy.title || x.company}</p>
                  <p className="mt-4 text-base text-zinc-600 dark:text-zinc-400">{x.caseStudy.excerpt}</p>
                </article>
              </div>
            )))}
          </div>
        </div>
      </Container>

      <Container className="bg-zinc-50 dark:bg-black sm:pl-8">
        <div className="py-2 md:py-14 max-w-2xl">
          <Caption>How I Work</Caption>
          <Title>A Partner, Not Just a Developer</Title>
          <Paragraph>
            When you work with me, you’re not just hiring a developer — you’re gaining a partner who invests in your
            success. My process is collaborative, pragmatic, and focused on delivering results that matter.
          </Paragraph>
        </div>
      </Container>

      <BulletList image="/media/laptop.jpg" items={[
        { heading: "Understanding Your Vision.", description: "I work closely with you to align technology with your business strategy." },
        { heading: "Building for Speed and Scalability.", description: "In the startup world, time is critical. I prioritize shipping fast while ensuring a solid foundation for future growth." },
        { heading: "Iterating Together.", description: "Regular updates and feedback cycles keep us agile, adapting to your needs as they evolve." },
        { heading: "Delivering Measurable Impact.", description: "I focus on creating solutions that drive real results, ensuring your success is tangible and trackable." },
      ]} />

      <Container className="bg-zinc-50 dark:bg-black sm:pl-8">
        <div className="py-2 md:py-14 max-w-2xl">
          <Caption>Why Choose Me?</Caption>
          <Title>An Innovator Who Understands Startups</Title>
          <Paragraph>
            I know what it takes to bring a startup to life. With years of experience building projects like Clearly.app
            and MagicBell, I’ve developed the technical expertise and strategic insight needed to prioritize
            and launch successful
            products.
          </Paragraph>
        </div>
      </Container>


      <Container className="bg-zinc-50 dark:bg-black sm:pl-8 pb-14">
        <GridList items={[
          { heading: "Startup-Focused Approach.", description: "I understand the balance between speed and quality in a fast-paced environment." },
          { heading: "Proven Track Record.", description: "With years of experience and successful projects, I deliver results that speak louder than words." },
          { heading: "Commitment to Innovation.", description: "I’m always exploring better solutions to meet your challenges. Together." },
          { heading: "Collaborative Partner.", description: "I work closely with you, aligning technology with your vision to ensure success." }
        ]} />
      </Container>


      <Container className="bg-zinc-50 dark:bg-black sm:pl-8 pt-14 pb-32">
        <div className="bg-zinc-900 dark:bg-zinc-100 relative flex w-full justify-between rounded-3xl gap-6 sm:gap-8 p-6 sm:p-8">
          <div className="max-w-2xl">
            <Title inverse>Let’s Build Your Product Together</Title>
            <Paragraph inverse>
              Whether you’re at the idea stage or ready to scale, let’s create something amazing. Reach out today to see
              how I can help you engineer your vision into reality.
            </Paragraph>
          </div>

          <Link target="_blank" className="self-center mx-auto px-6 py-4 transition hover:text-sky-500 dark:hover:text-sky-400 items-center justify-center rounded-2xl bg-white/90 shadow-lg" href="https://go.meijer.ws/cal">
            <span>Schedule a Call</span>
          </Link>
        </div>
      </Container>


      <Container.Outer className="bg-zinc-50 dark:bg-black">
        <div className="relative h-12">
          <div
            className="absolute top-0 -left-px -right-px rounded-t-2xl bg-white dark:bg-zinc-900 h-12 border-b-0 border border-zinc-100 dark:border-zinc-300/10 " />
        </div>
      </Container.Outer>

      <Container className="mt-2 md:mt-14">
        <div className="mx-auto grid max-w-xl grid-cols-1 gap-y-20 lg:max-w-none lg:grid-cols-2">
          <div className="flex flex-col gap-10">
            <div className="flex flex-col gap-16">

              {articles.map((article) => (
                <Article key={article.slug} article={article} />
              ))}

              <Button variant="secondary" href="/articles">Read more articles</Button>
            </div>
          </div>
          <div className="space-y-10 lg:pl-16 xl:pl-24">
            <Newsletter />
            <Projects title="Current projects" projects={activeProjects} />
            <Projects title="Past projects" projects={recentProjects} />
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
  const articles = allArticles
    .slice(0, 6)
    .map(({ component, ...meta }) => meta);

  return {
    props: {
      articles,
      articleCount: allArticles.length,
    },
  }
}
