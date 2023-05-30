import { onValue, orderByChild, query, ref } from "firebase/database";
import { useEffect, useState } from "react";
import { database } from "services/firebase";
import { useMainContext } from "../context";
import { ChatMemberItem } from "./chat-member-item";

type Props = {
  onSelectMember: (roomId, userId) => void;
  selectedMember: { roomId; userId };
};
export const ChatMemberList = ({ selectedMember, onSelectMember }: Props) => {
  const [memberList, setMemberList] = useState([]);
  const mainCtx = useMainContext();

  useEffect(() => {
    const memberListRef = query(
      ref(database, "user/" + mainCtx.user.userId + "/room"),
      orderByChild("updateDate")
    );
    onValue(memberListRef, (snapshot) => {
      let members = [];
      snapshot.forEach((item) => {
        const { userId } = item.val();
        members.push({ id: item.key, userId });
      });
      setMemberList(members);
    });
  }, []);
  console.log(selectedMember);
  return (
    <div className="">
      {/* <div className="z-50 sticky p-3 top-0 bg-white">
        <Input
          suffix={<SearchOutlined />}
          size="small"
          placeholder="Tìm kiếm theo tên"
        />
      </div> */}
      <div className="flex flex-col px-1 gap-1 pt-1">
        {memberList.map((item) => (
          <div
            className=""
            onClick={() => onSelectMember(item.id, item.userId)}>
            <ChatMemberItem
              roomId={item.id}
              userId={item.userId}
              isSelected={selectedMember.userId === item.userId}
            />
          </div>
        ))}
        {!memberList.length && (
          <div className="flex items-center justify-center h-full">
            Không có người dùng
          </div>
        )}
      </div>
    </div>
  );
};
