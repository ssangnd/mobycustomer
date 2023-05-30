import chatSticker from "@/sticker/chat.json";
import { Player } from "@lottiefiles/react-lottie-player";

export const ChatWaiting = () => {
  return (
    <div className="flex h-full flex-col items-center justify-center">
      <Player className="w-[170px]" src={chatSticker} loop autoplay />
      <div className="mt-[-10px]">Hãy bắt đầu đoạn chat của bạn</div>
    </div>
  );
};
