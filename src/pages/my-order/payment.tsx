import { BreadcrumbBase } from "@/components/breadcrumb";
import { useMainContext } from "@/components/context";
import MobyLogo from "@/images/moby-landscape-logo.png";
import {
  BoxPlotOutlined,
  CheckSquareOutlined,
  CreditCardOutlined,
  EditOutlined,
  HddOutlined,
  PhoneOutlined,
  QrcodeOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { Player } from "@lottiefiles/react-lottie-player";
import numeral from "numeral";

import { AddressSelection } from "@/components/address/address-select";
import checkCompleted from "@/sticker/check-completed.json";
import { useCounter, useDisclosure } from "@mantine/hooks";
import { useMutation } from "@tanstack/react-query";
import {
  Avatar,
  Button,
  Card,
  Checkbox,
  Divider,
  Drawer,
  Input,
  Spin,
  notification,
} from "antd";
import classcat from "classcat";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";
import { cartService } from "services/axios/cart";
import { GoToVNPayPayment } from "services/vnpay";
const PaymentPage = ({ ip }) => {
  const [count, handlers] = useCounter(0, { min: 0, max: 10 });
  const router = useRouter();
  const mainCtx = useMainContext();
  const [note, setNote] = useState("");
  const [addrModal, handlerModal] = useDisclosure(false);
  const [confirmModal, handlerConfirmModal] = useDisclosure(false);
  const [paymentMethod, setPaymentMethod] = useState<
    "VNBANK" | "VNPAYQR" | "INTCARD"
  >("INTCARD");
  const { cart } = mainCtx;

  const selectedCart = useMemo(() => {
    if (router.query.cart) {
      if (Array.isArray(router.query.cart)) {
        return router.query.cart;
      }
      return [router.query.cart];
    }
    return [];
  }, [router.query.cart]);

  const cartSelected = useMemo(() => {
    if (cart.data) {
      return selectedCart?.map((item) =>
        cart.data?.cartDetailList.find(
          (subitem) => subitem.cartDetailId === Number.parseInt(item)
        )
      );
    }
    return [];
  }, [router.query.cart, cart.data, selectedCart]);

  const sharerInCart = useMemo(() => {
    let sharer = [];
    cartSelected?.map((item) => {
      if (
        !sharer.find(
          (subitem) => subitem.userId === item.itemVM.itemOwnerVM.userId
        )
      ) {
        sharer.push(item?.itemVM.itemOwnerVM);
      }
    });
    return sharer;
  }, [mainCtx.cart?.data, cartSelected]);

  const numberOfQuantity = useMemo(() => {
    let numberQuan = 0;
    if (mainCtx.cart.data) {
      cartSelected.map((item) => {
        numberQuan += item.itemQuantity;
      });
    }
    return numberQuan;
  }, [cartSelected, mainCtx.cart.data]);

  const numberOfPrice = useMemo(() => {
    let numberPrice = 0;
    if (mainCtx.cart.data) {
      cartSelected.map((item) => {
        numberPrice += item.itemQuantity * item.itemVM.itemSalePrice;
      });
    }
    return numberPrice;
  }, [cartSelected, mainCtx.cart.data]);
  const savePayment = () => {
    checkCartMutation.mutate();
    // router.replace("/order/payment-success");
  };

  const updateCartAddressMutation = useMutation(
    (value) => cartService.updateCartAddress(value),
    {
      onSuccess: async (data) => {
        mainCtx.cart.refetch();
      },
    }
  );

  const checkCartMutation = useMutation(
    () => cartService.checkCart(selectedCart?.map((i) => Number.parseInt(i))),
    {
      onSuccess: async (data) => {
        if (numberOfPrice) {
          GoToVNPayPayment({
            amount: numberOfPrice,
            ipAdrr: ip,
            bankCode: paymentMethod,
            locale: "vn",
            returnUrl: `${window.location.origin}/my-order/payment-success`,
            info: JSON.stringify({
              note,
              selectedCart: selectedCart?.map((i) => Number.parseInt(i)),
            }),
          });
        } else {
          router.push({
            pathname: "/my-order/payment-success",
            query: {
              vnp_OrderInfo: JSON.stringify({
                note,
                selectedCart: selectedCart?.map((i) => Number.parseInt(i)),
              }),
            },
          });
        }
      },
      onError: async (data) => {
        notification.error({
          message: "Có lỗi trong quá trình thanh toán",
        });
        mainCtx.cart.refetch();
      },
    }
  );
  const executeConfirmOrder = useMutation(
    () =>
      cartService.confirmCart(
        selectedCart?.map((i) => Number.parseInt(i)),
        note
      ),
    {
      onSuccess: async (data) => {
        handlerConfirmModal.open();
      },
    }
  );
  // if (1 + 1 === 1 + 1) return <div>ssa</div>;
  return (
    <>
      <Head>
        <title>Thanh toán</title>
      </Head>
      <Spin
        size="large"
        tip="Đang xác nhận..."
        spinning={executeConfirmOrder.isLoading}>
        <div className="grid place-items-center mb-10 ">
          <div className="xl:w-[1280px] lg:w-[1024px] w-full px-4 flex flex-col gap-5 mt-5 ">
            <BreadcrumbBase
              items={[
                {
                  name: "Giỏ hàng",
                  icon: <ShoppingCartOutlined />,
                  href: "/order/cart",
                },
                { name: "Thanh toán", icon: <CheckSquareOutlined /> },
              ]}
            />
            <div className="grid lg:grid-cols-5 grid-cols-1 gap-5">
              <div className="flex flex-col lg:col-span-3 col-span-1 gap-5">
                <Spin spinning={mainCtx.cart.isFetching} tip="Đang cập nhật">
                  <Card
                    size="small"
                    title={
                      <span className=" flex gap-3 text-lg text-gray-600 ">
                        <HddOutlined /> Địa chỉ giao hàng
                      </span>
                    }
                    extra={
                      <Button
                        type="text"
                        className="text-primary"
                        onClick={handlerModal.open}
                        icon={<EditOutlined />}>
                        Chỉnh sửa
                      </Button>
                    }>
                    <div className="flex flex-col">
                      <div className=" flex gap-10">
                        <span className="font-bold">
                          {(mainCtx.cart.data &&
                            JSON.parse(mainCtx.cart.data.address)?.name) ||
                            mainCtx.user?.userName}
                        </span>
                        <span className="text-primary">
                          <PhoneOutlined />{" "}
                          {(mainCtx.cart.data &&
                            JSON.parse(mainCtx.cart.data.address)?.phone) ||
                            mainCtx.user?.userPhone}
                        </span>
                      </div>
                      {mainCtx.cart.data ? (
                        <div className="text-gray-400">
                          {JSON.parse(mainCtx.cart.data.address).addressDetail}
                          {", "}
                          {
                            mainCtx.vnAddress.wards.find(
                              (i) =>
                                i.value ===
                                JSON.parse(mainCtx.cart.data.address)
                                  .addressWard
                            )?.label
                          }
                          {", "}
                          {
                            mainCtx.vnAddress.districts.find(
                              (i) =>
                                i.value ===
                                JSON.parse(mainCtx.cart.data.address)
                                  .addressDistrict
                            )?.label
                          }
                          {", "}
                          {
                            mainCtx.vnAddress.provinces.find(
                              (i) =>
                                i.value ===
                                JSON.parse(mainCtx.cart.data.address)
                                  .addressProvince
                            )?.label
                          }
                        </div>
                      ) : null}
                    </div>
                  </Card>
                </Spin>
                <Card
                  size="small"
                  title={
                    <span className=" flex gap-3 text-lg text-gray-600 ">
                      <BoxPlotOutlined /> Kiện hàng
                    </span>
                  }
                  extra={
                    <span className="italic text-gray-400">
                      Phân bối bởi Moby
                    </span>
                  }>
                  {sharerInCart.map((item, index) => (
                    <div
                      className="flex flex-col gap-6 mb-5  border-b-gray-300"
                      key={`userid-${item.userId}`}>
                      <div className="flex justify-between">
                        <div className="flex items-center gap-2">
                          <Avatar size="small" src={item.userImage}>
                            A
                          </Avatar>
                          <span className="font-bold ">{item.userName}</span>
                        </div>
                        <div className="text-gray-500 italic">
                          Kiện {index + 1}/{sharerInCart.length}
                        </div>
                      </div>

                      {cartSelected
                        .filter(
                          (subitem) =>
                            subitem.itemVM.itemOwnerVM.userId === item.userId
                        )
                        .map((subitem) => (
                          <div
                            className="flex  justify-between"
                            key={`cart-detail-${subitem.cartDetailId}`}>
                            <div className="flex gap-4 ">
                              <img
                                // src="https://firebasestorage.googleapis.com/v0/b/fir-projecty-5.appspot.com/o/images%2F919cddc28d20e7189e1763fb425c4785.png?alt=media&token=58eb247a-902d-4e93-b2b6-de81acc42805"
                                src={JSON.parse(subitem.itemVM?.image)[0]}
                                width={100}
                                height={100}
                                style={{ objectFit: "cover" }}
                              />
                              <div className="flex flex-col">
                                <div className="pr-10">
                                  {subitem.itemVM?.itemTitle}
                                </div>
                                <div className=" text-gray-600 whitespace-nowrap">
                                  {subitem.itemVM?.itemSalePrice !== 0 ? (
                                    <span>
                                      &#8363;{" "}
                                      {numeral(
                                        subitem.itemVM?.itemSalePrice
                                      ).format("0,0")}
                                    </span>
                                  ) : (
                                    "Miễn phí"
                                  )}
                                </div>
                                {/* <div className="text-sm text-gray-400 ">
                                Lifebuoy
                              </div> */}
                              </div>
                            </div>
                            <div className="flex flex-col items-end">
                              <div className="whitespace-nowrap text-lg">
                                {subitem.itemVM?.itemSalePrice !== 0 ? (
                                  <span>
                                    &#8363;{" "}
                                    {numeral(
                                      subitem.itemVM?.itemSalePrice *
                                        subitem.itemQuantity
                                    ).format("0,0")}
                                  </span>
                                ) : (
                                  "Miễn phí"
                                )}
                              </div>
                              <div className="text-gray-400">
                                Số lượng:{" "}
                                <span className="text-gray-600">
                                  {subitem?.itemQuantity}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      <Divider className="my-0" />
                    </div>
                  ))}
                </Card>
              </div>
              <div className=" lg:col-span-2 col-span-1 gap-2">
                <Card size="small" className="mb-4">
                  <div className=" text-sm text-gray-600 mb-2">
                    Bạn có ghi chú gì cho người chia sẻ không?
                  </div>
                  <Input.TextArea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Hãy để ghi chú tại đây"></Input.TextArea>
                </Card>

                <Card size="small">
                  <div className="flex flex-col">
                    {numberOfPrice ? (
                      <>
                        <div className="font-bold text-lg text-gray-600 mb-1">
                          Phương thức thanh toán
                        </div>

                        <div
                          className={classcat([
                            "group rounded-lg border-solid p-3 mt-2 cursor-pointer hover:border-pink-300 hover:bg-pink-50 duration-200 ",
                            {
                              "border-gray-300": paymentMethod !== "INTCARD",
                              "border-primary bg-pink-50":
                                paymentMethod === "INTCARD",
                            },
                          ])}
                          onClick={() => setPaymentMethod("INTCARD")}>
                          <div className="flex justify-between gap-1">
                            <div className="text-md font-bold flex items-center gap-2">
                              <Image
                                src={require("@/images/credit-4.svg")}
                                alt="Momo payment"
                                width={20}
                                height={20}
                              />
                              Thẻ thanh toán quốc tế
                            </div>
                            <div>
                              <Checkbox checked={paymentMethod === "INTCARD"} />
                            </div>
                          </div>
                          <div className="border border-solid border-gray-100 group-hover:border-pink-100 mt-2" />
                          <div className="text-gray-500 ">
                            Thanh toán chuyển hướng bằng cổng ví VNPAY
                          </div>
                          <div>
                            {[
                              require("@/images/bank-code/VISA.svg"),
                              require("@/images/bank-code/MASTERCARD.svg"),
                              require("@/images/bank-code/JCB.svg"),
                              require("@/images/bank-code/UPI.svg"),
                              require("@/images/bank-code/AMEX.svg"),
                            ].map((item) => (
                              <Image
                                src={item}
                                alt="Bank Method"
                                width={30}
                                height={30}
                              />
                            ))}
                          </div>
                        </div>
                        <div
                          className={classcat([
                            "group rounded-lg border-solid p-3 mt-2 cursor-pointer hover:border-pink-300 hover:bg-pink-50 duration-200 ",
                            {
                              "border-gray-300": paymentMethod !== "VNBANK",
                              "border-primary bg-pink-50":
                                paymentMethod === "VNBANK",
                            },
                          ])}
                          onClick={() => setPaymentMethod("VNBANK")}>
                          <div className="flex justify-between gap-1">
                            <div className="text-md font-bold flex items-center gap-2">
                              <CreditCardOutlined className="mx-1" />
                              Thẻ nội địa và tài khoản ngân hàng
                            </div>
                            <div>
                              <Checkbox checked={paymentMethod === "VNBANK"} />
                            </div>
                          </div>
                          <div className="border border-solid border-gray-100 group-hover:border-pink-100 mt-2" />
                          <div className="text-gray-500 ">
                            Thanh toán chuyển hướng bằng cổng ví VNPAY
                          </div>
                          <Image
                            src={require("@/images/bank-code/partner_app.png")}
                            alt="Bank Method"
                            className="w-full object-contain h-auto"
                          />
                        </div>
                        <div
                          className={classcat([
                            "group rounded-lg border-solid p-3 mt-2 cursor-pointer hover:border-pink-300 hover:bg-pink-50 duration-200 ",
                            {
                              "border-gray-300": paymentMethod !== "VNPAYQR",
                              "border-primary bg-pink-50":
                                paymentMethod === "VNPAYQR",
                            },
                          ])}
                          onClick={() => setPaymentMethod("VNPAYQR")}>
                          <div className="flex justify-between gap-1">
                            <div className="text-md font-bold flex items-center gap-2">
                              <QrcodeOutlined className="mx-1" />
                              Quét mã VNPAY QR
                            </div>
                            <div>
                              <Checkbox checked={paymentMethod === "VNPAYQR"} />
                            </div>
                          </div>
                          <div className="border border-solid border-gray-100 group-hover:border-pink-100 mt-2" />
                          <div className="text-gray-500 ">
                            Thanh toán chuyển hướng bằng cổng ví VNPAY
                          </div>
                        </div>
                        <div className="flex gap-2 mt-1">
                          Thanh toán được cung cấp bởi{" "}
                          <Image
                            src={require("@/images/vnpay-logo.png")}
                            alt="Bank Method"
                            width={60}
                            className=""
                            // height={30}
                          />
                        </div>

                        <Divider />
                      </>
                    ) : null}

                    {/* <div className="font-bold text-lg text-gray-600">
                      Voucher
                    </div>
                    <Input.Group compact>
                      <Input
                        style={{ width: "calc(100% - 140px)" }}
                        defaultValue=""
                        placeholder="Nhập mã voucher tại đây"
                      />
                      <Button type="primary">Áp dụng</Button>
                    </Input.Group>
                    <Divider /> */}
                    <div className="font-bold text-lg text-gray-600">
                      Tóm tắt đơn hàng
                    </div>

                    <div className="flex justify-between mt-5">
                      <div className="">Số lượng giỏ hàng</div>
                      <div className="font-bold">{numberOfQuantity}</div>
                    </div>

                    <div className="flex justify-between mt-5">
                      <div className="">Tổng tiền hàng</div>
                      <div className="font-bold ml-2">
                        {" "}
                        &#8363; {numeral(numberOfPrice).format("0,0")}
                      </div>
                    </div>
                    {/* <div className="flex justify-between mt-2">
                    <div className="">Phí vận chuyển</div>
                    <div className="font-bold">đ 8,000</div>
                  </div>
                  <div className="flex justify-between mt-2">
                    <div className="">Voucher</div>
                    <div className="font-bold">đ 8,000</div>
                  </div>
                  <div className="italic text-gray-400 ">
                    Giảm 20% cho đơn hàng 100.000 đ
                  </div>
                  <Divider /> */}
                    <Divider />
                    <div className="flex justify-between text-xl">
                      <div className="">Tổng cộng </div>
                      <div className="font-bold text-primary">
                        &#8363; {numeral(numberOfPrice).format("0,0")}
                      </div>
                    </div>

                    <Button
                      type="primary"
                      size="large"
                      className="uppercase mt-5 font-bold"
                      // onClick={() => executeConfirmOrder.mutate()}
                      onClick={() => savePayment()}>
                      Thanh toán đơn hàng
                    </Button>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </Spin>

      <Drawer
        title="Chọn địa chỉ giao hàng"
        placement="right"
        width={520}
        open={addrModal}
        closable={false}
        onClose={handlerModal.close}>
        <AddressSelection
          onSelect={(value) => {
            updateCartAddressMutation.mutate(value);
            handlerModal.close();
          }}
        />
      </Drawer>

      <Drawer
        placement="bottom"
        title={
          <div className="flex items-center justify-center">
            <Link href="/">
              <Image
                src={MobyLogo}
                alt="Moby"
                width={100}
                className="w-50"></Image>
            </Link>
          </div>
        }
        height={"100%"}
        open={confirmModal}
        closeIcon={null}
        onClose={handlerConfirmModal.close}>
        <div className="grid place-items-center mb-10">
          <div className="xl:w-[1280px] lg:w-[1024px] w-full px-4 flex flex-col gap-5 mt-5 ">
            <div className="grid lg:grid-cols-5 grid-cols-1 gap-5">
              <div className="flex flex-col lg:col-span-2 items-center  col-span-1 gap-2">
                <Player
                  className=" w-[250px]"
                  src={checkCompleted}
                  keepLastFrame
                  loop={false}
                  autoplay
                />
                <div className="text-primary text-2xl mt-[-50px]">
                  Xác nhận đơn hàng thành công
                </div>
                <div className="">
                  Hãy chờ người chia sẻ chấp nhận đơn hàng nhé
                </div>

                <div className="flex md:flex-row flex-col items-center flex-wrap gap-3">
                  <a href="/account/order?itemType=receiver&status=-1">
                    <Button type="primary">Xem chi tiết đơn hàng</Button>
                  </a>
                  <a href="/">
                    <Button type="default">Tiếp tục mua sắm</Button>
                  </a>
                </div>
              </div>
              <div className=" lg:col-span-3 col-span-1 gap-2">
                <Card size="small" className="mb-4">
                  <div className="flex flex-col">
                    <div className="font-bold text-lg text-gray-600">
                      Tóm tắt đơn hàng
                    </div>

                    <div className="flex justify-between mt-5">
                      <div className="">Số lượng giỏ hàng</div>
                      <div className="font-bold">{numberOfQuantity}</div>
                    </div>

                    <div className="flex justify-between mt-5">
                      <div className="">Tổng tiền hàng</div>
                      <div className="font-bold ml-2">
                        {" "}
                        &#8363; {numeral(numberOfPrice).format("0,0")}
                      </div>
                    </div>

                    <div className="flex justify-between text-xl">
                      <div className="">Tổng cộng </div>
                      <div className="font-bold text-primary">
                        &#8363; {numeral(numberOfPrice).format("0,0")}
                      </div>
                    </div>
                  </div>
                </Card>

                <Card size="small" className="mb-4">
                  <div className=" text-sm text-gray-600 mb-2">
                    Ghi chú gì cho người chia sẻ
                  </div>
                  <div>
                    {note || <span className="italic">Không có ghi chú</span>}
                  </div>
                </Card>

                <Card
                  size="small"
                  title={
                    <span className=" flex gap-3 text-lg text-gray-600 ">
                      <BoxPlotOutlined /> Kiện hàng
                    </span>
                  }
                  extra={
                    <span className="italic text-gray-400">
                      Phân bối bởi Moby
                    </span>
                  }
                  className="mb-3">
                  {sharerInCart.map((item, index) => (
                    <div
                      className="flex flex-col gap-6 mb-5  border-b-gray-300"
                      key={`userid-${item.userId}`}>
                      <div className="flex justify-between">
                        <div className="flex items-center gap-2">
                          <Avatar size="small" src={item.userImage}>
                            A
                          </Avatar>
                          <span className="font-bold ">{item.userName}</span>
                        </div>
                        <div className="text-gray-500 italic">
                          Kiện {index + 1}/{sharerInCart.length}
                        </div>
                      </div>

                      {cartSelected
                        .filter(
                          (subitem) =>
                            subitem.itemVM.itemOwnerVM.userId === item.userId
                        )
                        .map((subitem) => (
                          <div
                            className="flex  justify-between"
                            key={`cart-detail-${subitem.cartDetailId}`}>
                            <div className="flex gap-4 ">
                              <img
                                // src="https://firebasestorage.googleapis.com/v0/b/fir-projecty-5.appspot.com/o/images%2F919cddc28d20e7189e1763fb425c4785.png?alt=media&token=58eb247a-902d-4e93-b2b6-de81acc42805"
                                src={JSON.parse(subitem.itemVM?.image)[0]}
                                width={100}
                                height={100}
                                style={{ objectFit: "cover" }}
                              />
                              <div className="flex flex-col">
                                <div className="pr-10">
                                  {subitem.itemVM?.itemTitle}
                                </div>
                                <div className=" text-gray-600 whitespace-nowrap">
                                  {subitem.itemVM?.itemSalePrice !== 0 ? (
                                    <span>
                                      &#8363;{" "}
                                      {numeral(
                                        subitem.itemVM?.itemSalePrice
                                      ).format("0,0")}
                                    </span>
                                  ) : (
                                    "Miễn phí"
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col items-end">
                              <div className="whitespace-nowrap text-lg">
                                {subitem.itemVM?.itemSalePrice !== 0 ? (
                                  <span>
                                    &#8363;{" "}
                                    {numeral(
                                      subitem.itemVM?.itemSalePrice *
                                        subitem.itemQuantity
                                    ).format("0,0")}
                                  </span>
                                ) : (
                                  "Miễn phí"
                                )}
                              </div>
                              <div className="text-gray-400">
                                Số lượng:{" "}
                                <span className="text-gray-600">
                                  {subitem?.itemQuantity}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      <Divider className="my-0" />
                    </div>
                  ))}
                </Card>

                <Card
                  size="small"
                  title={
                    <span className=" flex gap-3 text-lg text-gray-600 ">
                      <HddOutlined /> Địa chỉ giao hàng
                    </span>
                  }>
                  <div className="flex flex-col">
                    <div className=" flex gap-10">
                      <span className="font-bold">
                        {(mainCtx.cart.data &&
                          JSON.parse(mainCtx.cart.data.address)?.name) ||
                          mainCtx.user?.userName}
                      </span>
                      <span className="text-primary">
                        <PhoneOutlined />{" "}
                        {(mainCtx.cart.data &&
                          JSON.parse(mainCtx.cart.data.address)?.phone) ||
                          mainCtx.user?.userPhone}
                      </span>
                    </div>
                    {mainCtx.cart.data ? (
                      <div className="text-gray-400">
                        {JSON.parse(mainCtx.cart.data.address).addressDetail}
                        {", "}
                        {
                          mainCtx.vnAddress.wards.find(
                            (i) =>
                              i.value ===
                              JSON.parse(mainCtx.cart.data.address).addressWard
                          )?.label
                        }
                        {", "}
                        {
                          mainCtx.vnAddress.districts.find(
                            (i) =>
                              i.value ===
                              JSON.parse(mainCtx.cart.data.address)
                                .addressDistrict
                          )?.label
                        }
                        {", "}
                        {
                          mainCtx.vnAddress.provinces.find(
                            (i) =>
                              i.value ===
                              JSON.parse(mainCtx.cart.data.address)
                                .addressProvince
                          )?.label
                        }
                      </div>
                    ) : null}
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </Drawer>
    </>
  );
};

export default PaymentPage;
export async function getServerSideProps({ req }) {
  const forwarded =
    req.headers["x-forwarded-for"] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;
  const ip = forwarded;
  return {
    props: {
      ip,
    },
  };
}
