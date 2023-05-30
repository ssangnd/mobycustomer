import BlueBackground from "@/images/bg-blue.png";
import { Card, Tag } from "antd";
import dayjs from "dayjs";
import Link from "next/link";
import { FiClock } from "react-icons/fi";
import { useMainContext } from "../context";

export const BlogItem = ({ item }: { item?: any }) => {
  const mainCtx = useMainContext();

  return (
    <Card className="w-full" size="small" hoverable>
      <Link href={`/blog/${item.blogId}`} className="no-underline w-full">
        <div className="flex flex-col items-start gap-2">
          <img
            src={item.image || BlueBackground.src}
            alt="News"
            style={{
              width: "100%",
              height: 150,
              objectFit: "cover",
              borderRadius: 20,
            }}
          />
          <div className="font-bold text-lg text-black">
            {item.blogTitle}{" "}
            <Tag color="magenta" className="font-normal ml-1">
              {
                mainCtx.blogCategory.find(
                  (item) => item.value === item?.blogCategoryId
                )?.label
              }
              {item?.blogCategory?.blogCategoryName}
            </Tag>
          </div>
          <div className="text-gray-400  flex items-center gap-1">
            <FiClock />
            {dayjs(item.blogDateCreate).format("DD-MM-YYYY HH:mm")}
          </div>

          <span className="text-black line-clamp-2 min-h-[40px]">
            {item.blogDescription}
          </span>
        </div>
      </Link>
    </Card>
  );
};
