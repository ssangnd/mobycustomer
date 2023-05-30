import { useMainContext } from "@/components/context";
import { StatusSticker } from "@/components/orderation/status-sticker";
import { ReportSection } from "@/components/report";
import { useGetOrderById } from "@/hooks/order";
import { CheckOutlined, PhoneOutlined } from "@ant-design/icons";
import { useDisclosure } from "@mantine/hooks";
import { useMutation } from "@tanstack/react-query";
import {
  Avatar,
  Button,
  Card,
  Divider,
  Form,
  Input,
  Modal,
  Steps,
  Timeline,
  notification,
} from "antd";
import dayjs from "dayjs";
import Head from "next/head";
import { useRouter } from "next/router";
import numeral from "numeral";
import { useMemo } from "react";
import { FiCheck, FiPlay, FiTruck } from "react-icons/fi";
import { orderService } from "services/axios/order";
import { match } from "ts-pattern";

const OrderDetailPage = () => {
  const router = useRouter();
  const id = router.query.id as string;
  const orderById = useGetOrderById(id);
  const mainCtx = useMainContext();
  const [modal, triggerModal] = useDisclosure(false);
  const changeOrderStatusMutation = useMutation(
    (value: number) =>
      orderService.changeStatusOrder(Number.parseInt(id), value),
    {
      onSuccess: async (data) => {
        notification.success({
          message: "Xác nhận đơn thành công",
        });
        orderById.refetch();
      },
    }
  );
  const cancelOrderMutation = useMutation(
    (value: string) => orderService.cancelOrder(Number.parseInt(id), value),
    {
      onSuccess: async (data) => {
        notification.success({
          message: "Huỷ đơn thành công",
        });
        orderById.refetch();
        triggerModal.close();
      },
    }
  );

  const whatYouAre = useMemo<"receiver" | "sharer" | null>(() => {
    if (mainCtx.user && orderById.data) {
      if (mainCtx.user.userId === orderById.data?.userRecieverVM.userId)
        return "receiver";
      if (mainCtx.user.userId === orderById.data?.userSharerVM.userId)
        return "sharer";
    }
    return null;
  }, [mainCtx.user, orderById.data]);

  const orderTimelines = useMemo(() => {
    let timelines = [];
    if (orderById.data) {
      if (orderById.data?.dateCreate)
        timelines.push({
          label: "Xác nhận đơn hàng",
          date: orderById.data?.dateCreate,
        });
      if (orderById.data?.datePackage)
        timelines.push({
          label: "Người chia sẻ đã đóng gói và bàn giao cho đơn vị vận chuyển",
          date: orderById.data?.datePackage,
        });
      if (orderById.data?.dateReceived)
        timelines.push({
          label: "Đã nhận được hàng",
          date: orderById.data?.dateReceived,
        });
    }
    return timelines;
  }, [orderById.data]);

  const totalPrice = useMemo(() => {
    let value = 0;
    if (orderById.data) {
      // orderById.data.orderDetails.forEach((item) => {
      //   if (item.status !== 2) {
      //     value += item.price * item.quantity;
      //   }
      // });
      value = orderById.data?.quantity * orderById.data?.price;
    }
    return value;
  }, [orderById.data]);

  if (orderById.isFetching && !orderById.data) return <div>Đang tải</div>;
  if (orderById.isFetched && !whatYouAre)
    return <div>Đây không phải đơn hàng của bạn</div>;
  if (!orderById.data) return <></>;

  return (
    <>
      <Head>
        <title>Đơn hàng chi tiết</title>
      </Head>
      <div className="flex flex-col mb-10 gap-3 ">
        <div className="flex justify-between items-center flex-wrap">
          <div className="font-bold text-lg ">
            {" "}
            {match(orderById.data?.status)
              .with(0, () => "ĐƠN HÀNG ĐANG ĐƯỢC ĐÓNG GÓI")
              .with(1, () => "ĐƠN ĐANG VẬN CHUYỂN")
              .with(2, () => "ĐƠN ĐÃ GIAO THÀNH CÔNG")
              .with(3, () => "ĐƠN ĐÃ HUỶ")
              .otherwise(() => "")}
          </div>
          <div className="flex flex-row gap-2 items-center">
            {match([whatYouAre, orderById.data?.status])
              .with(["receiver", 0], () => (
                <div className="flex gap-2 items-center">
                  <div> Đang chờ người chia sẻ đóng hàng</div>
                  <Button type="text" danger onClick={triggerModal.open}>
                    Huỷ đơn
                  </Button>
                </div>
              ))
              .with(["receiver", 1], () => (
                <Button
                  type="primary"
                  loading={changeOrderStatusMutation.isLoading}
                  onClick={() => changeOrderStatusMutation.mutate(2)}>
                  Xác nhận đã nhận hàng
                </Button>
              ))
              .with(["receiver", 2], () => (
                <div className="text-green-500">Đã hoàn thành</div>
              ))
              .with(["receiver", 3], () => (
                <div className="text-red-400">Đã huỷ</div>
              ))
              .with(["sharer", 0], () => (
                <Button
                  type="primary"
                  loading={changeOrderStatusMutation.isLoading}
                  onClick={() => changeOrderStatusMutation.mutate(1)}>
                  Xác nhận đang vận chuyển
                </Button>
              ))
              .with(["sharer", 1], () => <>Đang vận chuyển</>)
              .with(["sharer", 2], () => (
                <div className="text-green-500">Đã hoàn thành</div>
              ))
              .with(["sharer", 3], () => (
                <div className="text-red-400">Đã huỷ</div>
              ))
              .otherwise(() => "")}
            <ReportSection id={id} category="order" onRefetch={()=>orderById.refetch()}>
              <Button type="text" size="small" className="text-gray-400">
                Tố cáo
              </Button>
            </ReportSection>
          </div>
        </div>
        <div className="flex gap-4 p-4 items-center border border-solid border-pink-300 bg-pink-50 rounded-lg">
          <div className="text-pink-400 text-2xl">
            {orderById.data?.status !== 3 ? (
              <StatusSticker status={orderById.data?.status} />
            ) : null}
          </div>
          <div className="flex flex-col text-sm">
            <div>
              {match(orderById.data?.status)
                .with(
                  0,
                  () =>
                    `${dayjs(orderById.data?.dateCreate).format(
                      "DD-MM-YYYY HH:mm"
                    )} - Người chia sẻ đang đóng gói đơn hàng`
                )
                .with(
                  1,
                  () =>
                    `${dayjs(orderById.data?.datePackage).format(
                      "DD-MM-YYYY HH:mm"
                    )} - Người chia sẻ đã gửi đơn hàng cho đơn vị vận chuyển`
                )
                .with(
                  2,
                  () =>
                    `${dayjs(orderById.data?.dateReceived).format(
                      "DD-MM-YYYY HH:mm"
                    )} - Đã nhận được hàng`
                )
                .with(3, () => (
                  <div className="flex flex-col">
                    <div>
                      {dayjs(orderById.data?.dateCreate).format(
                        "DD-MM-YYYY HH:mm"
                      )}{" "}
                      - Bị huỷ đơn do người mua
                    </div>
                    <div>Lý do: {orderById.data?.reasonCancel} </div>
                  </div>
                ))
                .otherwise(() => "")}
            </div>

            {/* {orderById.data?.status < 2 && whatYouAre === "receiver" ? (
              <div className="text-gray-400">
                {orderById.data?.daysLeftForReport}
              </div>
            ) : null} */}
          </div>
        </div>

        <Card
          size="small"
          title={
            <span className=" flex text-sm text-gray-600 ">
              <Avatar
                size="small"
                className="mr-2"
                src={match(whatYouAre)
                  .with(
                    "sharer",
                    () => orderById.data?.userRecieverVM?.userImage
                  )
                  .otherwise(
                    () => orderById.data?.userSharerVM?.userImage
                  )}></Avatar>
              <span className="font-bold mr-1">
                {match(whatYouAre)
                  .with(
                    "sharer",
                    () => orderById.data?.userRecieverVM?.userName
                  )
                  .otherwise(() => orderById.data?.userSharerVM?.userName)}
              </span>
              <span className="text-gray-300 font-normal">
                ID:{orderById.data?.orderId}
              </span>
            </span>
          }>
          <div className="flex flex-col gap-6">
            {[orderById.data?.itemVM].map((orderItem, index) => (
              <div
                className="flex  justify-between"
                key={`order-detail-${index}`}>
                <div className="flex gap-4 ">
                  <img
                    src={JSON.parse(orderItem.image)[0]}
                    width={70}
                    height={70}
                    style={{ objectFit: "cover" }}
                  />
                  <div className="flex flex-col">
                    <div className="pr-10">{orderItem.itemTitle}</div>
                    <div className=" text-gray-600 whitespace-nowrap">
                      {orderById.data?.price !== 0 ? (
                        <span>
                          &#8363; {numeral(orderById.data?.price).format("0,0")}
                        </span>
                      ) : (
                        "Miễn phí"
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <div className="whitespace-nowrap">
                    {" "}
                    {orderById.data?.price !== 0 ? (
                      <span>
                        &#8363;{" "}
                        {numeral(
                          orderById.data?.price * orderById.data?.quantity
                        ).format("0,0")}
                      </span>
                    ) : (
                      "Miễn phí"
                    )}
                  </div>
                  <div className="text-gray-400">
                    SL:{" "}
                    <span className="text-gray-600">
                      {orderById.data?.quantity}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            <Divider className="my-0" />
            <div className="flex items-center justify-between">
              <div className="uppercase font-bold ">Tổng cộng</div>
              <div className="font-bold text-xl">
                <span>&#8363; {numeral(totalPrice).format("0,0")}</span>
              </div>
            </div>
          </div>
        </Card>
        <div className=" grid md:grid-cols-2 grid-cols-1 gap-2">
          <Card>
            <div className="flex flex-col">
              <div>Ghi chú: </div>
              {orderById.data?.note || "Không có ghi chú"}
            </div>
          </Card>
          <Card>
            <div className="flex flex-col">
              <span className="font-bold">
                {" "}
                {(orderById.data?.address &&
                  JSON.parse(orderById.data?.address)?.name) ||
                  orderById.data.userSharerVM.userName}
              </span>
              <span className="text-primary">
                <PhoneOutlined />{" "}
                {(orderById.data?.address &&
                  JSON.parse(orderById.data?.address)?.phone) ||
                  orderById.data.userSharerVM.userPhone}
              </span>
              <div className="text-gray-400">
                <div className="text-gray-400">
                  {JSON.parse(orderById.data?.address).addressDetail}
                  {", "}
                  {
                    mainCtx.vnAddress.wards.find(
                      (i) =>
                        i.value ===
                        JSON.parse(orderById.data?.address).addressWard
                    )?.label
                  }
                  {", "}
                  {
                    mainCtx.vnAddress.districts.find(
                      (i) =>
                        i.value ===
                        JSON.parse(orderById.data?.address).addressDistrict
                    )?.label
                  }
                  {", "}
                  {
                    mainCtx.vnAddress.provinces.find(
                      (i) =>
                        i.value ===
                        JSON.parse(orderById.data?.address).addressProvince
                    )?.label
                  }
                </div>
              </div>
            </div>
          </Card>
        </div>
        <Card>
          <div className="flex flex-col">
            <div>Phương thức thanh toán</div>
            {orderById.data?.transactionNo ? (
              <div className="flex flex-col">
                <div>
                  <span>
                    {orderById.data?.cardType} {orderById.data?.bankCode}
                  </span>
                </div>
                <div>Mã giao dịch: {orderById.data?.transactionNo}</div>
              </div>
            ) : (
              <>Không có thông tin</>
            )}
          </div>
        </Card>
        <div>Chi tiết vận chuyển</div>
        <Steps
          current={orderById.data?.status !== 3 ? orderById.data?.status : 0}
          size="small"
          items={[
            {
              title: "Đang xử lý",

              icon: <FiPlay />,
            },
            {
              title: <span className="animate-pulse">Đang giao</span>,

              icon: <FiTruck className="animate-pulse" />,
            },
            {
              title: "Đã giao",

              icon: <FiCheck />,
            },
          ]}
        />
        <Timeline
          className="ml-3 mt-3"
          mode="left"
          pending={match(orderById.data?.status)
            .with(0, () => "ĐƠN HÀNG ĐANG ĐƯỢC ĐÓNG GÓI")
            .with(1, () => "ĐƠN ĐANG VẬN CHUYỂN")
            .otherwise(() => "")}
          items={orderTimelines.map((item) => ({
            children: (
              <div className="flex flex-col">
                <div>{item.label}</div>
                <div className="text-gray-400">
                  {dayjs(item.date).format("DD-MM-YYYY HH:mm")}
                </div>
              </div>
            ),
          }))}
        />
      </div>
      <Modal title={"Lý do huỷ đơn"} open={modal} footer={null}>
        <Form
          name="basic"
          layout="vertical"
          onFinish={(value) => {
            // saveBabyMutation.mutate(value);
            cancelOrderMutation.mutate(value.reason);
          }}>
          <Form.Item
            name="reason"
            rules={[
              { required: true, message: "Vui lòng nhập lý do huỷ đơn" },
            ]}>
            <Input.TextArea
              placeholder="Vui lòng nhập rõ lý do huỷ đơn"
              rows={5}
            />
          </Form.Item>

          <div className="flex flex-row gap-2 mt-3">
            <Button type="text" onClick={triggerModal.close}>
              Huỷ
            </Button>
            <Form.Item>
              <Button
                type="primary"
                danger
                htmlType="submit"
                icon={<CheckOutlined />}
                loading={cancelOrderMutation.isLoading}>
                Xác nhận huỷ đơn
              </Button>
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </>
  );
};

export default OrderDetailPage;
