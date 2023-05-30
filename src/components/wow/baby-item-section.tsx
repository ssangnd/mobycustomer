import { useItemRecommendByBaby } from "@/hooks/product";
import { Button, Divider } from "antd";
import Link from "next/link";
import { BsGenderFemale, BsGenderMale } from "react-icons/bs";
import { FiChevronRight, FiSun } from "react-icons/fi";
import { dateService } from "services/tool/date-time";
import { MobyItem } from "../items/moby-item";
import { ItemSkeleton } from "../loading/item-skeleton";
import { FaBabyCarriage } from "react-icons/fa";

export const BabyItemSection = ({ data }: { data: any }) => {
  const sharedItemByBaby = useItemRecommendByBaby(
    1,
    8,
    Number.parseInt(data.idbaby)
  );
  return (
    <>
      <Divider />
      <div className="flex justify-between">
        <div className="font-bold text-2xl uppercase flex items-center gap-3 text-primary">
          <FaBabyCarriage />
          Đồ cho bé
          <div className="ml-1 font-bold flex items-center justify-center gap-1">
            ({dateService.getTimeRelative(data.dateOfBirth)} tuổi){" "}
            {data.sex ? (
              <BsGenderMale className="text-blue-400" />
            ) : (
              <BsGenderFemale className="text-primary" />
            )}
          </div>
        </div>
        <Link
          href={{
            pathname: `/wow/baby-items`,
            query: {
              babyId: data.idbaby,
            },
          }}>
          <Button type="link">
            <div className="flex items-center">
              Xem thêm <FiChevronRight />
            </div>
          </Button>
        </Link>
      </div>

      <div className="grid md:grid-cols-4 grid-cols-2 gap-3 items-stretch">
        {sharedItemByBaby.isFetching ? <ItemSkeleton size={8} /> : null}
        {sharedItemByBaby.data?.list?.map((item) => (
          <MobyItem key={`share-item-baby-${item.itemId}`} item={item} />
        ))}
      </div>
    </>
  );
};
