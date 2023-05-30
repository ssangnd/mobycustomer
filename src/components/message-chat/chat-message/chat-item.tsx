import { useMainContext } from "@/components/context";
import { useItem } from "@/hooks/product";
import { EyeOutlined } from "@ant-design/icons";
import { Button, Divider, Image } from "antd";
import classcat from "classcat";
import Link from "next/link";
import numeral from "numeral";
import { useMemo } from "react";

type Props = {
  data: any;
};

export const ChatItem = ({ data }: Props) => {
  const mainCtx = useMainContext();
  const youAreMe = useMemo(() => {
    return data?.userId === mainCtx.user?.userId;
  }, [data]);
  const itemById = useItem(data.value);

  return (
    <div
      className={classcat([
        "flex",
        {
          "flex-row-reverse": youAreMe,
        },
      ])}>
      <div
        className={classcat([
          "max-w-[300px] p-2 rounded-xl",
          {
            "bg-primary border-primary  text-white": youAreMe,
            "bg-gray-50 border-solid border-gray-100": !youAreMe,
          },
        ])}>
        <div className="flex flex-col">
          <div className="flex justify-between">
            <div className="font-bold">Sản phẩm</div>
            <Link
              href={`/product/${itemById.data?.itemId}`}
              legacyBehavior
              className="">
              <Button
                type="text"
                size="small"
                icon={<EyeOutlined />}
                className={classcat([
                  "line-clamp-2 ",
                  {
                    "text-white": youAreMe,
                    "text-primary": !youAreMe,
                  },
                ])}
              />
            </Link>
          </div>
          <Divider
            className={classcat([
              "my-1 ",
              { "bg-slate-50": youAreMe, "bg-gray-100": !youAreMe },
            ])}
          />
          <div className="flex w-full gap-2">
            <div className="w-[40px] h-[40px]">
              <Image
                preview={false}
                src={
                  itemById.data?.image && JSON.parse(itemById.data?.image)[0]
                }
                width={40}
                height={40}
                className="rounded-md"
              />
            </div>
            <div className="flex flex-col w-full gap-1">
              <Link
                href={`/product/${itemById.data?.itemId}`}
                legacyBehavior
                className="">
                <a
                  target="_blank"
                  className={classcat([
                    "line-clamp-2 ",
                    {
                      "text-white": youAreMe,
                      "text-primary": !youAreMe,
                    },
                  ])}>
                  {itemById.data?.itemTitle}
                </a>
              </Link>
              <div className="flex justify-between items-center">
                <div>
                  {itemById.data?.itemSalePrice !== 0 ? (
                    <span>
                      &#8363;{" "}
                      {numeral(itemById.data?.itemSalePrice).format("0,0")}
                    </span>
                  ) : (
                    "Miễn phí"
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
