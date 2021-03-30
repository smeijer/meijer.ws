import '../styles/globals.css';

import withTwindApp from '@twind/next/shim/app';
import Head from 'next/head';

import { absoluteUrl } from '../lib/absoluteUrl';
import twindConfig from '../twind.config';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Stephan Meijer</title>

        <meta name="msapplication-TileColor" content="#00A8E8" />
        <meta name="theme-color" content="#00A8E8" />

        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <meta name="keywords" content="" />

        {/*<!-- icons -->*/}
        <link
          rel="icon"
          type="image/png"
          sizes="24x24"
          href={absoluteUrl('/icon-24.png')}
        />
        <link
          rel="icon"
          type="image/png"
          sizes="48x48"
          href={absoluteUrl('/icon-48.png')}
        />
        <link
          rel="icon"
          type="image/png"
          sizes="96x96"
          href={absoluteUrl('/icon-96.png')}
        />

        {/*<!-- Schema.org -->*/}
        <meta itemProp="name" content="Stephan Meijer" />
        <meta
          itemProp="description"
          content="Come see what Stephan Meijer has been working on."
        />
        <meta itemProp="image" content={absoluteUrl('/social.png')} />
        <meta
          property="image:alt"
          content="Come see what Stephan Meijer has been working on."
        />

        {/*<!-- Facebook OpenGraph -->*/}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={absoluteUrl('/')} />
        <meta property="og:title" content="Stephan Meijer" />
        <meta property="og:site_name" content="meijer.ws" />
        <meta property="og:image" content={absoluteUrl('/social.png')} />
        <meta
          property="og:image:alt"
          content="Come see what Stephan Meijer has been working on."
        />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="670" />
        <meta
          property="og:description"
          content="Come see what Stephan Meijer has been working on."
        />
        <meta property="og:locale" content="en_US" />

        {/*<!-- Twitter OpenGraph -->*/}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={absoluteUrl('/')} />
        <meta name="twitter:title" content="Stephan Meijer" />
        <meta
          name="twitter:description"
          content="Come see what Stephan Meijer has been working on."
        />
        <meta name="twitter:image" content={absoluteUrl('/social.png')} />
        <meta
          name="twitter:image:alt"
          content="Come see what Stephan Meijer has been working on."
        />
      </Head>

      <Component {...pageProps} />
    </>
  );
}

export default withTwindApp(twindConfig, MyApp);
