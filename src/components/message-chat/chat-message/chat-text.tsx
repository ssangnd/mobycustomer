import { useMainContext } from "@/components/context";
import classcat from "classcat";
import { useMemo } from "react";

type Props = {
  data: any;
};

export const ChatText = ({ data }: Props) => {
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
      <div
        className={classcat([
          "max-w-[300px] p-2 rounded-xl",
          {
            "bg-primary border-primary  text-white": youAreMe,
            "bg-gray-50 border-solid border-gray-100": !youAreMe,
          },
        ])}>
        <div className="break-words"> {data.value}</div>
      </div>
    </div>
  );
};
