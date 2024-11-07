import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import clsx from 'clsx'
import { profile } from '@/../data/profile';
import Markdown from 'markdown-to-jsx';
import stripIndent from 'strip-indent';

import { Container } from '@/components/container'
import {
  GitHubIcon,
  InstagramIcon,
  LinkedInIcon,
  BlueSkyIcon,
} from '@/components/social-icons'
import { ComponentType, Fragment, ReactNode } from "react";
import { SocialHead } from "@/components/social-head";

export const meta = {
  title: `About ${profile.author.name}`,
  description: profile.author.bio,
  image: {
    words: `About ${profile.author.callSign}`,
    image: profile.author.imagePath,
    author: false,
  },
}

type SocialLinkProps = {
  className?: string;
  children?: ReactNode;
  href: string;
  icon: ComponentType<any>;
}

function SocialLink({ className, href, children, icon: Icon }: SocialLinkProps) {
  return (
    <li className={clsx(className, 'flex')}>
      <Link
        href={href}
        className="group flex text-sm font-medium text-zinc-800 transition hover:text-sky-500 dark:text-zinc-200 dark:hover:text-sky-500"
      >
        <Icon className="h-6 w-6 flex-none fill-zinc-500 transition group-hover:fill-sky-500" />
        {children && <span className="ml-4">{children}</span>}
      </Link>
    </li>
  )
}

function MailIcon(props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        fillRule="evenodd"
        d="M6 5a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3H6Zm.245 2.187a.75.75 0 0 0-.99 1.126l6.25 5.5a.75.75 0 0 0 .99 0l6.25-5.5a.75.75 0 0 0-.99-1.126L12 12.251 6.245 7.187Z"
      />
    </svg>
  )
}

export default function About() {
  const hasLinks = Object.values(profile.links).some(Boolean);

  return (
    <>
      <SocialHead {...meta} />
      <Container className="mt-16 sm:mt-32">
        <div className="grid grid-cols-1 gap-y-16 lg:grid-cols-2 lg:grid-rows-[auto_1fr] lg:gap-y-12">
          <div className="lg:pl-20">
            <div className="max-w-xs px-2.5 lg:max-w-none">
              <Image
                src={profile.author.profilePhoto}
                alt=""
                sizes="(min-width: 1024px) 32rem, 20rem"
                className="aspect-square rotate-3 rounded-2xl bg-zinc-100 object-cover dark:bg-zinc-800"
              />
            </div>
          </div>
          <div className="lg:order-first lg:row-span-2">
            <h1 className="text-4xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-5xl">
              {profile.about.title}
            </h1>
            <div className="prose mt-6 space-y-7 text-base text-zinc-600 dark:text-zinc-400">
              <Markdown options={{ wrapper: Fragment }}>{stripIndent(profile.about.description)}</Markdown>
            </div>
          </div>
          <div className="lg:pl-20">
            <ul role="list" className="space-y-4">
              {profile.links.bluesky ? (<SocialLink href={profile.links.bluesky} icon={BlueSkyIcon}>Follow on BlueSky</SocialLink>) : null}
              {profile.links.github ? (<SocialLink href={profile.links.github} icon={GitHubIcon}>Follow on GitHub</SocialLink>): null}
              {profile.links.linkedin ? (<SocialLink href={profile.links.linkedin} icon={LinkedInIcon}>Follow on LinkedIn</SocialLink>) : null}
              {profile.links.instagram ? (<SocialLink href={profile.links.instagram} icon={InstagramIcon}>Follow on Instagram</SocialLink>) : null}

              {(hasLinks && profile.author.email) ? <div className="py-4">

              <hr className="border-t border-zinc-100 dark:border-zinc-700/40" />
              </div> : null}

              {profile.author.email ? (
                <SocialLink href={profile.links.email || `mailto:${profile.author.email}`} icon={MailIcon}>
                  {profile.author.email}
                </SocialLink>) : null}
            </ul>
          </div>
        </div>
      </Container>
    </>
  )
}
