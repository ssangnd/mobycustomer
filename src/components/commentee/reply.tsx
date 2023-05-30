import { EllipsisOutlined } from "@ant-design/icons";
import { useDisclosure } from "@mantine/hooks";
import { Avatar, Button, Popover } from "antd";
import dayjs from "dayjs";
import Link from "next/link";
import { useEffect } from "react";
import { match } from "ts-pattern";
import { useMainContext } from "../context";
import { ReportSection } from "../report";
import { CommentInput } from "./comment-input";

type Props = {
  onEditSubmit: ({ id, content }) => void;
  onDelete: ({ type, id }: { type: "reply" | "comment"; id: string }) => void;
  data: any;
  isLoading?: boolean;
};

export const ReplyItem = ({
  data,
  onEditSubmit,
  isLoading,
  onDelete,
}: Props) => {
  const mainCtx = useMainContext();
  const [toggleEdit, handlerEdit] = useDisclosure(false);
  useEffect(() => {
    if (!isLoading) {
      handlerEdit.close();
    }
  }, [isLoading]);
  return (
    <div className="group flex my-3 gap-2">
      <div className="w-[50px] h-[50px]">
        <Avatar src={data.userVM?.userImage}>A</Avatar>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex flex-col self-baseline">
          <div className="rounded-2xl bg-gray-100 px-5 py-2">
            <div>
              <Link href="" className="font-bold">
                {data?.userVM.userName}
              </Link>{" "}
              <span className="ml-2 text-gray-400 text-xs">
                {dayjs(data.dateUpdate || data.dateCreate).format(
                  "DD-MM-YYYY HH:mm"
                )}
              </span>
              {data?.dateUpdate ? (
                <span className="ml-1 text-xs text-pink-400 ">
                  &#8226; Đã chỉnh sửa
                </span>
              ) : null}
            </div>
            {match(toggleEdit)
              .with(false, () => (
                <div className="whitespace-pre-wrap">{data?.replyContent}</div>
              ))
              .otherwise(() => (
                <CommentInput
                  isEditable
                  initialValue={data?.replyContent}
                  type="reply"
                  isLoading={isLoading}
                  onCancel={handlerEdit.close}
                  onSubmit={(value) =>
                    onEditSubmit({ id: data.replyId, content: value })
                  }
                />
              ))}
          </div>
        </div>
        {mainCtx.user?.userId === data.userId ? (
          <Popover
            trigger="click"
            content={
              <div className="flex flex-col items-stretch">
                <Button type="text" onClick={handlerEdit.open}>
                  Chỉnh sửa
                </Button>
                <Button
                  type="text"
                  danger
                  onClick={() => onDelete({ type: "reply", id: data.replyId })}>
                  Xoá
                </Button>
              </div>
            }>
            <Button
              className="group-hover:visible invisible"
              shape="circle"
              icon={<EllipsisOutlined />}></Button>
          </Popover>
        ) : (
          <Popover
            trigger="click"
            content={
              <div className="flex flex-col items-stretch">
                <ReportSection id={data.replyId} category="reply">
                  <Button type="text" className="text-gray-400">
                    Báo cáo
                  </Button>
                </ReportSection>
              </div>
            }>
            <Button
              className="group-hover:visible invisible"
              shape="circle"
              icon={<EllipsisOutlined />}></Button>
          </Popover>
        )}
      </div>
    </div>
  );
};
