import { Button } from "antd";
import Link from "next/link";
import {
  FiMenu,
  FiMessageSquare,
  FiRotateCw,
  FiTag,
  FiZap,
} from "react-icons/fi";
import CategoryPopover from "./category-popover";

export const MainCategory = () => {
  return (
    <div className=" bg-white grid place-items-center text-xs">
      <div className="xl:w-[1280px] lg:w-[1024px] w-full flex flex-col md:flex-row md:justify-between justify-items-start md:items-center p-4 ">
        <div className="flex flex-wrap flex-col md:flex-row gap-1">
          <CategoryPopover>
            <Button type="primary">
              <div className="flex items-center gap-3 uppercase">
                <FiMenu /> Danh mục
              </div>
            </Button>
          </CategoryPopover>
          <Link href="/wow/shared-items-free">
            <Button type="text">
              <div className="flex items-center gap-2 uppercase font-bold">
                <FiTag className="text-primary" /> Hàng miễn phí
              </div>
            </Button>
          </Link>
          <Button type="text">
            <div className="flex items-center gap-2 uppercase font-bold">
              <FiZap className="text-primary" /> Hàng giá rẻ
            </div>
          </Button>
          <Link href="/blog">
            <Button type="text">
              <div className="flex items-center gap-2 uppercase font-bold">
                <FiMessageSquare className="text-primary" /> Blog
              </div>
            </Button>
          </Link>
        </div>
        <Button type="text">
          <div className="flex items-center gap-2 font-bold">
            <FiRotateCw className="text-primary" /> Đã xem gần đây
          </div>
        </Button>
      </div>
    </div>
  );
};
