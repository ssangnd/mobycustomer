import { useGetOrder } from "@/hooks/order";
import { Avatar, Button, Card, Pagination, Spin } from "antd";
import dayjs from "dayjs";
import Link from "next/link";
import numeral from "numeral";
import { useEffect, useState } from "react";
import { match } from "ts-pattern";
import { EmptyList } from "./empty";
import { StatusSticker } from "./status-sticker";

type Props = {
  type: "receiver" | "sharer";
  orderStatus: number;
};
export const OrderList = ({
  type,

  orderStatus,
}: Props) => {
  const [{ pageNumber, pageSize }, setPagination] = useState({
    pageNumber: 1,
    pageSize: 10,
  });
  const orderList = useGetOrder({ type, pageNumber, pageSize, orderStatus });
  useEffect(() => {
    setPagination({ pageNumber: 1, pageSize: 10 });
  }, [type, orderStatus]);
  return (
    <>
      <Spin
        spinning={orderList.isFetching}
        className="min-h-[300px]"
        tip="Đang tải...">
        {orderList.data?.listModel?.map((item) => (
          <Link
            href={`/account/order/order/${item.orderId}`}
            className="no-underline"
            key={`order-${item.orderId}`}>
            <Card
              hoverable
              size="small"
              className="mb-2"
              title={
                <span className=" flex text-sm text-gray-600 ">
                  <Avatar
                    size="small"
                    className="mr-2"
                    src={match(type)
                      .with("receiver", () => item.userSharerVM?.userImage)
                      .otherwise(() => item.userRecieverVM?.userImage)}>
                    A
                  </Avatar>
                  <span className="font-bold mr-1">
                    {match(type)
                      .with("receiver", () => item.userSharerVM?.userName)
                      .otherwise(() => item.userRecieverVM?.userName)}
                  </span>
                  <span className="text-gray-300 font-normal ml-2">
                    ID:{item?.orderId}
                  </span>
                </span>
              }
              extra={
                <span className=" text-pink-400">
                  {match([type, item.status])
                    .with(["receiver", 0], () => "Đang đóng gói")
                    .with(["receiver", 1], () => (
                      <Button> Xác nhận đã nhận đơn hàng</Button>
                    ))
                    .with(["receiver", 2], () => "Đã vận chuyển")
                    .with(["receiver", 3], () => "Đã huỷ")
                    .with(["sharer", 0], () => <Button>Vận chuyển</Button>)
                    .with(
                      ["sharer", 1],
                      () => "Đang vận chuyển, chờ người mua phản hồi"
                    )
                    .with(["sharer", 2], () => "Đơn hàng thành công")
                    .with(["sharer", 3], () => "Đã huỷ")
                    .otherwise(() => "")}
                </span>
              }>
              <div className="flex flex-col gap-6">
                <div className="flex gap-4 p-4 items-center border border-solid border-pink-300 bg-pink-50 rounded-lg">
                  <div className="text-pink-400 text-2xl">
                    {item.status !== 3 ? (
                      <StatusSticker status={item.status} />
                    ) : null}
                  </div>
                  <div className="flex flex-col">
                    <div>
                      {match(item.status)
                        .with(
                          0,
                          () =>
                            `${dayjs(item.dateCreate).format(
                              "DD-MM-YYYY HH:mm"
                            )} - Người chia sẻ đang đóng gói đơn hàng`
                        )
                        .with(
                          1,
                          () =>
                            `${dayjs(item.datePackage).format(
                              "DD-MM-YYYY HH:mm"
                            )} - Người chia sẻ đã gửi đơn hàng cho đơn vị vận chuyển`
                        )
                        .with(
                          2,
                          () =>
                            `${dayjs(item.dateReceived).format(
                              "DD-MM-YYYY HH:mm"
                            )} - Đã nhận được hàng`
                        )
                        .with(3, () => (
                          <div className="flex flex-col">
                            <div>
                              {dayjs(item.dateCreate).format(
                                "DD-MM-YYYY HH:mm"
                              )}{" "}
                              - Bị huỷ đơn do người mua
                            </div>
                            <div>Lý do: {item.reasonCancel} </div>
                          </div>
                        ))
                        .otherwise(() => "")}
                    </div>

                    {item.status < 2 ? (
                      <div className="text-gray-400">
                        {item.daysLeftForReport}
                      </div>
                    ) : null}
                  </div>
                </div>
                {[item.itemVM].map((orderItem, index) => (
                  <div
                    className="flex  justify-between"
                    key={`order-detail-${index}-${item.orderId}`}>
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
                          {item.price !== 0 ? (
                            <span>
                              &#8363; {numeral(item.price).format("0,0")}
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
                        {item.price !== 0 ? (
                          <span>
                            &#8363;{" "}
                            {numeral(item.price * item.quantity).format("0,0")}
                          </span>
                        ) : (
                          "Miễn phí"
                        )}
                      </div>
                      <div className="text-gray-400">
                        SL:{" "}
                        <span className="text-gray-600">{item.quantity}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </Link>
        ))}
        {orderList.data?.totalRecord ? (
          <div className="flex justify-end mt-2">
            <Pagination
              current={pageNumber}
              pageSize={pageSize}
              total={orderList.data?.totalRecord || 0}
              onChange={(pageNumber, pageSize) =>
                setPagination({ pageNumber, pageSize })
              }
            />
          </div>
        ) : null}
      </Spin>
      {!orderList.data?.listModel?.length && !orderList.isFetching ? (
        <EmptyList />
      ) : null}
    </>
  );
};
