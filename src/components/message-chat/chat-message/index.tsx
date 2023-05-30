import { useMainContext } from "@/components/context";
import { useUserById } from "@/hooks/account";
import chatSticker from "@/sticker/chat.json";
import { MoreOutlined } from "@ant-design/icons";
import { Player } from "@lottiefiles/react-lottie-player";
import { useScrollIntoView } from "@mantine/hooks";
import { Avatar, Button } from "antd";
import {
  child,
  onChildAdded,
  onValue,
  push,
  ref,
  set,
  update,
} from "firebase/database";
import { useEffect, useRef, useState } from "react";
import { database } from "services/firebase";
import { match } from "ts-pattern";
import { ChatImage } from "./chat-image";
import { ChatInput } from "./chat-input";
import { ChatItem } from "./chat-item";
import { ChatText } from "./chat-text";
import { ChatWaiting } from "./chat-waiting";

type Props = {
  userId?: string;
  roomId?: string;
  onNewRoom?: (room: string) => void;
};
export const ChatMessage = ({ userId, roomId, onNewRoom }: Props) => {
  const mainCtx = useMainContext();
  const [roomInfor, setRoomInfor] = useState(undefined);
  const [messages, setMessage] = useState([]);
  const userById = useUserById(Number.parseInt(userId));
  const { scrollIntoView, targetRef, scrollableRef } =
    useScrollIntoView<HTMLDivElement>({
      offset: 60,
      duration: 100,
    });

  const scrollRef = useRef<HTMLDivElement>();
  useEffect(() => {
    if (roomId) {
      let initial = true;
      const roomRef = ref(database, "chat/" + roomId);
      const messageRef = ref(database, "chat/" + roomId + "/message");
      onValue(roomRef, (snapshot) => {
        setRoomInfor({ updateDate: snapshot.val()?.updateDate });
      });
      onValue(messageRef, (snapshot) => {
        let messagesChat = [];
        snapshot.forEach((item) => {
          const { value, date, type, userId } = item.val();
          messagesChat.push({ id: item.key, value, date, type, userId });
        });
        setMessage(messagesChat);
        if (initial) {
          console.log("SSSAA");
          //   scrollIntoView({ alignment: "end" });
          initial = false;
        }
      });
      onChildAdded(messageRef, (data) => {
        // scrollIntoView({ alignment: "end" });
        // scrollRef.current.scrollTop = scrollRef.current.scrollHeight + 200;
      });
    }
  }, [roomId]);
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight + 200;
    }
  }, [messages, scrollRef]);

  const createRoom = async () => {
    const newKey = await push(child(ref(database), "chat")).key;
    const updateDate = new Date().getTime();
    await set(ref(database, "/chat/" + newKey), {
      updateDate: updateDate,
      createDate: updateDate,
    }).catch((err) => console.log(err));
    console.log(updateDate);
    await set(ref(database, "/user/" + userId + "/room/" + newKey), {
      userId: Number.parseInt(mainCtx.user.userId),
    }).catch((err) => console.log(err));

    await set(
      ref(database, "/user/" + mainCtx.user.userId + "/room/" + newKey),
      {
        userId: Number.parseInt(userId),
      }
    ).catch((err) => console.log(err));
    return newKey;
  };

  const sendChat = async (data) => {
    let room = roomId;
    if (!roomId) {
      room = await createRoom();
    }
    const updateDate = new Date().getTime();
    await update(ref(database), {
      ["/chat/" + room + "/updateDate"]: updateDate,
    });
    const newKey = await push(
      child(ref(database), "/chat/" + room + "/message")
    ).key;
    await set(push(ref(database, "/chat/" + room + "/message/")), {
      ...data,
      date: updateDate,
      userId: mainCtx.user.userId,
      seen: false,
    });
    if (!roomId) {
      onNewRoom(room);
    }
  };
  if (!userId) return <ChatWaiting />;

  return (
    <div className="relative flex flex-col h-full">
      <div className=" bg-white py-2 px-1 flex items-center gap-2  top-0 border-b-gray-50 border-t-transparent border-r-transparent border-l-transparent border-solid ">
        <div className="flex justify-between w-full">
          <div className="flex gap-2 items-center">
            <Avatar src={userById.data?.userImage}>A</Avatar>
            <div>{userById.data?.userName}</div>
          </div>
          <Button icon={<MoreOutlined />} type="text" shape="circle"></Button>
        </div>
      </div>
      {!roomId ? (
        <div className="flex flex-col justify-center items-center mt-1">
          <Player className="w-[170px]" src={chatSticker} loop autoplay />
          Bắt đầu với đoạn chat đầu tiên
        </div>
      ) : (
        <div
          ref={scrollRef}
          className="overflow-auto"
          style={{ height: "calc(100% - 150px)" }}>
          <div className="px-1 flex flex-col gap-2">
            {messages.map((item) =>
              match(item.type)
                .with("text", () => (
                  <ChatText key={`chat-text-${item.id}`} data={item} />
                ))
                .with("item", () => (
                  <ChatItem key={`chat-item-${item.id}`} data={item} />
                ))
                .with("image", () => (
                  <ChatImage key={`chat-image-${item.id}`} data={item} />
                ))
                .otherwise(() => <></>)
            )}
          </div>
        </div>
      )}

      <div className="absolute flex flex-col w-full p-1 bottom-0 border-t-gray-50 border-b-transparent border-r-transparent border-l-transparent border-solid ">
        <ChatInput
          onSubmit={(value, type) => {
            sendChat({ value, type });
          }}
          targetUserID={userId}
        />
      </div>
    </div>
  );
};
