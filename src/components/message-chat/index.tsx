import { MessageOutlined } from "@ant-design/icons";
import { useDisclosure } from "@mantine/hooks";
import { Button } from "antd";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import { moveFromBottomVariants } from "../constants/framer";
import { ChatBubble } from "./chat-bubble";

type Props = {
  triggerChat: { userId?: string };
};
export const MessageChat = ({ triggerChat }: Props) => {
  const [displayChat, handler] = useDisclosure(false);

  useEffect(() => {
    console.log("SSSS");
    if (triggerChat?.userId) {
      handler.open();
    }
  }, [triggerChat?.userId]);
  useEffect(() => {}, []);
  return (
    <>
      <AnimatePresence exitBeforeEnter initial={false}>
        <motion.div
          className="fixed bottom-5 right-10"
          {...moveFromBottomVariants}
          key={`chatdisplay-${displayChat}`}>
          {!displayChat && (
            <div>
              <Button
                onClick={handler.toggle}
                type="primary"
                size="large"
                icon={<MessageOutlined />}>
                Chat
              </Button>
            </div>
          )}
          {displayChat && (
            <ChatBubble triggerChat={triggerChat} onClose={handler.toggle} />
          )}
        </motion.div>
      </AnimatePresence>
    </>
  );
};
