import checkCompleted from "@/sticker/check-completed.json";
import delivered from "@/sticker/delivered-2.json";
import delivery from "@/sticker/delivery-3.json";
import packaging from "@/sticker/packaging.json";
import waiting from "@/sticker/waiting.json";
import { Player } from "@lottiefiles/react-lottie-player";
import classcat from "classcat";
import { match } from "ts-pattern";

export const StatusSticker = ({
  status,
  width,
}: {
  status: number;
  width?: string | number;
}) => {
  return (
    <Player
      className={classcat([`w-[${width || "50px"}]`])}
      src={match(status)
        .with(-1, () => waiting)
        .with(0, () => packaging)
        .with(1, () => delivery)
        .with(2, () => delivered)
        .with(3, () => checkCompleted)
        .otherwise(() => waiting)}
      loop
      autoplay
    />
  );
};
