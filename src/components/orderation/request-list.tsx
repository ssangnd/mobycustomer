import { useGetRequest } from "@/hooks/request";
import { Avatar, Button, Card, Spin } from "antd";
import dayjs from "dayjs";
import Link from "next/link";
import numeral from "numeral";
import { match } from "ts-pattern";
import { EmptyList } from "./empty";
import { StatusSticker } from "./status-sticker";

export const RequestList = ({ type }: { type: "sharer" | "receiver" }) => {
  const requestList = useGetRequest(type);
  console.log(type);
  return (
    <>
      <Spin
        spinning={requestList.isFetching}
        className="min-h-[300px]"
        tip="Đang tải...">
        {requestList.data
          ?.filter((item) => item.status === 0)
          .map((item) => (
            <Link
              href={`/account/order/request/${item.requestId}`}
              className="no-underline"
              key={`request-${item.requestId}`}>
              <Card
                hoverable
                size="small"
                className="mb-3"
                title={
                  <span className=" flex text-sm text-gray-600 ">
                    <Avatar
                      size="small"
                      className="mr-2"
                      src={match(type)
                        .with("receiver", () => item.itemOwner?.userImage)
                        .otherwise(() => item.userVM.userImage)}>
                      A
                    </Avatar>
                    <span className="font-bold mr-1">
                      {match(type)
                        .with("receiver", () => item.itemOwner?.userName)
                        .otherwise(() => item.userVM?.userName)}
                    </span>
                    <span className="text-gray-300 font-normal ml-2">
                      ID:{item?.requestId}
                    </span>
                  </span>
                }
                extra={
                  <span className=" text-pink-400">
                    {match(type)
                      .with("receiver", () => "Đang chờ xác nhận")
                      .otherwise(() => (
                        <Button>Xác nhận đơn hàng</Button>
                      ))}
                  </span>
                }>
                <div className="flex flex-col gap-6">
                  <div className="flex gap-4 p-4 items-center border border-solid border-pink-300 bg-pink-50 rounded-lg">
                    <div className="text-pink-400 text-2xl">
                      <StatusSticker status={-1} />
                    </div>
                    <div className="flex flex-col">
                      {match(type)
                        .with("receiver", () => (
                          <div>
                            {dayjs(item.dateCreate).format("DD-MM-YYYY HH:mm")}{" "}
                            - Đang chờ xác nhận từ phía người chia sẻ, vui lòng
                            đợi nhé
                          </div>
                        ))
                        .otherwise(() => (
                          <div>
                            {dayjs(item.dateCreate).format("DD-MM-YYYY HH:mm")}{" "}
                            - Bạn cần xác nhận đơn hàng.
                            <span className="text-pink-500 font-bold">
                              {" "}
                              Click vào đây
                            </span>{" "}
                            để xác nhận
                          </div>
                        ))}

                      <div className="text-gray-400">
                        Sau thời gian trên đơn hàng sẽ bị huỷ
                      </div>
                    </div>
                  </div>
                  {item.requestDetailVM.map((requestItem) => (
                    <div
                      className="flex  justify-between"
                      key={`request-detail-${requestItem.itemId}`}>
                      <div className="flex gap-4 ">
                        <img
                          src={JSON.parse(requestItem.itemVM?.image)[0]}
                          width={70}
                          height={70}
                          style={{ objectFit: "cover" }}
                        />
                        <div className="flex flex-col">
                          <div className="pr-10">
                            {requestItem.itemVM?.itemTitle}
                          </div>
                          <div className=" text-gray-600 whitespace-nowrap">
                            {requestItem.price !== 0 ? (
                              <span>
                                &#8363;{" "}
                                {numeral(requestItem.price).format("0,0")}
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
                          {requestItem.price !== 0 ? (
                            <span>
                              &#8363;{" "}
                              {numeral(
                                requestItem.price * requestItem.quantity
                              ).format("0,0")}
                            </span>
                          ) : (
                            "Miễn phí"
                          )}
                        </div>
                        <div className="text-gray-400">
                          SL:{" "}
                          <span className="text-gray-600">
                            {requestItem.quantity}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </Link>
          ))}
      </Spin>
      {!requestList.data?.length && !requestList.isFetching ? (
        <EmptyList />
      ) : null}
    </>
  );
};
