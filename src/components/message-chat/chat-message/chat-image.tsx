import { useMainContext } from "@/components/context";
import { Image } from "antd";
import classcat from "classcat";
import { useMemo } from "react";

type Props = {
  data: any;
};

export const ChatImage = ({ data }: Props) => {
  const mainCtx = useMainContext();
  const youAreMe = useMemo(() => {
    return data?.userId === mainCtx.user?.userId;
  }, [data]);
  return (
    <div
      className={classcat([
        "flex",
        {
          "flex-row-reverse": youAreMe,
        },
      ])}>
      <Image width={120} src={data.value} className="rounded-md" />
    </div>
  );
};
