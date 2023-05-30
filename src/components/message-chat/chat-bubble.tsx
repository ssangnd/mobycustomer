import { MessageOutlined } from "@ant-design/icons";
import { useViewportSize } from "@mantine/hooks";
import { Button, Card } from "antd";
import classcat from "classcat";
import { child, get, ref } from "firebase/database";
import { useEffect, useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import { database } from "services/firebase";
import { useMainContext } from "../context";
import { useChatContext } from "../context/chat";
import { ChatMemberList } from "./chat-member-list";
import { ChatMessage } from "./chat-message";
type Props = {
  onClose: () => void;
  triggerChat: { userId?: string };
};
export const ChatBubble = ({ onClose, triggerChat }: Props) => {
  const [userId, setUserId] = useState(undefined);
  const [roomId, setRoomId] = useState(undefined);
  const { width } = useViewportSize();
  const mainCtx = useMainContext();
  const chatCtx = useChatContext();

  useEffect(() => {
    if (triggerChat?.userId) {
      setUserId(Number.parseInt(triggerChat.userId));
      get(child(ref(database), "/user/" + mainCtx.user.userId + "/room")).then(
        (snapshot) => {
          snapshot.forEach((item) => {
            console.log(item.val(), triggerChat.userId);
            if (Number.parseInt(triggerChat.userId) === item.val().userId) {
              setRoomId(item.key);
            }
          });
        }
      );
    }
  }, [triggerChat]);
  return (
    <div>
      <Card
        bordered
        bodyStyle={{ padding: 0 }}
        className={classcat([
          "",
          {
            "w-[85vw]": width < 768,
            "w-[750px]": width > 768,
          },
        ])}
        size="small"
        title={
          <div className="flex items-center gap-2 text-primary text-lg">
            <MessageOutlined />
            Chat
          </div>
        }
        extra={
          <>
            <Button
              type="text"
              className="text-gray-400"
              icon={<FiChevronDown />}
              onClick={() => {
                onClose();
                chatCtx.triggerChat({});
              }}></Button>
          </>
        }>
        <div className="grid grid-cols-3 h-[400px] gap-1 ">
          <div className="w-full overflow-auto ">
            <ChatMemberList
              selectedMember={{ roomId, userId }}
              onSelectMember={(room, user) => {
                setRoomId(room);
                setUserId(user);
              }}
            />
          </div>
          <div className="col-span-2 w-full h-[400px] border-l-gray-50 border-t-transparent border-r-transparent border-b-transparent border-solid ">
            <ChatMessage
              userId={userId}
              roomId={roomId}
              onNewRoom={setRoomId}
            />
          </div>
        </div>
      </Card>
    </div>
  );
};
