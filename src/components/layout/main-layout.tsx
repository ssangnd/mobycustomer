import { useDebouncedValue } from "@mantine/hooks";
import { useQueryClient } from "@tanstack/react-query";
import classcat from "classcat";
import { getToken, onMessage } from "firebase/messaging";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter, withRouter } from "next/router";
import { useEffect, useState } from "react";
import { messaging } from "services/firebase";
import { vapidKey } from "services/firebase/messaging";
import { fadeInVariants } from "../constants/framer";
import { useMainContext } from "../context";
import { UnAuthenticateRoutes } from "./const";
import MainAccountLayout from "./main-account-layout";
import MainBlogHeader from "./main-blog-header";
import { MainCategory } from "./main-category";
import MainFooter from "./main-footer";
import MainHeader from "./main-header";
import { MainLazyLoading } from "./main-lazy-loading";

const MainLayout = ({ router, children }) => {
  const mainContext = useMainContext();
  const [loading, setMainLoading] = useState(true);

  const isBlog = router.pathname.includes("/blog");
  const isAccount = router.pathname.includes("/account");
  const queryClient = useQueryClient();
  const { asPath } = useRouter();
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.addEventListener("message", (event) => {
        console.log("event for the service worker", event);
      });
    }
  }, []);

  useEffect(() => {
    if (mainContext.loading) return;
    //UnAuthenticate
    if (mainContext.user && UnAuthenticateRoutes.includes(router.pathname)) {
      router.replace("/");
    }
    //Authenticate
    if (
      !mainContext.user &&
      router.asPath.split("/").length > 1 &&
      (router.asPath.split("/")[1] === "account" ||
        router.asPath.split("/")[1] === "my-order")
    ) {
      router.replace({
        pathname: "/authenticate/signin",
        query: { url: router.asPath },
      });
    }
    if (!mainContext.user) {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          console.log("Notification permission granted.");
        }
      });
      getToken(messaging, { vapidKey: vapidKey })
        .then((currentToken) => {
          if (currentToken) {
            // Send the token to your server and update the UI if necessary
            // ...
            // update(ref(database), {
            //   ["/user/" + mainContext.user.userId + "/notificationToken"]:
            //     currentToken,
            // });
            console.log(currentToken);
          } else {
            // Show permission request UI
            console.log(
              "No registration token available. Request permission to generate one."
            );
            // ...
          }
        })
        .catch((err) => console.log(err));
      onMessage(messaging, (message) => {
        console.log(message);
      });
    }
  }, [router.pathname, mainContext.user, mainContext.loading]);

  const [debounced] = useDebouncedValue(mainContext.loading, 500);

  return (
    <>
      {debounced && (
        <AnimatePresence exitBeforeEnter initial={false}>
          <motion.div
            {...fadeInVariants}
            // className={classcat([
            //   "",
            //   {
            //     hidden: !debounced,
            //     block: debounced,
            //   },
            // ])}
          >
            <MainLazyLoading />
          </motion.div>
        </AnimatePresence>
      )}
      <div
        className={classcat([
          "bg-white",
          {
            hidden: debounced,
            block: !debounced,
          },
        ])}>
        <div className="sticky top-0 z-20">
          <MainHeader />
        </div>
        <MainCategory />

        {isBlog ? <MainBlogHeader /> : null}
        {/* <AnimatePresence exitBeforeEnter initial={false}> */}
        <motion.main
          key={`key-motion-${asPath}`}
          {...fadeInVariants}
          className="master-content min-h-screen">
          {isAccount ? (
            <MainAccountLayout>{children}</MainAccountLayout>
          ) : (
            children
          )}
        </motion.main>
        {/* </AnimatePresence> */}
        <MainFooter />
      </div>
    </>
  );
};

export default withRouter(MainLayout);
