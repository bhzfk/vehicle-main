import { ConfigProvider } from "antd";
import { AppProps } from "next/app";

import { LocalStorageProvider } from "@reactivers/use-local-storage";
import { AuthProvider } from "@reactivers/use-auth";

import Head from "next/head";
import Layout from "../components/layout/layout";
import "../styles/globals.css";
import "antd/dist/antd.css";
// import "../styles/light-theme.less";
import deDE from "antd/lib/locale/de_DE";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";

const queryClient = new QueryClient();

function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <LocalStorageProvider>
      <AuthProvider>
        <ConfigProvider direction="ltr" locale={deDE}>
          <Head>
            <meta
              name="viewport"
              content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=5"
            />
            <title>
              Niese Caravan | gebrauchte Wohnmobile Wohnwagen kaufen in
              Frauenstein Niese Caravan
            </title>
          </Head>
          <QueryClientProvider client={queryClient}>
            <Layout>
              <Component {...pageProps} />
            </Layout>
            {/* <ReactQueryDevtools initialIsOpen={false} /> */}
          </QueryClientProvider>
        </ConfigProvider>
      </AuthProvider>
    </LocalStorageProvider>
  );
}

export default CustomApp;
