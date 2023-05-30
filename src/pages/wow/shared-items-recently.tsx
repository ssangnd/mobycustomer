import { Banner } from "@/components/common/banner";
import { MobyItem } from "@/components/items/moby-item";
import { ItemSkeleton } from "@/components/loading/item-skeleton";
import { useShareItemRecently } from "@/hooks/product";
import { FieldTimeOutlined } from "@ant-design/icons";
import { useCounter, useListState } from "@mantine/hooks";
import { Button, Divider } from "antd";
import Head from "next/head";
import { useEffect } from "react";
import { FiChevronDown } from "react-icons/fi";

const ShareItemsRecentlyPage = ({}) => {
  const [pageIndex, indexHandlers] = useCounter(1, { min: 1 });
  const [sharedItems, itemHandlers] = useListState([]);
  const sharedItemRecently = useShareItemRecently(pageIndex, 16);
  useEffect(() => {
    if (sharedItemRecently.data?.list) {
      itemHandlers.append(...sharedItemRecently.data?.list);
    }
  }, [sharedItemRecently.data?.list]);
  return (
    <>
      <Head>
        <title>Chia sẻ gần đây | Moby</title>
      </Head>
      <div className="grid place-items-center mb-10">
        <div className="xl:w-[1280px] lg:w-[1024px] w-full px-4 flex flex-col gap-5 mt-5 ">
          <Banner />
          <Divider />
          <div className="font-bold text-2xl uppercase flex items-center justify-center gap-3 text-primary">
            <FieldTimeOutlined />
            Chia sẻ gần đây
          </div>

          <div className="grid md:grid-cols-4 grid-cols-2 gap-3 items-stretch">
            {sharedItems?.map((item) => (
              <MobyItem key={`recently-${item.itemId}`} item={item} />
            ))}
            {sharedItemRecently.isFetching ? <ItemSkeleton size={4} /> : null}
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
export default ShareItemsRecentlyPage;
