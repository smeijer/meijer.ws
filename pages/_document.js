import withTwindDocument from '@twind/next/shim/document';
import Document, { Head, Html, Main, NextScript } from 'next/document';

import twindConfig from '../twind.config';

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html className="dark">
        <Head />

        <body className="dark:bg-gray-800 dark:text-white">
          <Main />
          <NextScript />

          <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_TRACKING_ID}`}
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `
                if (location.hostname !== 'localhost') {
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${process.env.NEXT_PUBLIC_GA_TRACKING_ID}');
                }
              `,
            }}
          />
        </body>
      </Html>
    );
  }
}

export default withTwindDocument(twindConfig, MyDocument);
