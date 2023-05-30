import { BreadcrumbBase } from "@/components/breadcrumb";
import { CommentTee } from "@/components/commentee";
import { useMainContext } from "@/components/context";
import { useChatContext } from "@/components/context/chat";
import { ReportSection } from "@/components/report";
import { useUserById } from "@/hooks/account";
import { useCreateRecord, useItem, useItemForSEO } from "@/hooks/product";
import { queryClient } from "@/libs/react-query/query-client";
import {
  EyeOutlined,
  MessageOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { Splide, SplideSlide, SplideTrack } from "@splidejs/react-splide";
import { dehydrate, useMutation } from "@tanstack/react-query";
import { Avatar, Button, Card, Divider, message, notification } from "antd";
import dayjs from "dayjs";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import numeral from "numeral";
import { createRef, useEffect } from "react";
import { FaFacebook, FaTelegramPlane, FaTwitter } from "react-icons/fa";
import { FiChevronRight } from "react-icons/fi";
import {
  FacebookShareButton,
  TelegramShareButton,
  TwitterShareButton,
} from "react-share";
import { productService } from "services/axios";
import { cartService } from "services/axios/cart";
const ProductDetailPage = ({}) => {
  const router = useRouter();
  const id = router.query.id as string;

  const itemSEO = useItemForSEO(id);
  const itembyId = useItem(id);
  const userById = useUserById(itembyId.data?.userId);
  const mainCtx = useMainContext();
  const addToCart = () => {};
  const createRecord = useCreateRecord({
    userId: mainCtx?.user?.userId,
    titleName: itembyId.data?.itemTitle,
  });
  const chatCtx = useChatContext();

  const mainRef = createRef<Splide>();

  const thumbsRef = createRef<Splide>();

  useEffect(() => {
    if (mainRef.current && thumbsRef.current && thumbsRef.current.splide) {
      mainRef.current.sync(thumbsRef.current.splide);
    }
  }, []);

  const addToCartMutation = useMutation(
    () => cartService.addToCartDetail(mainCtx.user.cartID, id),
    {
      onSuccess: async (data) => {
        mainCtx.cart.refetch();
        notification.success({
          placement: "bottom",
          message: (
            <span className="text-primary">Thêm vào giỏ hàng thành công</span>
          ),
          description: (
            <span className="text-gray-700">
              Hãy kiểm tra sản phẩm tại{" "}
              <span
                className="font-bold cursor-pointer text-primary hover:text-pink-400 duration-300"
                onClick={() => {
                  router.push("/my-order/cart");
                  notification.destroy();
                }}>
                giỏ hàng
              </span>{" "}
              nhé!
            </span>
          ),
          icon: (
            <img
              src={JSON.parse(itembyId.data?.image)[0]}
              alt="Image 1"
              width={25}
              height={25}
              style={{ objectFit: "cover", borderRadius: 3 }}
            />
          ),
        });
      },
    }
  );

  const handleAddToCart = () => {
    if (mainCtx.user) {
      addToCartMutation.mutate();
    } else {
      message.info("Vui lòng đăng nhập để có thể thêm giỏ hàng");
      router.push({
        pathname: "/authenticate/signin",
        query: { url: "/product/" + id },
      });
    }
  };
  console.log(createRecord);
  return (
    <>
      <Head>
        <title>{itemSEO.data?.itemTitle} | Moby</title>
        <meta
          property="og:title"
          content={`${itemSEO.data?.itemTitle} | Moby`}
        />
        <meta property="og:type" content="article" />
        <meta
          property="og:image"
          content={
            itemSEO.data?.image ? JSON.parse(itemSEO.data?.image)[0] : ""
          }
        />
        <meta
          property="og:url"
          content={`https://moby-customer.vercel.app/product/${id}`}
        />
      </Head>

      {itembyId.data && !itembyId.isFetching ? (
        <div className="grid place-items-center mb-4">
          <div className="xl:w-[1280px] lg:w-[1024px] w-full px-4 flex flex-col gap-5 ">
            <div className="flex justify-between flex-wrap">
              <BreadcrumbBase
                items={[
                  { href: "/signin", name: "Phân loại" },
                  { name: "Chi tiết sản phẩm" },
                  { name: itembyId?.data?.itemTitle },
                ]}
              />
              <ReportSection id={id} category="product">
                <Button type="text" size="small" className="text-gray-400">
                  Báo cáo
                </Button>
              </ReportSection>
            </div>
            <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
              <div>
                {" "}
                <Splide
                  ref={mainRef}
                  hasTrack={false}
                  options={{
                    type: "loop",
                    autoplay: true,
                    perPage: 1,
                    gap: 10,
                  }}>
                  <SplideTrack>
                    {JSON.parse(itembyId?.data?.image)?.map((item) => (
                      <SplideSlide>
                        <img
                          src={item}
                          alt={item}
                          width={"100%"}
                          height={300}
                          style={{ objectFit: "cover", borderRadius: 10 }}
                        />
                      </SplideSlide>
                    ))}
                  </SplideTrack>
                </Splide>
                <Splide
                  ref={thumbsRef}
                  hasTrack={false}
                  options={{
                    type: "slide",
                    rewind: true,
                    gap: "1rem",
                    pagination: false,
                    fixedWidth: 110,
                    fixedHeight: 70,
                    cover: true,
                    focus: "center",
                    isNavigation: true,
                    arrows: false,
                  }}>
                  <SplideTrack className="mt-2">
                    {JSON.parse(itembyId.data?.image)?.map((item) => (
                      <SplideSlide>
                        <img
                          src={item}
                          alt={item}
                          width={"100%"}
                          height={70}
                          style={{ objectFit: "cover", borderRadius: 10 }}
                        />
                      </SplideSlide>
                    ))}
                  </SplideTrack>
                </Splide>
              </div>
              <div className="flex flex-col gap-1">
                <div className="font-bold text-2xl">
                  {itembyId.data?.itemTitle}
                </div>
                <div className="flex items-center">
                  <Link href="/">
                    <Button
                      type="link"
                      className="text-start align-text-top px-0">
                      {itembyId.data.categoryName}
                    </Button>
                  </Link>
                  <div className="text-gray-500 pt-1">
                    <FiChevronRight />
                  </div>
                  <Link href="/">
                    <Button
                      type="link"
                      className="text-start align-text-top px-0">
                      {itembyId.data.subCategoryName}
                    </Button>
                  </Link>
                </div>

                <div className="whitespace-nowrap text-3xl text-primary font-bold mt-4">
                  {itembyId.data?.itemSalePrice !== 0 ? (
                    <span>
                      &#8363;{" "}
                      {numeral(itembyId.data?.itemSalePrice).format("0,0")}
                    </span>
                  ) : (
                    "Miễn phí"
                  )}
                </div>

                <div className="flex gap-3 mt-3 flex-wrap">
                  {/* <div className="flex flex-row gap-2">
                    <Button
                      type="primary"
                      className="bg-white text-primary border-primary hover:border-white font-bold"
                      size="large"
                      onClick={handlers.decrement}>
                      -
                    </Button>
                    <InputNumber
                      className="quantity-item-input"
                      size="large"
                      value={count}
                      style={{ width: 70 }}
                      onChange={(value: number) => handlers.set(value || 0)}
                      controls={false}></InputNumber>
                    <Button
                      type="primary"
                      rootClassName="text-center"
                      className="bg-white text-primary border-primary hover:border-white font-bold"
                      size="large"
                      onClick={handlers.increment}>
                      +
                    </Button>
                  </div> */}

                  <Button
                    disabled={itembyId.data?.itemShareAmount === 0}
                    type="primary"
                    className="bg-primary"
                    size="large"
                    icon={<ShoppingCartOutlined />}
                    loading={addToCartMutation.isLoading}
                    onClick={handleAddToCart}>
                    {itembyId.data?.itemShareAmount !== 0
                      ? "Thêm vào giỏ hàng"
                      : "Hết hàng"}
                  </Button>
                </div>
                <div className="italic text-sm text-gray-400">
                  * Số lượng hàng còn lại: {itembyId.data.itemShareAmount}
                </div>
                <div className="flex gap-2 mt-1 items-center">
                  <div>Chia sẻ:</div>
                  <FacebookShareButton
                    hashtag="moby"
                    url={`https://moby-customer.vercel.app/product/${id}`}
                    quote="AFVCDVCXVCXVX">
                    <Button
                      type="text"
                      size="large"
                      icon={<FaFacebook color="#4267B2" size={28} />}></Button>
                  </FacebookShareButton>
                  <TelegramShareButton
                    url={`https://moby-customer.vercel.app/product/${id}`}>
                    <Button
                      type="text"
                      size="large"
                      icon={
                        <FaTelegramPlane color="#229ED9" size={28} />
                      }></Button>
                  </TelegramShareButton>
                  <TwitterShareButton
                    url={`https://moby-customer.vercel.app/product/${id}`}>
                    <Button
                      type="text"
                      size="large"
                      icon={<FaTwitter color="#1DA1F2" size={28} />}></Button>
                  </TwitterShareButton>
                </div>
              </div>
            </div>
            <Divider className="my-1" />
            <div className="flex justify-between">
              <div className="flex gap-2">
                <Avatar size="large" src={userById.data?.userImage} />{" "}
                <div className="flex flex-col gap-1">
                  <div className="font-bold">Tạo bởi</div>
                  <div className="">{userById.data?.userName}</div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  icon={<MessageOutlined />}
                  onClick={() =>
                    chatCtx.triggerChat({ userId: userById.data?.userId })
                  }>
                  Chat ngay
                </Button>
                <Link
                  href={`/user/${itembyId.data?.userId}`}
                  className="no-underline text-blue-500">
                  <Button
                    type="primary"
                    icon={<EyeOutlined />}
                    onClick={() =>
                      chatCtx.triggerChat({ userId: userById.data?.userId })
                    }>
                    Xem
                  </Button>
                </Link>
              </div>
            </div>
            <Divider className="my-1" />

            <Card className="mt-4" title="Mô tả sản phẩm">
              {itembyId.data.itemDetailedDescription}
            </Card>
            <Card className="mt-4" title="Chi tiết sản phẩm">
              <div className="grid  lg:grid-cols-2 grid-cols-1 items-center gap-2">
                <div className="flex flex-wrap items-center lg:col-span-2 grid-cols-1">
                  <span className="text-gray-500 whitespace-nowrap ">
                    Danh mục:
                  </span>
                  <div className="flex items-center ml-1">
                    <Link href="/" className="no-underline">
                      {itembyId.data.categoryName}
                    </Link>
                    <div className="text-gray-500 pt-2">
                      <FiChevronRight />
                    </div>
                    <Link href="/" className="no-underline">
                      {itembyId.data.subCategoryName}
                    </Link>
                  </div>
                </div>
                <div>
                  <span className="text-gray-500 mr-1"> Tình trạng:</span>
                  {itembyId.data?.itemQuanlity}
                </div>
                <div>
                  <span className="text-gray-500 mr-1"> Khối lượng:</span>
                  {itembyId.data?.itemMass} gram
                </div>
                <div>
                  <span className="text-gray-500 mr-1"> Kích thước hàng:</span>
                  {itembyId.data?.itemSize ? "Hàng cồng kềnh" : "Hàng nhỏ"}
                </div>
                <div>
                  <span className="text-gray-500 mr-1"> Thể loại:</span>
                  {itembyId.data?.share ? "Đơn chia sẻ" : "Đơn hỗ trợ"}
                </div>

                <div>
                  <span className="text-gray-500 mr-1"> Ngày khởi tạo:</span>
                  {dayjs(itembyId.data?.itemDateCreated).format(
                    "DD-MM-YYYY HH:mm"
                  )}
                </div>

                {itembyId.data?.itemExpiredTime ? (
                  <div>
                    <span className="text-gray-500 mr-1"> Ngày hết hạn:</span>
                    {dayjs(itembyId.data?.itemExpiredTime).format(
                      "DD-MM-YYYY HH:mm"
                    )}
                  </div>
                ) : null}

                <div>
                  <span className="text-gray-500 mr-1"> Tạo bởi:</span>
                  <Link
                    href={`/user/${itembyId.data?.userId}`}
                    className="no-underline text-blue-500">
                    {itembyId.data?.userName}
                  </Link>
                </div>
              </div>
            </Card>
            <div className="grid grid-cols-5">
              <Card className="mt-4 md:col-span-3 col-span-5" title="Bình luận">
                <CommentTee id={id} type="item" />
              </Card>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};
export async function getStaticProps({ params }) {
  const { id } = params;
  await queryClient.prefetchQuery({
    queryKey: ["/item-details-seo", id],
    queryFn: () => {
      if (!id) {
        throw new Error("[useItem] Invalid item_id parameter");
      }
      return productService.getProductForSEOByID({ id });
    },
  });
  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: "blocking",
  };
}

export default ProductDetailPage;
