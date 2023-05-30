import { EllipsisOutlined } from "@ant-design/icons";
import { useDisclosure } from "@mantine/hooks";
import { Avatar, Button, Popover } from "antd";
import classcat from "classcat";
import dayjs from "dayjs";
import Link from "next/link";
import { useEffect } from "react";
import { match } from "ts-pattern";
import { useMainContext } from "../context";
import { ReportSection } from "../report";
import { CommentInput } from "./comment-input";
import { ReplyItem } from "./reply";

type Props = {
  onSubmit: ({ id, content }) => void;
  onEditSubmit: ({
    id,
    content,
    type,
  }: {
    type: "reply" | "comment";
    id: string;
    content: string;
  }) => void;
  onDelete: ({ type, id }: { type: "reply" | "comment"; id: string }) => void;
  data: any;
  isLoading?: boolean;
};

export const CommentItem = ({
  data,
  onSubmit,
  onEditSubmit,
  isLoading,
  onDelete,
}: Props) => {
  const [toggleComment, handlerToggle] = useDisclosure(false);
  const [toggleEdit, handlerEdit] = useDisclosure(false);
  const mainCtx = useMainContext();

  useEffect(() => {
    if (!isLoading) {
      handlerEdit.close();
    }
  }, [isLoading]);
  return (
    <div className="flex my-3 gap-2  ">
      <div className="w-[50px] h-[50px]">
        <Avatar src={data.userVM?.userImage}>A</Avatar>
      </div>
      <div className="flex flex-col w-full">
        <div className="flex items-center gap-2 group">
          <div
            className={classcat([
              "rounded-2xl bg-gray-100 px-5 py-2 self-baseline",
              {
                "w-full": toggleEdit,
              },
            ])}>
            <div>
              <Link href="" className="font-bold">
                {data?.userVM?.userName}
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
                <div className="whitespace-pre-wrap">
                  {data?.commentContent}
                </div>
              ))
              .otherwise(() => (
                <CommentInput
                  isEditable
                  initialValue={data?.commentContent}
                  type="comment"
                  isLoading={isLoading}
                  onCancel={handlerEdit.close}
                  onSubmit={(value) =>
                    onEditSubmit({
                      id: data.commentId,
                      content: value,
                      type: "comment",
                    })
                  }
                />
              ))}
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
                    onClick={() =>
                      onDelete({ type: "comment", id: data.commentId })
                    }>
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
                  <ReportSection id={data.commentId} category="comment">
                    <Button type="text">Báo cáo</Button>
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

        {mainCtx.user &&
          match(toggleComment)
            .with(false, () => (
              <div
                onClick={handlerToggle.toggle}
                className="ml-2 text-sm mt-1 text-primary hover:text-pink-300 transition-all cursor-pointer">
                Phản hồi
              </div>
            ))
            .otherwise(() => (
              <CommentInput
                type="reply"
                isLoading={isLoading}
                onSubmit={(value) =>
                  onSubmit({ id: data.commentId, content: value })
                }
              />
            ))}

        {data.listReply?.map((item) => (
          <ReplyItem
            key={`reply-${item.replyId}`}
            data={item}
            onEditSubmit={({ id, content }) =>
              onEditSubmit({
                id,
                content,
                type: "reply",
              })
            }
            isLoading={isLoading}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
};
