import { useUserById } from "@/hooks/account";
import { Avatar } from "antd";
import classcat from "classcat";
import { limitToLast, onValue, query, ref } from "firebase/database";
import { useEffect, useMemo, useState } from "react";
import { database } from "services/firebase";
import { dateService } from "services/tool/date-time";
import { match } from "ts-pattern";
import { useMainContext } from "../context";

type Props = {
  roomId: string;
  userId: string;
  isSelected: boolean;
};

export const ChatMemberItem = ({ isSelected, roomId, userId }: Props) => {
  const userById = useUserById(Number.parseInt(userId));
  const [lastestMessage, setLatestMessage] = useState(undefined);
  const mainCtx = useMainContext();

  useEffect(() => {
    const chatRef = query(
      ref(database, "chat/" + roomId + "/message"),
      limitToLast(1)
    );
    onValue(chatRef, (snapshot) => {
      snapshot.forEach((item) => {
        setLatestMessage(item.val());
      });
    });
  }, []);
  const youAreMe = useMemo(() => {
    return lastestMessage?.userId === mainCtx.user?.userId;
  }, [lastestMessage]);
  return (
    <div
      className={classcat([
        " bg-gray-50 cursor-pointer rounded-lg p-1 border-solid border-gray-200 hover:bg-pink-100 transition-all",
        {
          "bg-pink-200 border-pink-200": isSelected,
        },
      ])}>
      <div className={classcat(["flex gap-0"])}>
        <div className="w-[50px] h-[50px]">
          <Avatar src={userById.data?.userImage}>A</Avatar>
        </div>
        <div className="flex flex-col gap-0 w-full">
          <div className="flex justify-between items-center">
            <div className="font-bold line-clamp-1">
              {userById.data?.userName}
            </div>
            <div className="text-xs text-gray-400 ">
              {dateService.getTimeSinceByMiliSecond(lastestMessage?.date)}
            </div>
          </div>
          <div className="line-clamp-1 text-xs">
            <span className="">{youAreMe && "Bạn: "}</span>
            {match(lastestMessage?.type)
              .with("text", () => lastestMessage.value)
              .with("image", () => <span className="italic">Hình ảnh</span>)
              .with("item", () => (
                <span className="italic">Sản phẩm đính kèm</span>
              ))
              .otherwise(() => "")}
          </div>
        </div>
      </div>
    </div>
  );
};
