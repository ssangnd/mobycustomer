import { useMainContext } from "@/components/context";
import { StatusSticker } from "@/components/orderation/status-sticker";
import { useGetRequestById } from "@/hooks/request";
import {
  CheckOutlined,
  CloseOutlined,
  MessageOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import { useMutation } from "@tanstack/react-query";
import { Avatar, Button, Card, Checkbox, Divider, notification } from "antd";
import type { CheckboxChangeEvent } from "antd/es/checkbox";
import dayjs from "dayjs";
import Head from "next/head";
import { useRouter } from "next/router";
import numeral from "numeral";
import { useEffect, useMemo, useState } from "react";
import { requestService } from "services/axios/request";
import { match } from "ts-pattern";

const RequestDetailPage = () => {
  const router = useRouter();
  const mainCtx = useMainContext();
  const id = router.query.id as string;
  const requestById = useGetRequestById(id);
  const [selectedItem, setSelectedItem] = useState([]);
  const [indeterminate, setIndeterminate] = useState(false);
  const [checkAll, setCheckAll] = useState(true);

  const onCheckAllChange = (e: CheckboxChangeEvent) => {
    setSelectedItem(
      e.target.checked
        ? requestById.data?.requestDetailVM.map((item) => item.requestDetailId)
        : []
    );
    setIndeterminate(false);
    setCheckAll(e.target.checked);
  };

  const confirmRequestMutation = useMutation(
    () => requestService.acceptRequest(id, selectedItem),
    {
      onSuccess: async (data) => {
        notification.success({
          message: "Xác nhận đơn thành công",
          description: "Hãy quẩn bị đơn hàng nhé.",
        });
        requestById.refetch();
      },
    }
  );
  const denyRequestMutation = useMutation(
    () => requestService.denyRequest(id),
    {
      onSuccess: async (data) => {
        notification.info({
          message: "Huỷ đơn thành công",
        });
        requestById.refetch();
      },
    }
  );

  const whatYouAre = useMemo<"receiver" | "sharer" | null>(() => {
    if (mainCtx.user && requestById.data) {
      if (mainCtx.user.userId === requestById.data?.userVM.userId)
        return "receiver";
      if (mainCtx.user.userId === requestById.data?.itemOwner?.userId)
        return "sharer";
    }
    return null;
  }, [mainCtx.user, requestById.data]);

  const totalPrice = useMemo(() => {
    let value = 0;
    if (requestById.data) {
      requestById.data.requestDetailVM.forEach((item) => {
        if (item.status !== 2) {
          value += item.price * item.quantity;
        }
      });
    }
    return value;
  }, [requestById.data]);

  useEffect(() => {
    if (requestById.data) {
      setSelectedItem(
        requestById.data?.requestDetailVM.map((item) => item.requestDetailId)
      );
    }
  }, [requestById.data]);
  if (requestById.isFetching && !requestById.data) return <div>Đang tải</div>;
  if (requestById.isFetched && !whatYouAre)
    return <div>Đây không phải đơn hàng của bạn</div>;
  if (!requestById.data) return <></>;

  return (
    <>
      <Head>
        <title>Đơn hàng chi tiết</title>
      </Head>
      <div className="flex flex-col mb-10 gap-3 ">
        <div className="flex justify-between flex-wrap">
          <div className="font-bold text-lg ">
            {" "}
            {match(requestById.data?.status)
              .with(0, () => "ĐƠN CHƯA XÁC NHẬN")
              .with(2, () => "ĐƠN ĐÃ HUỶ")
              .otherwise(() => "")}
          </div>
          <div className="flex flex-row gap-2">
            {match([whatYouAre, requestById.data?.status])
              .with(["receiver", 0], () => <></>)
              .with(["sharer", 0], () => (
                <>
                  <Button
                    className="bg-gray-100 text-gray-500"
                    type="text"
                    icon={<CloseOutlined />}
                    loading={denyRequestMutation.isLoading}
                    onClick={() => denyRequestMutation.mutate()}>
                    Không chấp nhận
                  </Button>
                  {!!selectedItem.length && (
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={confirmRequestMutation.isLoading}
                      icon={<CheckOutlined />}
                      onClick={() => confirmRequestMutation.mutate()}>
                      Chấp nhận (
                      {selectedItem.length <
                      requestById.data?.requestDetailVM.length
                        ? selectedItem.length
                        : "Tất cả"}
                      )
                    </Button>
                  )}
                </>
              ))
              .otherwise(() => "")}
          </div>
        </div>
        {requestById.data?.status === 0 ? (
          <div className="flex gap-4 p-4 items-center border border-solid border-pink-300 bg-pink-50 rounded-lg">
            <div className="text-pink-400 text-2xl">
              {requestById.data?.status !== 2 ? (
                <StatusSticker
                  status={requestById.data?.status === 0 ? -1 : 3}
                />
              ) : null}
            </div>
            <div className="flex flex-col text-sm">
              {match(whatYouAre)
                .with("receiver", () => (
                  <div>
                    {dayjs(requestById.data?.dateCreate).format(
                      "DD-MM-YYYY HH:mm"
                    )}{" "}
                    - Đang chờ xác nhận từ phía người chia sẻ, vui lòng đợi nhé
                  </div>
                ))
                .otherwise(() => (
                  <div>
                    {dayjs(requestById.data?.dateCreate).format(
                      "DD-MM-YYYY HH:mm"
                    )}{" "}
                    - Bạn cần xác nhận đơn hàng dưới đây.
                  </div>
                ))}
              <div className="text-gray-400">
                Sau thời gian trên đơn hàng sẽ bị huỷ
              </div>
            </div>
          </div>
        ) : null}

        <Card
          size="small"
          title={
            <>
              {whatYouAre === "sharer" && (
                <Checkbox
                  disabled={requestById.data?.status !== 0}
                  indeterminate={indeterminate}
                  onChange={onCheckAllChange}
                  checked={checkAll}>
                  Chọn tất cả
                </Checkbox>
              )}
            </>
          }
          extra={match(requestById.data?.status)
            .with(0, () => (
              <span className=" text-pink-400">Đang chờ xác nhận</span>
            ))
            .with(1, () => <span className=" text-green-400">Đã xác nhận</span>)
            .with(2, () => <span className=" text-red-400">Đã huỷ</span>)
            .otherwise(() => "")}>
          <Checkbox.Group
            disabled={requestById.data?.status !== 0}
            className="flex flex-col gap-6"
            value={selectedItem}
            onChange={(value) => {
              setSelectedItem(value);
              setIndeterminate(
                !!value.length &&
                  value.length < requestById.data?.requestDetailVM.length
              );
              setCheckAll(
                value.length === requestById.data?.requestDetailVM.length
              );
            }}>
            {requestById.data?.requestDetailVM
              ?.filter((item) => item.status !== 2)
              .map((requestItem) => (
                <div
                  className="flex  justify-between"
                  key={`request-detail-${requestItem.itemId}`}>
                  <div className="flex gap-4 ">
                    {whatYouAre === "sharer" && (
                      <Checkbox
                        value={requestItem.requestDetailId}
                        className="self-center"
                      />
                    )}
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
                            &#8363; {numeral(requestItem.price).format("0,0")}
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
          </Checkbox.Group>
          <Divider className="my-2" />
          <div className="flex items-center justify-between">
            <div className="uppercase font-bold ">Tổng cộng</div>
            <div className="font-bold text-xl">
              <span>&#8363; {numeral(totalPrice).format("0,0")}</span>
            </div>
          </div>
        </Card>
        <div className="grid lg:grid-cols-2 grid-cols-1 gap-2">
          <Card size="small" className="col-span-2">
            <div className="flex justify-between  items-center">
              <span className=" flex text-sm text-gray-600 ">
                <Avatar
                  size="small"
                  className="mr-2"
                  src={match(whatYouAre)
                    .with(
                      "receiver",
                      () => requestById.data?.itemOwner?.userImage
                    )
                    .otherwise(
                      () => requestById.data?.userVM?.userImage
                    )}></Avatar>
                <span className="font-bold mr-1">
                  {match(whatYouAre)
                    .with(
                      "receiver",
                      () => requestById.data?.itemOwner?.userName
                    )
                    .otherwise(() => requestById.data?.userVM?.userName)}
                </span>
              </span>
              <Button icon={<MessageOutlined />}>Chat</Button>
            </div>
          </Card>
          <Card size="small" title="Ghi chú" className="col-span-1">
            <div className="flex flex-col">
              {requestById.data?.note || "Không có ghi chú"}
            </div>
          </Card>
          <Card size="small" title="Địa chỉ nhận hàng" className="col-span-1">
            <div className="flex flex-col">
              <span className="font-bold">
                {" "}
                {(requestById.data?.address &&
                  JSON.parse(requestById.data?.address)?.name) ||
                  requestById.data.userVM?.userName}
              </span>
              <span className="text-primary">
                <PhoneOutlined />{" "}
                {(requestById.data?.address &&
                  JSON.parse(requestById.data?.address)?.phone) ||
                  requestById.data.userVM?.userPhone}
              </span>
              <div className="text-gray-400">
                <div className="text-gray-400">
                  {JSON.parse(requestById.data?.address).addressDetail}
                  {", "}
                  {
                    mainCtx.vnAddress.wards.find(
                      (i) =>
                        i.value ===
                        JSON.parse(requestById.data?.address).addressWard
                    )?.label
                  }
                  {", "}
                  {
                    mainCtx.vnAddress.districts.find(
                      (i) =>
                        i.value ===
                        JSON.parse(requestById.data?.address).addressDistrict
                    )?.label
                  }
                  {", "}
                  {
                    mainCtx.vnAddress.provinces.find(
                      (i) =>
                        i.value ===
                        JSON.parse(requestById.data?.address).addressProvince
                    )?.label
                  }
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
};

export default RequestDetailPage;
