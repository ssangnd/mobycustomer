import { Card } from "antd";

export const ItemSkeleton = ({ size }: { size?: number }) => {
  let arr = [];
  {
    for (let i = 0; i < size; i++) {
      arr.push("a");
    }
  }

  return (
    <>
      {arr.map((item, index) => (
        <Card bordered key={`skeleton-item-${index}`}>
          <div className="flex flex-col gap-2 animate-pulse">
            <div className="w-full h-[150px] bg-gray-300 rounded-lg"></div>
            <div className="w-full h-[15px] bg-gray-300 rounded-md"></div>
            <div className="w-3/4 h-[15px] bg-gray-300 rounded-md"></div>
            <div className="w-2/4 h-[25px] bg-gray-300 rounded-md"></div>
            <div className="w-1/4 h-[15px] bg-gray-300 rounded-md"></div>
          </div>
        </Card>
      ))}
    </>
  );
};
