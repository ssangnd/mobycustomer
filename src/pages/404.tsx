import notFound from "@/sticker/not-found.json";
import { Player } from "@lottiefiles/react-lottie-player";
import { Button } from "antd";
import Link from "next/link";

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <Player className="w-[300px]" src={notFound} loop autoplay />
      <div>
        {" "}
        Không tìm thấy trang này.
        <Link href="/">
          <Button type="link" className="px-0">
            Về trang chủ
          </Button>
        </Link>
      </div>
    </div>
  );
};
export default NotFoundPage;
