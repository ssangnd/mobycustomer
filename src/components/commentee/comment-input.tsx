import * as RadixPopover from "@/components/element/popover";
import EmojiPicker from "@/components/emoji-picker/picker";
import { CloseOutlined, SendOutlined, SmileOutlined } from "@ant-design/icons";
import { getHotkeyHandler, useDisclosure } from "@mantine/hooks";
import { Avatar, Button, Input } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useMainContext } from "../context";

type Props = {
  id?: string;
  type?: "comment" | "reply";
  initialValue?: string;
  isEditable?: boolean;
  isLoading?: boolean;
  onCancel?: () => void;
  onSubmit: (value: string) => void;
};

export const CommentInput = ({
  onCancel,
  isEditable,
  initialValue,
  id,
  type,
  isLoading,
  onSubmit,
}: Props) => {
  const mainCtx = useMainContext();

  const router = useRouter();

  const [trigger, handlerTrigger] = useDisclosure(false);

  const [comment, handlerComment] = useState("");

  const onSendComment = () => {
    if (comment) {
      onSubmit(comment);
    }
  };
  useEffect(() => {
    if (!isLoading) handlerComment("");
  }, [isLoading]);

  useEffect(() => {
    handlerComment(initialValue);
  }, [initialValue]);
  if (!mainCtx.user)
    return (
      <div className="bg-slate-100 rounded-md py-3 text-center">
        Vui lòng{" "}
        <Link
          href={{
            pathname: "/authenticate/signin",
            query: { url: router.asPath },
          }}
          className="no-underline ">
          đăng nhập
        </Link>{" "}
        để được bình luận
      </div>
    );

  return (
    <div className="flex my-3 gap-2 w-full self-baseline">
      <div className="w-[50px] h-[50px]">
        <Avatar src={mainCtx.user.userImage}>A</Avatar>
      </div>
      <div className="flex gap-2 w-full  flex-col items-start">
        <Input.TextArea
          value={comment}
          onChange={(e) => handlerComment(e.target.value)}
          className="w-full"
          rows={1}
          autoSize
          placeholder={`Hãy để ${
            type === "comment" ? "bình luận" : "phản hồi"
          } tại đây`}
          onKeyDown={getHotkeyHandler([["Enter", () => onSubmit(comment)]])}
        />
        <div className="flex gap-2">
          <RadixPopover.Popover
            open={trigger}
            onOpenChange={() => handlerTrigger.toggle()}>
            <RadixPopover.PopoverTrigger asChild>
              <Button type="default" icon={<SmileOutlined />}></Button>
            </RadixPopover.PopoverTrigger>
            <RadixPopover.PopoverContent collisionPadding={16} className="z-10">
              <EmojiPicker
                onEmojiSelect={(emoji) => {
                  handlerComment((value) => value + emoji.native);
                  console.log(emoji.native);
                  handlerTrigger.close();
                }}
              />
            </RadixPopover.PopoverContent>
          </RadixPopover.Popover>
          {isEditable ? (
            <Button
              type="default"
              icon={<CloseOutlined />}
              onClick={onCancel}></Button>
          ) : null}
          <Button
            type="primary"
            disabled={isLoading}
            icon={<SendOutlined />}
            onClick={onSendComment}></Button>
        </div>
      </div>
    </div>
  );
};
