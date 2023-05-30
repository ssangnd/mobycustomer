import { Banner } from "@/components/common/banner";
import { useMainContext } from "@/components/context";
import { MobyItem } from "@/components/items/moby-item";
import { ItemSkeleton } from "@/components/loading/item-skeleton";
import { BabyItemSection } from "@/components/wow/baby-item-section";
import { useBaby } from "@/hooks/account";
import {
  useItemRecommend,
  useShareItemFree,
  useShareItemNearYou,
  useShareItemRecently,
} from "@/hooks/product";
import BlueBackground from "@/images/bg-blue.png";
import {
  CoffeeOutlined,
  FieldTimeOutlined,
  LikeOutlined,
} from "@ant-design/icons";
import { Button, Card, Divider } from "antd";
import { logEvent } from "firebase/analytics";
import Head from "next/head";
import Link from "next/link";
import { useEffect } from "react";
import { FiChevronRight, FiMapPin } from "react-icons/fi";
import { ggAnalytics } from "services/firebase";

const HomePage = ({}) => {
  const mainContext = useMainContext();
  const analytic = ggAnalytics;
  useEffect(() => {
    logEvent(analytic, "reload_page");
  }, []);
  const sharedItemRecently = useShareItemRecently(1, 8);
  const sharedItemFree = useShareItemFree(1, 8);
  const itemRecommend = useItemRecommend(1, 8);
  const sharedItemNearYou = useShareItemNearYou(
    1,
    8,
    mainContext.user?.userAddress
  );
  const babyByMe = useBaby();
  return (
    <>
      <Head>
        <title>Moby | Nền tảng chia sẻ dành cho mẹ và bé</title>
      </Head>
      <div className="grid place-items-center mb-10">
        <div
          className=" w-full bg-cover items-center flex justify-center"
          style={{ backgroundImage: `url(${BlueBackground.src})` }}>
          <div className="xl:w-[1280px] b lg:w-[1024px] w-full px-4  flex flex-col gap-5 my-10 ">
            <Banner />
          </div>
        </div>

        <div className="xl:w-[1280px] lg:w-[1024px] w-full px-4 flex flex-col gap-5 mt-5 ">
          <div className="lg:grid flex flex-wrap items-center justify-center lg:grid-cols-7 gap-3 place-items-center">
            {mainContext.category.map((item) => (
              <Link
                href={{
                  pathname: "/product/filter",
                  query: {
                    category: [item.value, "TEMP"],
                  },
                }}
                className="no-underline">
                <Card style={{ backgroundColor: "#eaeaea" }} hoverable>
                  <div className="flex flex-col items-center gap-2">
                    <img
                      src={item.image}
                      alt={item.label}
                      width={70}
                      height={80}
                      style={{ objectFit: "contain" }}
                      className="w-50"></img>

                    <div className="font-bold">{item.label}</div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>

          {mainContext.user && itemRecommend.data?.list?.length ? (
            <>
              <Divider />
              <div className="flex justify-between">
                <div className="font-bold text-2xl uppercase flex items-center gap-3 text-primary">
                  <LikeOutlined />
                  CÓ THỂ BẠN THÍCH
                </div>
                {/* <Link href="/wow/shared-items-near-you">
                  <Button type="link">
                    <div className="flex items-center">
                      Xem thêm <FiChevronRight />
                    </div>
                  </Button>
                </Link> */}
              </div>
              <div className="grid md:grid-cols-4 grid-cols-2 gap-3 items-stretch">
                {itemRecommend.isFetching ? <ItemSkeleton size={8} /> : null}
                {itemRecommend.data?.list?.map((item) => (
                  <MobyItem
                    key={`share-item-near-you-${item.itemId}`}
                    item={item}
                  />
                ))}
              </div>
            </>
          ) : null}

          {mainContext.user && babyByMe.data?.length
            ? babyByMe.data?.map((item) => (
                <BabyItemSection data={item} key={`baby-item-${item.idbaby}`} />
              ))
            : null}

          <Divider />
          <div className="flex justify-between">
            <div className="font-bold text-2xl uppercase flex items-center gap-3 text-primary">
              <FieldTimeOutlined />
              Chia sẻ gần đây
            </div>
            <Link href="/wow/shared-items-recently">
              <Button type="link">
                <div className="flex items-center">
                  Xem thêm <FiChevronRight />
                </div>
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-4 grid-cols-2 gap-3 items-stretch">
            {sharedItemRecently.isFetching ? <ItemSkeleton size={8} /> : null}
            {sharedItemRecently.data?.list?.map((item) => (
              <MobyItem key={`share-item-recently${item.itemId}`} item={item} />
            ))}
          </div>
          <Divider />
          <div className="flex justify-between">
            <div className="font-bold text-2xl uppercase flex items-center gap-3 text-primary">
              <CoffeeOutlined />
              Đồ chia sẻ miễn phí
            </div>
            <Link href="/wow/shared-items-free">
              <Button type="link">
                <div className="flex items-center">
                  Xem thêm <FiChevronRight />
                </div>
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-4 grid-cols-2 gap-3 items-stretch">
            {sharedItemFree.isFetching ? <ItemSkeleton size={8} /> : null}
            {sharedItemFree.data?.list?.map((item) => (
              <MobyItem key={`share-item-free-${item.itemId}`} item={item} />
            ))}
          </div>

          {mainContext.user && sharedItemNearYou.data?.list?.length ? (
            <>
              <Divider />
              <div className="flex justify-between">
                <div className="font-bold text-2xl uppercase flex items-center gap-3 text-primary">
                  <FiMapPin />
                  TÌM KIẾM GẦN TÔI
                </div>
                <Link href="/wow/shared-items-near-you">
                  <Button type="link">
                    <div className="flex items-center">
                      Xem thêm <FiChevronRight />
                    </div>
                  </Button>
                </Link>
              </div>
              <div className="grid md:grid-cols-4 grid-cols-2 gap-3 items-stretch">
                {sharedItemNearYou.isFetching ? (
                  <ItemSkeleton size={8} />
                ) : null}
                {sharedItemNearYou.data?.list?.map((item) => (
                  <MobyItem
                    key={`share-item-near-you-${item.itemId}`}
                    item={item}
                  />
                ))}
              </div>
            </>
          ) : null}
          <Divider />
          {/* <div className="font-bold text-2xl uppercase flex items-center gap-3 text-primary">
            <FiSun />
            BẠN ĐÃ CHIA SẺ
          </div>
          <div className="grid md:grid-cols-4 grid-cols-2 gap-3">
            {[0, 2, 3, 4].map((item) => (
              <Link
                href="/product/1"
                key={`allala-${item}`}
                className="no-underline">
                <Card hoverable bordered>
                  <div className="flex flex-col gap-2">
                    <img
                      src={
                        "http://shopmevabe.com.vn/upload/images/ghe-ngoi-an-dam-bang-go-cho-be%20(2).jpg"
                      }
                      alt={"Product"}
                      width="100%"
                      height={150}
                      style={{ objectFit: "contain" }}
                      className="w-50"></img>
                    <div>Ghế ngồi ăn dặm bằng gỗ cho bé</div>
                    <div className="flex flex-col">
                      <div className="font-bold text-2xl text-primary">
                        126.000 đ
                      </div>
                      <div className="flex justify-between">
                        <div>
                          bởi <span className="font-bold">thai lai</span>
                        </div>
                        <div>10/5/2022</div>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div> */}
        </div>
      </div>
    </>
  );
};

export default HomePage;
