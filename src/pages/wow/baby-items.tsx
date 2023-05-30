import { Banner } from "@/components/common/banner";
import { MobyItem } from "@/components/items/moby-item";
import { ItemSkeleton } from "@/components/loading/item-skeleton";
import { useBaby } from "@/hooks/account";
import { useItemRecommendByBaby } from "@/hooks/product";
import { useCounter, useListState } from "@mantine/hooks";
import { Button, Divider, Segmented } from "antd";
import dayjs from "dayjs";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { BsGenderFemale, BsGenderMale } from "react-icons/bs";
import { FiChevronDown, FiSun } from "react-icons/fi";
import { dateService } from "services/tool/date-time";

const BabyItemPage = ({}) => {
  const router = useRouter();
  const [baby, setBaby] = useState<number>(null);
  useEffect(() => {
    const babyId = router.query.babyId as string;
    if (babyId) {
      setBaby(Number.parseInt(babyId));
    }
  }, [router.query]);
  const [pageIndex, indexHandlers] = useCounter(1, { min: 1 });
  const [sharedItems, itemHandlers] = useListState([]);
  const sharedItemFree = useItemRecommendByBaby(pageIndex, 16, baby && baby);
  const babyByMe = useBaby();

  useEffect(() => {
    if (sharedItemFree.data?.list) {
      itemHandlers.append(...sharedItemFree.data?.list);
    }
  }, [sharedItemFree.data?.list]);
  return (
    <>
      <Head>
        <title> Đồ dành cho bé nhà bạn | Moby</title>
      </Head>
      <div className="grid place-items-center mb-10">
        <div className="xl:w-[1280px] lg:w-[1024px] w-full px-4 flex flex-col gap-5 mt-5 ">
          <Banner />
          <Divider />
          <div className="font-bold text-2xl uppercase flex items-center justify-center gap-3 text-primary">
            <FiSun />
            Đồ dành cho bé nhà bạn
          </div>

          <Segmented
            className="self-center"
            options={babyByMe.data?.map((item) => ({
              label: (
                <div className="flex flex-col">
                  <div>
                    Ngày sinh: {dayjs(item.dateOfBirth).format("DD-MM-YYYY")}
                  </div>
                  <div className="ml-2 font-bold flex items-center justify-center gap-1">
                    ({dateService.getTimeRelative(item.dateOfBirth)} tuổi){" "}
                    {item.sex ? (
                      <BsGenderMale className="text-blue-400" />
                    ) : (
                      <BsGenderFemale className="text-primary" />
                    )}
                  </div>
                </div>
              ),
              value: item.idbaby,
            }))}
            value={baby}
            onChange={(value: number) => {
              setBaby(value);
              itemHandlers.setState([]);
            }}
          />

          <div className="grid md:grid-cols-4 grid-cols-2 gap-3 items-stretch">
            {sharedItems?.map((item) => (
              <MobyItem item={item} />
            ))}
            {sharedItemFree.isFetching ? <ItemSkeleton size={4} /> : null}
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
export default BabyItemPage;
