import { Button, Card } from "antd";
import Link from "next/link";
import numeral from "numeral";
import { MdAddShoppingCart } from "react-icons/md";

export const MobyItem = ({ item }: { item?: any }) => {
  return (
    <Card hoverable bordered size="small">
      <Link
        href={`/product/${item.itemId}`}
        className=" group no-underline text-black hover:text-black">
        <div className="flex flex-col gap-2">
          <div className="overflow-hidden  rounded-lg">
            <img
              src={JSON.parse(item?.image)[0]}
              alt={item.itemTitle}
              width="100%"
              height={150}
              className="w-50 object-cover group-hover:scale-110 transition-transform"></img>
          </div>
          <span className=" line-clamp-2 min-h-[40px] ">{item.itemTitle}</span>
          <div className="flex justify-between ">
            <div className="flex flex-col">
              <div className="font-bold text-xl text-primary">
                {item.itemSalePrice !== 0 ? (
                  <span>
                    &#8363; {numeral(item.itemSalePrice).format("0,0")}
                  </span>
                ) : (
                  "Miễn phí"
                )}
              </div>
              <div>
                <span className="font-bold">{item.userName}</span>
              </div>
            </div>
            <div>
              <Button
                type="primary"
                shape="circle"
                icon={<MdAddShoppingCart className="" />}
                size={"large"}
              />
            </div>
          </div>
        </div>
      </Link>
    </Card>
  );
};
