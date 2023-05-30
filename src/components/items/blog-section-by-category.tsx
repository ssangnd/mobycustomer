import { useBlog } from "@/hooks/blog";
import BlueBackground from "@/images/bg-blue.png";
import { Button, Card, Tag } from "antd";
import dayjs from "dayjs";
import Link from "next/link";
import { FiChevronRight, FiClock, FiSun } from "react-icons/fi";

export const BlogSectionByCategory = ({
  id,
  label,
}: {
  id: string;
  label: string;
}) => {
  const getBlogsByCategoryId = useBlog(id, "categoryId", 1, 8);
  if (
    getBlogsByCategoryId.isFetching ||
    !getBlogsByCategoryId.data ||
    getBlogsByCategoryId.data?.listModel.length == 0
  )
    return;
  return (
    <>
      <div className="flex justify-between">
        <div className="font-bold text-2xl uppercase flex items-center gap-3 text-primary">
          <FiSun />
          {label}
        </div>
        <Link href={{ pathname: "/blog/filter", query: { cateId: id } }}>
          <Button type="link">
            <div className="flex items-center">
              Xem thêm <FiChevronRight />
            </div>
          </Button>
        </Link>
      </div>
      <div className="grid md:grid-cols-3 grid-cols-1 items-stretch gap-3 content-center place-content-center">
        {getBlogsByCategoryId.data?.listModel.map((item) => (
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
                    {label}
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
        ))}
      </div>
    </>
  );
};
