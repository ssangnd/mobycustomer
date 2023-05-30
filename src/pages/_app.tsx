import { MainProvider } from "@/components/context";
import { ChatProvider } from "@/components/context/chat";
import MainLayout from "@/components/layout/main-layout";
import { queryClient } from "@/libs/react-query/query-client";
import "@/styles/index.scss";
import data from "@emoji-mart/data";
import "@fontsource/be-vietnam-pro";
import "@fontsource/be-vietnam-pro/700.css";
import "@fontsource/be-vietnam-pro/800.css";
import "@fontsource/be-vietnam-pro/900.css";
import "@splidejs/react-splide/css";
import { Hydrate, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ConfigProvider } from "antd";
import { init } from "emoji-mart";
import Head from "next/head";
import Router, { useRouter } from "next/router";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { IntlProvider } from "react-intl";
import "suneditor/dist/css/suneditor.min.css";
// import "../../public/firebase-messaging-sw.js";
init({ data });

Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

function App({ Component, pageProps }) {
  // Use the layout defined at the page level, if available
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Moby</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
      <QueryClientProvider client={queryClient} contextSharing={true}>
        <Hydrate state={pageProps.dehydratedState}>
          <MainProvider>
            <IntlProvider locale="vi-VN">
              <ConfigProvider
                theme={{
                  token: {
                    fontFamily: "Be Vietnam Pro",
                    colorPrimary: "#e759a0",
                  },
                }}>
                <ChatProvider>
                  <MainLayout>
                    <Component {...pageProps} />
                  </MainLayout>
                  <ReactQueryDevtools
                    position="bottom-right"
                    initialIsOpen={false}
                  />
                </ChatProvider>
              </ConfigProvider>
            </IntlProvider>
          </MainProvider>
        </Hydrate>
      </QueryClientProvider>
    </>
  );
}

export default App;
