import MobyLogo from "@/images/moby-landscape-logo.png";
import Image from "next/image";
import Fade from "react-reveal/Fade";
export const MainLazyLoading = () => {
  return (
    <div className="absolute w-full h-full bg-pink-100 z-30 flex items-center justify-center">
      <Fade>
        <div className="animate-pulse flex flex-col items-center gap-2">
          <Image
            src={MobyLogo}
            alt="Moby"
            width={190}
            className="w-50 animate-pulse animate-bounce"></Image>
          <div className="animate-pulse">Đang tải...</div>
        </div>
      </Fade>
    </div>
  );
};
