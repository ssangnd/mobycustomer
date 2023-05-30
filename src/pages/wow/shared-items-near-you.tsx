import { Banner } from "@/components/common/banner";
import { useMainContext } from "@/components/context";
import { MobyItem } from "@/components/items/moby-item";
import { ItemSkeleton } from "@/components/loading/item-skeleton";
import { useShareItemNearYou } from "@/hooks/product";
import { useCounter, useListState } from "@mantine/hooks";
import { Button, Divider } from "antd";
import Head from "next/head";
import { useEffect } from "react";
import { FiChevronDown, FiMapPin } from "react-icons/fi";

const ShareItemsNearYouPage = ({}) => {
  const mainContext = useMainContext();

  const [pageIndex, indexHandlers] = useCounter(1, { min: 1 });
  const [sharedItems, itemHandlers] = useListState([]);
  const sharedItemNearYou = useShareItemNearYou(
    pageIndex,
    16,
    mainContext.user?.userAddress
  );
  useEffect(() => {
    if (sharedItemNearYou.data?.list) {
      itemHandlers.append(...sharedItemNearYou.data?.list);
    }
  }, [sharedItemNearYou.data?.list]);
  return (
    <>
      <Head>
        <title>TÌM KIẾM GẦN TÔI | Moby</title>
      </Head>
      <div className="grid place-items-center mb-10">
        <div className="xl:w-[1280px] lg:w-[1024px] w-full px-4 flex flex-col gap-5 mt-5 ">
          <Banner />
          <Divider />
          <div className="font-bold text-2xl uppercase flex items-center justify-center gap-3 text-primary">
            <FiMapPin />
            TÌM KIẾM GẦN TÔI
          </div>

          <div className="grid md:grid-cols-4 grid-cols-2 gap-3 items-stretch">
            {sharedItems?.map((item) => (
              <MobyItem key={`near-me-${item.itemId}`} item={item} />
            ))}
            {sharedItemNearYou.isFetching ? <ItemSkeleton size={4} /> : null}
          </div>
          <Button type="link" onClick={() => indexHandlers.increment()}>
            <div className="flex justify-center items-center">
              Xem thêm <FiChevronDown />
            </div>
          </Button>
        </div>
      </div>
    </>
  );
};
export default ShareItemsNearYouPage;
