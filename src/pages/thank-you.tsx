import Head from 'next/head'

import { SimpleLayout } from '@/components/simple-layout'
import { profile } from '@/../data/profile';

export default function ThankYou() {
  return (
    <>
      <Head>
        <title>You’re subscribed - {profile.author.name}</title>
        <meta
          name="description"
          content="Thanks for subscribing to my newsletter."
        />
      </Head>
      <SimpleLayout
        title="Thanks for subscribing."
        intro="I’ll send you an email any time I publish a new blog post, release a new project, or have anything interesting to share that I think you’d want to hear about. You can unsubscribe at any time, no hard feelings."
      />
    </>
  )
}
