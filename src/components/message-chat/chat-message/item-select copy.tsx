import { useMainContext } from "@/components/context";
import { useItemsByUserId } from "@/hooks/product";
import { Button, Image, Popover, Tabs } from "antd";
import Link from "next/link";
import numeral from "numeral";
import { ReactNode, useState } from "react";

type Props = {
  userId;
  onSelectItem: (id: string) => void;
  children: ReactNode;
};
export const StickerSelectedPopOver = ({
  userId,
  onSelectItem,
  children,
}: Props) => {
  const [targetUser, setTargetUser] = useState("you");
  const mainCtx = useMainContext();
  const itemById = useItemsByUserId(
    targetUser === "me" ? mainCtx.user.userId : userId,
    true
  );
  const [clicked, setClicked] = useState(false);
  return (
    <Popover
      placement="top"
      style={{ width: 500 }}
      content={
        <div className="flex flex-col w-[300px] gap-1">
          <Tabs
            defaultActiveKey="you"
            onChange={setTargetUser}
            size="small"
            items={[
              { key: "you", label: "Shop" },
              { key: "me", label: "Bạn" },
            ]}></Tabs>
          <div className="overflow-auto h-[250px] flex flex-col gap-2">
            {itemById.data?.map((item) => (
              <div className="flex w-full gap-2 border-solid border-gray-100 rounded-md p-1">
                <div className="w-[40px] h-[40px]">
                  <Image
                    preview={false}
                    src={JSON.parse(item.image)[0]}
                    width={40}
                    height={40}
                    className="rounded-md"
                  />
                </div>
                <div className="flex flex-col w-full gap-1">
                  <Link
                    href={`/product/${item.itemId}`}
                    legacyBehavior
                    className="">
                    <a target="_blank" className="line-clamp-1 ">
                      {item.itemTitle}
                    </a>
                  </Link>
                  <div className="flex justify-between">
                    <div>
                      {item.itemSalePrice !== 0 ? (
                        <span>
                          &#8363; {numeral(item.itemSalePrice).format("0,0")}
                        </span>
                      ) : (
                        "Miễn phí"
                      )}
                    </div>
                    <Button
                      size="small"
                      type="primary"
                      onClick={() => {
                        onSelectItem(item.itemId);
                        setClicked(false);
                      }}>
                      Gửi
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      }
      trigger="click"
      open={clicked}
      onOpenChange={setClicked}>
      {children}
    </Popover>
  );
};
