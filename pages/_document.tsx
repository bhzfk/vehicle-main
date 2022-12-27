// eslint-disable-next-line @next/next/no-document-import-in-page
import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
} from 'next/document';

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html lang="de">
        <Head>
          <meta charSet="utf8" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <link rel="dns-prefetch" href="//ajax.googleapis.com" />
          <link rel="dns-prefetch" href="//fonts.googleapis.com" />
          <meta
            name="description"
            content="Willkommen bei Niese Caravan in Frauenstein. Hier finden Sie alle Informationen zum Thema ✔ Wohnmobil kaufen ✔ Wohnmobil mieten ✔ Wohnwagen mieten &amp; kaufen"
          />
          {/* <link rel="canonical" href="https://niese-caravan.de/" />
          <link
            rel="alternate"
            type="application/rss+xml"
            title="Niese Caravan » Home Kommentar-Feed"
            href="https://niese-caravan.de/home/feed/"
          />
          <meta property="og:title" content="Home" />
          <meta property="og:type" content="article" />
          <meta property="og:url" content="https://niese-caravan.de/" />
          <meta property="og:site_name" content="Niese Carvan" />
          <meta
            property="og:image"
            content="http://niese-caravan.de/wp-content/themes/niese_caravan/images/vorschau.jpg"
          /> */}
          <meta
            name="robots"
            content="follow, index, max-snippet:-1, max-video-preview:-1, max-image-preview:large"
          />
          <meta name="format-detection" content="telephone=no" />
          <meta httpEquiv="content-language" content="fa" />
          <meta name="language" content="fa" />
          <meta httpEquiv="Content-Type" content="text/html;charset=UTF-8" />
          <meta name="keywords" content="" />

          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/apple-touch-icon.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/favicon-32x32.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/favicon-16x16.png"
          />
          <link rel="manifest" href="/site.webmanifest" />
          <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
          <meta name="msapplication-TileColor" content="#ffc40d" />
          <meta name="theme-color" content="#ffffff" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
