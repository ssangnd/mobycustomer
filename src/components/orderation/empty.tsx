import { FiCoffee } from "react-icons/fi";

export const EmptyList = () => {
  return (
    <div className="flex flex-col items-center text-gray-300">
      <div className="text-5xl">
        <FiCoffee />
      </div>
      <div>Không có dữ liệu</div>
    </div>
  );
};
