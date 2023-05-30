import { Popover } from "antd";
import { CategoryList } from "../common/category-list";
import { useMainContext } from "../context";

const CategoryPopover = ({ children }) => {
  const mainContext = useMainContext();

  return (
    <Popover
      content={<CategoryList />}
      placement="bottomLeft"
      arrow={false}
      trigger="click">
      {children}
    </Popover>
  );
};

export default CategoryPopover;
