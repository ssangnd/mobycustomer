import { useGetCommentById } from "@/hooks/comment";
import { Avatar } from "antd";
import dayjs from "dayjs";
import Link from "next/link";

export const ReportComment = ({ id }: { id?: string }) => {
  const { data } = useGetCommentById(id);
  return (
    <div className="rounded-2xl bg-gray-100 px-3 py-2 flex">
      <div className="w-[50px] h-[50px]">
        <Avatar src={data?.userVM?.userImage}>A</Avatar>
      </div>
      <div className="flex flex-col">
        <div className="">
          <Link href="" className="font-bold">
            {data?.userVM?.userName}
          </Link>{" "}
          <span className="ml-2 text-gray-400 text-xs">
            {dayjs(data?.dateUpdate || data?.dateCreate).format(
              "DD-MM-YYYY HH:mm"
            )}
          </span>
          {data?.dateUpdate ? (
            <span className="ml-1 text-xs text-pink-400 ">
              &#8226; Đã chỉnh sửa
            </span>
          ) : null}
        </div>
        <div className="whitespace-pre-wrap">{data?.commentContent}</div>
      </div>
    </div>
  );
};
