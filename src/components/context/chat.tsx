import { createContext, useContext, useState } from "react";
import { useMainContext } from ".";
import { MessageChat } from "../message-chat";

export const ChatContext = createContext({
  triggerChat: undefined,
});

export const ChatProvider = ({ children }) => {
  const [{ userId }, setTriggerChat] = useState({ userId: "" });
  const mainCtx = useMainContext();

  const triggerChat = ({ userId }: { userId?: string }) => {
    setTriggerChat({ userId });
  };
  return (
    <ChatContext.Provider value={{ triggerChat: triggerChat }}>
      {children}
      {mainCtx.user && <MessageChat triggerChat={{ userId }} />}
    </ChatContext.Provider>
  );
};
export const useChatContext = () => useContext(ChatContext);
