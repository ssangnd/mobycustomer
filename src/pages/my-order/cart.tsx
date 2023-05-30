import { BreadcrumbBase } from "@/components/breadcrumb";
import { CartItem } from "@/components/cart-item";
import { useMainContext } from "@/components/context";
import emptyCart from "@/sticker/empty-cart.json";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { Player } from "@lottiefiles/react-lottie-player";
import { useCounter, useViewportSize, useWindowScroll } from "@mantine/hooks";
import { Avatar, Button, Card, Checkbox, Divider } from "antd";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import numeral from "numeral";
import { useEffect, useMemo, useState } from "react";

const MyOrder = () => {
  const [count, handlers] = useCounter(0, { min: 0, max: 10 });
  const [scroll, scrollTo] = useWindowScroll();
  const { height, width } = useViewportSize();
  const mainCtx = useMainContext();
  const { cart } = mainCtx;
  const router = useRouter();
  const sharerInCart = useMemo(() => {
    let sharer = [];
    cart.data?.cartDetailList?.map((item) => {
      if (
        !sharer.find(
          (subitem) => subitem.userId === item.itemVM.itemOwnerVM.userId
        )
      ) {
        sharer.push(item.itemVM.itemOwnerVM);
      }
    });
    return sharer;
  }, [mainCtx.cart?.data]);
  const [selectedCart, setSelectedCart] = useState([]);

  const goToPayment = () => {
    router.push({
      pathname: "/my-order/payment",
      query: {
        cart: selectedCart,
      },
    });
  };
  const numberOfQuantity = useMemo(() => {
    let numberQuan = 0;
    if (mainCtx.cart.data) {
      mainCtx.cart.data?.cartDetailList
        ?.filter((item) =>
          selectedCart.find((findItem) => findItem === item.cartDetailId)
        )
        .map((item) => {
          numberQuan += item.itemQuantity;
        });
    }
    return numberQuan;
  }, [mainCtx.cart.data, selectedCart]);

  const numberOfPrice = useMemo(() => {
    let numberPrice = 0;
    if (mainCtx.cart.data) {
      mainCtx.cart.data?.cartDetailList
        ?.filter((item) =>
          selectedCart.find((findItem) => findItem === item.cartDetailId)
        )
        .map((item) => {
          numberPrice += item.itemQuantity * item.itemVM.itemSalePrice;
        });
    }
    return numberPrice;
  }, [mainCtx.cart.data, selectedCart]);
  useEffect(() => {
    cart.refetch();
  }, []);
  return (
    <>
      <Head>
        <title>Giỏ hàng</title>
      </Head>
      <div className="grid place-items-center mb-10">
        <div className="xl:w-[1280px] lg:w-[1024px] w-full px-4 flex flex-col gap-5 mt-5 ">
          <BreadcrumbBase
            items={[
              {
                name: "Giỏ hàng",
                icon: <ShoppingCartOutlined />,
              },
            ]}
          />

          <div className="grid lg:grid-cols-5 grid-cols-1 gap-5">
            <Checkbox.Group
              className="lg:col-span-3 col-span-1"
              onChange={(value) => setSelectedCart(value)}>
              <div className="flex flex-col  gap-5 w-full">
                {!cart.data?.cartDetailList?.length ? (
                  <div className="flex flex-col items-center">
                    <Player
                      className="w-[300px]"
                      src={emptyCart}
                      loop
                      autoplay
                    />
                    <div
                      className="text-gray-400  mt-[-50px]
                    ">
                      Giỏ hàng đang bị trống
                    </div>
                  </div>
                ) : null}
                {sharerInCart.map((item) => (
                  <Card
                    key={`userid-${item.userId}`}
                    size="small"
                    className="w-full"
                    title={
                      <Link
                        href={`/user/${item.userId}`}
                        legacyBehavior
                        className="">
                        <a target="_blank" className="flex items-center gap-2">
                          <Avatar size="small" src={item.userImage}>
                            A
                          </Avatar>
                          <span className="font-bold ">{item.userName}</span>
                        </a>
                      </Link>
                    }
                    extra={
                      null
                      // <Button
                      //   type="text"
                      //   danger
                      //   shape="circle"
                      //   icon={<DeleteOutlined />}
                      // />
                    }>
                    <div className="flex flex-col gap-5">
                      {cart.data.cartDetailList
                        .filter(
                          (subitem) =>
                            subitem.itemVM.itemOwnerVM.userId === item.userId
                        )
                        .map((subitem) => (
                          <CartItem
                            key={`cart-detail-${subitem.cartDetailId}`}
                            data={subitem}
                          />
                        ))}
                    </div>
                  </Card>
                ))}
              </div>
            </Checkbox.Group>

            <div className=" lg:col-span-2 col-span-1  ">
              <Card size="small">
                <div className="flex flex-col">
                  <div className="font-bold text-lg text-gray-600 mb-1">
                    Tóm tắt giỏ hàng
                  </div>
                  <div className="flex justify-between mt-2">
                    <div className="">Số lượng giỏ hàng</div>
                    <div className="font-bold"> {numberOfQuantity}</div>
                  </div>

                  {/* <Input.Group compact className="mt-4">
                    <Input
                      style={{ width: "calc(100% - 140px)" }}
                      defaultValue=""
                      placeholder="Nhập mã voucher tại đây"
                    />
                    <Button type="primary">Áp dụng</Button>
                  </Input.Group> */}
                  <Divider />
                  <div className="flex justify-between text-xl">
                    <div className="">Tổng cộng </div>
                    <div className="font-bold text-primary">
                      &#8363; {numeral(numberOfPrice).format("0,0")}
                    </div>
                  </div>
                  <div className="text-end">VAT included, where applicable</div>
                  <Button
                    onClick={goToPayment}
                    disabled={selectedCart.length === 0}
                    type="primary"
                    size="large"
                    className="uppercase mt-5 font-bold">
                    Xác nhận đơn hàng
                  </Button>
                </div>
              </Card>
            </div>
          </div>
          {scroll.y > 200 && width > 766 ? (
            <div className="sticky bottom-2">
              <Card size="small">
                <div className="flex justify-between items-start align-top">
                  <div className="flex flex-col">
                    <div className="flex justify-between mt-2">
                      <div className="">Số lượng giỏ hàng</div>
                      <div className="font-bold">{numberOfQuantity}</div>
                    </div>
                    <div className="flex justify-between mt-1">
                      <div className="">Tạm tính</div>
                      <div className="font-bold ml-2">
                        {" "}
                        &#8363; {numeral(numberOfPrice).format("0,0")}
                      </div>
                    </div>
                    {/* <div className="flex justify-between mt-1">
                      <div className="">Phí vận chuyển</div>
                      <div className="font-bold">đ 8,000</div>
                    </div> */}
                    {/* <Input.Group compact className="mt-1">
                      <Input
                        style={{ width: "calc(100% - 110px)" }}
                        defaultValue=""
                        placeholder="Nhập mã voucher tại đây"
                      />
                      <Button type="primary">Áp dụng</Button>
                    </Input.Group> */}
                  </div>
                  <div className="flex gap-2">
                    <div className="flex flex-col items-end ">
                      <div className="flex text-xl gap-5">
                        <div className="whitespace-nowrap ">Tổng cộng </div>
                        <div className="whitespace-nowrap font-bold text-primary">
                          &#8363; {numeral(numberOfPrice).format("0,0")}
                        </div>
                      </div>
                      <div className="text-end whitespace-nowrap text-gray-400">
                        VAT included, where applicable
                      </div>
                    </div>
                    <Button
                      onClick={goToPayment}
                      disabled={selectedCart.length === 0}
                      type="primary"
                      size="large"
                      className="uppercase font-bold">
                      Xác nhận đơn hàng
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
};

export default MyOrder;
