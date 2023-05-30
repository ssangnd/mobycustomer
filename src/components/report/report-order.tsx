import { useGetOrderById } from "@/hooks/order";
import { PhoneOutlined } from "@ant-design/icons";
import { Avatar, Card, Divider, Steps } from "antd";
import dayjs from "dayjs";
import Link from "next/link";
import numeral from "numeral";
import { useMemo } from "react";
import { FiCheck, FiPlay, FiTruck } from "react-icons/fi";
import { match } from "ts-pattern";
import { useMainContext } from "../context";

export const ReportOrder = ({ id }: { id: string }) => {
  const orderById = useGetOrderById(id);
  const mainCtx = useMainContext();
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

  if (!orderById.data) return <div>Đang tải</div>;

  return (
    <div className="flex flex-col mb-10 gap-3 ">
      <div className="flex justify-between items-center flex-wrap">
        <div className="font-bold text-lg ">
          {match(orderById.data?.status)
            .with(0, () => "ĐƠN HÀNG ĐANG ĐƯỢC ĐÓNG GÓI")
            .with(1, () => "ĐƠN ĐANG VẬN CHUYỂN")
            .with(2, () => "ĐƠN ĐÃ GIAO THÀNH CÔNG")
            .with(3, () => "ĐƠN ĐÃ HUỶ")
            .otherwise(() => "")}
        </div>
      </div>

      <div className="flex gap-4 p-4 items-center border border-solid border-pink-300 bg-pink-50 rounded-lg">
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
      <div className=" grid md:grid-cols-2 grid-cols-1 gap-2">
        <Card size="small" title={"Người chia sẻ"}>
          <div className="flex justify-between">
            <div className="flex flex-col">
              <div className="flex gap-2">
                Người dùng:{" "}
                <span className="font-bold">
                  {orderById.data?.userSharerVM.userName}
                </span>
              </div>
              <div className="flex gap-2">
                Email:{" "}
                <span className="font-bold">
                  {orderById.data?.userSharerVM.userGmail}
                </span>
              </div>
              <div className="flex gap-2">
                Điểm uy tín:{" "}
                <span className="font-bold">
                  {orderById.data?.userSharerVM.reputation}
                </span>
              </div>
              <div className="flex gap-2">
                Ngày khởi tạo:{" "}
                <span className="font-bold">
                  {dayjs(orderById.data?.userSharerVM.userDateCreate).format(
                    "DD-MM-YYYY HH:mm"
                  )}
                </span>
              </div>
              <Link
                className="flex"
                href={`/user/${orderById.data?.userSharerVM.userId}`}
                legacyBehavior>
                <a target="_blank">Xem chi tiết</a>
              </Link>
            </div>
            <Avatar src={orderById.data?.userSharerVM.userImage}>A</Avatar>
          </div>
        </Card>
        <Card size="small" title={"Người nhận"}>
          <div className="flex justify-between">
            <div className="flex flex-col">
              <div className="flex gap-2">
                Người dùng:{" "}
                <span className="font-bold">
                  {orderById.data?.userRecieverVM.userName}
                </span>
              </div>
              <div className="flex gap-2">
                Email:{" "}
                <span className="font-bold">
                  {orderById.data?.userRecieverVM.userGmail}
                </span>
              </div>
              <div className="flex gap-2">
                Điểm uy tín:{" "}
                <span className="font-bold">
                  {orderById.data?.userRecieverVM.reputation}
                </span>
              </div>
              <div className="flex gap-2">
                Ngày khởi tạo:{" "}
                <span className="font-bold">
                  {dayjs(orderById.data?.userRecieverVM.userDateCreate).format(
                    "DD-MM-YYYY HH:mm"
                  )}
                </span>
              </div>
              <Link
                className="flex"
                href={`/user/${orderById.data?.userRecieverVM.userId}`}
                legacyBehavior>
                <a target="_blank">Xem chi tiết</a>
              </Link>
            </div>
            <Avatar src={orderById.data?.userRecieverVM.userImage}>A</Avatar>
          </div>
        </Card>
      </div>
      <Card size="small" title={"Thông tin đơn hàng"}>
        <div className="flex flex-col gap-6">
          {[orderById.data?.itemVM].map((orderItem, index) => (
            <div className="flex justify-between" key={`order-detail-${index}`}>
              <div className="flex gap-4 ">
                <img
                  src={orderItem?.image ? JSON.parse(orderItem?.image)[0] : ""}
                  width={70}
                  height={70}
                  style={{ objectFit: "cover" }}
                />
                <div className="flex flex-col">
                  <div className="pr-10">{orderItem?.itemTitle}</div>
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
              <span>
                &#8363;{" "}
                {numeral(
                  orderById.data?.price * orderById.data?.quantity
                ).format("0,0")}
              </span>
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
                orderById.data?.userSharerVM.userName}
            </span>
            <span className="text-primary">
              <PhoneOutlined />{" "}
              {(orderById.data?.address &&
                JSON.parse(orderById.data?.address)?.phone) ||
                orderById.data?.userSharerVM.userPhone}
            </span>
            {orderById.data?.address && (
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
            )}
          </div>
        </Card>
      </div>
      <Card bordered>
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
      {/* <Timeline
        className="ml-3 mt-3"
        mode="left"
        pending={match(orderById.data?.status)
          .with(0, () => "ĐƠN HÀNG ĐANG ĐƯỢC ĐÓNG GÓI")
          .with(1, () => "ĐƠN ĐANG VẬN CHUYỂN")
          .otherwise(() => "")}
        items={
          orderTimelines?.map(
            (item) =>
              ({
                children: (
                  <div className="flex flex-col">
                    <div>{item.label}</div>
                    <div className="text-gray-400">
                      {dayjs(item.date).format("DD-MM-YYYY HH:mm")}
                    </div>
                  </div>
                ),
              } as TimelineProps)
          ) as TimelineProps[]
        }
      /> */}
    </div>
  );
};
