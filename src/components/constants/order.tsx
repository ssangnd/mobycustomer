import { FiCheck, FiPlay, FiTruck, FiXSquare } from "react-icons/fi";

export const ORDER_STATUSES = [
  // {
  //   label: "Chờ xác nhận",
  //   value: -1,
  //   color: "text-orange-400",
  //   icon: <FiFileText />,
  // },
  {
    label: "Đang xử lý",
    value: 0,
    color: "text-blue-400",

    icon: <FiPlay />,
  },
  {
    label: "Đang giao",
    value: 1,
    color: "text-violet-400",
    icon: <FiTruck />,
  },
  {
    label: "Đã giao",
    value: 2,
    color: "text-green-400",
    icon: <FiCheck />,
  },
  {
    label: "Đã huỷ",
    value: 3,
    color: "#ffffff",
    icon: <FiXSquare />,
  },
];
