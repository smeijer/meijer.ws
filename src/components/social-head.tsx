import Head from 'next/head';
import { profile } from "../../data/profile";
import { useRouter } from "next/router";
import { getPublicURL } from "@/lib/url";

interface SocialProps {
  color?: string;
  keywords?: string[];
  name?: string;
  title: string;
  socialTitle?: string;
  description: string;
  socialImage?: string;
  coverImage?: string;
  icons?: string[];
  url?: string;
}

const extMimeMap = {
  png: 'image/png',
  jpg: 'image/jpg',
};

export const absoluteUrl = (path: string) => `${process.env.NEXT_PUBLIC_SITE_URL}${path}`;

export type PageMeta = {
  title: string;
  description: string;
  image?: { words: string; image: string, author?: boolean },
  keywords?: string[];
}

const defaults = {
  color: '#27272A',
  icons: [
    absoluteUrl('/logo-24.png'),
    absoluteUrl('/logo-48.png'),
    absoluteUrl('/logo-96.png'),
  ],
}

export function SocialHead({ title, description, keywords = [] }: PageMeta) {

  const router = useRouter()
  const url = getPublicURL(router.asPath);
  const image = getPublicURL('/api/og?path=' + router.asPath);

  return (
    <Head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />

      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="msapplication-TileColor" content={defaults.color} />
      <meta name="theme-color" content={defaults.color} />
      <meta name="keywords" content={keywords.join(', ')} />

      {/*<!-- icons -->*/}
      {defaults.icons.flatMap((href) => {
        const [ext, size] = href.split(/[\/\-.]/).reverse();

        return ['icon', 'apple-touch-icon'].map((rel) => (
          <link
            key={rel + href}
            rel={rel}
            type={extMimeMap[ext] || extMimeMap.png}
            sizes={`${size}x${size}`}
            href={href}
          />
        ));
      })}

      {/*<!-- Schema.org -->*/}
      <meta itemProp="name" content={title} />
      <meta itemProp="description" content={description} />
      <meta itemProp="image" content={image} />
      <meta property="image:alt" content={description} />

      {/*<!-- Facebook OpenGraph -->*/}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:site_name" content={title} />
      <meta property="og:image" content={image} />
      <meta property="og:image:alt" content={description} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="670" />
      <meta property="og:description" content={description} />
      <meta property="og:locale" content="en_US" />

      {/*<!-- Twitter OpenGraph -->*/}
      <meta name="twitter:card" content={image ? "summary_large_image" : "summary"} />
      <meta name="twitter:creator" content={profile.author.twitter} />
      <meta name="twitter:site" content={profile.author.twitter} />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:image:alt" content={title} />
    </Head>
  );
}
