import { ORDER_STATUSES } from "@/components/constants/order";
import { OrderList } from "@/components/orderation/order-list";
import { RequestList } from "@/components/orderation/request-list";
import { Segmented, Tabs } from "antd";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { match } from "ts-pattern";

const OrderPage = () => {
  const router = useRouter();
  const [itemType, setItemType] = useState<"sharer" | "receiver">();
  const [status, setStatus] = useState<number>(-1);
  console.log(itemType, status);
  // useEffect(() => {
  //   router.push({
  //     pathname: "",
  //     query: {
  //       itemType,
  //       status,
  //     },
  //   });
  // }, [itemType, status]);

  const pushRouter = (itemType: "sharer" | "receiver", status: number) => {
    router.push({
      pathname: "",
      query: {
        itemType,
        status,
      },
    });
  };

  useEffect(() => {
    setItemType((router.query.itemType as "sharer" | "receiver") || "sharer");
    setStatus(
      router.query.status !== ""
        ? Number.parseInt(router.query.status as string)
        : 0
    );
  }, [router.query]);
  return (
    <>
      <Head>
        <title>Quản lý đơn hàng </title>
      </Head>
      <div className="flex flex-col mb-10 gap-3 ">
        <div className="flex justify-between">
          <div className="font-bold text-lg ">QUẢN LÝ ĐƠN HÀNG</div>
        </div>
        <Tabs
          activeKey={itemType}
          items={[
            { key: "sharer", label: "Chia sẻ" },
            { key: "receiver", label: "Hỗ trợ" },
          ]}
          onChange={(value) =>
            pushRouter(value as "sharer" | "receiver", status)
          }
        />
        <Segmented
          className="self-start"
          value={status}
          onChange={(value) => pushRouter(itemType, value as number)}
          options={ORDER_STATUSES.map((item) => ({
            label: (
              <div className={`flex items-center gap-2 ${item.color}`}>
                {item.icon}
                {item.label}
              </div>
            ),
            value: item.value,
          }))}
        />
        {match(status)
          .with(-1, () => <RequestList type={itemType} />)
          .otherwise(() => (
            <OrderList type={itemType} orderStatus={status} />
          ))}
      </div>
    </>
  );
};

export default OrderPage;
