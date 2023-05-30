import * as RadixPopover from "@/components/element/popover";
import EmojiPicker from "@/components/emoji-picker/picker";
import {
  FileImageOutlined,
  SendOutlined,
  ShopOutlined,
  SmileOutlined,
} from "@ant-design/icons";
import { getHotkeyHandler, useDisclosure, useId } from "@mantine/hooks";
import { Button, Input, Tooltip, Upload } from "antd";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useState } from "react";
import { storage } from "services/firebase";
import { ItemSelectedPopOver } from "./item-select";

type Props = {
  onSubmit: (
    value: string,
    type: "text" | "image" | "item" | "sticker"
  ) => void;
  targetUserID: string;
};

export const ChatInput = ({ onSubmit, targetUserID }: Props) => {
  const [comment, handlerComment] = useState("");

  const [trigger, handlerTrigger] = useDisclosure(false);
  const handleChat = () => {
    if (comment) {
      onSubmit(comment, "text");
      handlerComment("");
    }
  };
  const handleItem = (itemId: string) => {
    onSubmit(itemId, "item");
  };
  const handleImage = async (file: File) => {
    const uid = useId("image");
    uploadBytes(ref(storage, `avt/${uid}-${file.name}`), file).then(
      (snapshot) => {
        getDownloadURL(snapshot.ref).then((downloadURL) => {
          onSubmit(downloadURL, "image");
        });
      }
    );
  };
  return (
    <>
      <Input.TextArea
        maxLength={100}
        value={comment}
        onChange={(e) => handlerComment(e.target.value)}
        style={{ height: 50, resize: "none" }}
        placeholder="Nhập nội dung tin nhắn"
        bordered={false}
        onKeyDown={getHotkeyHandler([["Enter", () => handleChat()]])}
      />

      <div className="flex justify-between mt-1">
        <div className="flex gap-2">
          <RadixPopover.Popover
            open={trigger}
            onOpenChange={() => handlerTrigger.toggle()}>
            <RadixPopover.PopoverTrigger asChild>
              <Button type="default" icon={<SmileOutlined />} />
            </RadixPopover.PopoverTrigger>
            <RadixPopover.PopoverContent collisionPadding={16} className="z-10">
              <EmojiPicker
                onEmojiSelect={(emoji) => {
                  handlerComment((value) => value + emoji.native);
                  handlerTrigger.close();
                }}
              />
            </RadixPopover.PopoverContent>
          </RadixPopover.Popover>
          <ItemSelectedPopOver userId={targetUserID} onSelectItem={handleItem}>
            <Tooltip title="Sản phẩm">
              <Button type="default" icon={<ShopOutlined />}></Button>
            </Tooltip>
          </ItemSelectedPopOver>
          <Upload
            fileList={[]}
            customRequest={({ file, onSuccess }) => {
              handleImage(file as File);
              setTimeout(() => {
                onSuccess("ok");
              }, 0);
            }}>
            <Tooltip title="Tải hình ảnh">
              <Button type="default" icon={<FileImageOutlined />}></Button>
            </Tooltip>
          </Upload>
        </div>
        <Button type="text" icon={<SendOutlined />} onClick={handleChat} />
      </div>
    </>
  );
};
