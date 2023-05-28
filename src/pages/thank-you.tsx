import Head from 'next/head'

import { SimpleLayout } from '@/components/simple-layout'
import { profile } from '@/../data/profile';
import { PageMeta, SocialHead } from "@/components/social-head";

export const meta = {
  title: `You’re subscribed - ${profile.author.name}`,
  description: "Thanks for subscribing to my newsletter.",
  image: {
    words: `Thanks for subscribing!`,
    image: profile.author.imagePath,
    author: false,
  },
}

export default function ThankYou() {
  return (
    <>
      <SocialHead {...meta} />
      <SimpleLayout
        title="Thanks for subscribing."
        intro="I’ll send you an email any time I publish a new blog post, release a new project, or have anything interesting to share that I think you’d want to hear about. You can unsubscribe at any time, no hard feelings."
      />
    </>
  )
}
