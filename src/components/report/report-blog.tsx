import { useBlog } from "@/hooks/blog";
import { Divider, Skeleton, Tag } from "antd";
import dayjs from "dayjs";
import { FiClock } from "react-icons/fi";
import { useMainContext } from "../context";

export const ReportBlog = ({ id }: { id: string }) => {
  const itembyId = useBlog(id, "BlogId");
  const mainContext = useMainContext();
  if (itembyId.isFetching) return <Skeleton />;

  return (
    <div className="flex flex-col">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        <div className="col-span-3">
          <div className="font-bold text-2xl">
            {itembyId.data?.blogTitle}{" "}
            <Tag color="magenta" className="ml-3">
              {
                mainContext.blogCategory.find(
                  (item) => item.value === itembyId.data?.blogCategoryId
                )?.label
              }
            </Tag>
          </div>
          <div className="text-gray-500 flex items-center gap-2 mt-2">
            <FiClock />{" "}
            {dayjs(itembyId.data?.blogDateCreate).format("DD-MM-YYYY HH:mm")}
          </div>
          <div className="mt-3 whitespace-pre-wrap">
            {itembyId.data?.blogDescription}
          </div>
          <img
            src={itembyId.data?.image}
            alt="News"
            style={{
              width: "100%",
              height: 250,
              objectFit: "cover",
              borderRadius: 20,
            }}
            className="mt-5"
          />
          <Divider />

          <div
            dangerouslySetInnerHTML={{
              __html: itembyId.data?.blogContent,
            }}
          />
        </div>
      </div>
    </div>
  );
};
