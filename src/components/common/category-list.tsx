import { Collapse } from "antd";
import classcat from "classcat";
import { useRouter } from "next/router";
import { useMainContext } from "../context";

export const CategoryList = () => {
  const mainContext = useMainContext();
  const router = useRouter();
  return (
    <Collapse
      defaultActiveKey={[
        router.query?.category?.length && router.query?.category[0],
      ]}
      ghost
      size="small">
      {mainContext.category.map((item) => (
        <Collapse.Panel
          key={item.value}
          className="bg-gray-50 rounded-lg"
          header={
            <div
              className={classcat([
                "flex items-center gap-2 hover:text-primary transition-all",
              ])}
              onClick={() => {
                router.push({
                  pathname: "/product/filter",
                  query: {
                    category: [item.value, "TEMP"],
                  },
                });
              }}>
              <img
                src={item.image}
                alt={item.label}
                width={18}
                height={20}
                style={{ objectFit: "contain" }}
                className="w-50"></img>{" "}
              {item.label}
            </div>
          }>
          <div className="flex flex-col gap-2">
            {item.children?.map((subitem) => (
              <div
                onClick={() => {
                  router.push({
                    pathname: "/product/filter",
                    query: {
                      category: [item.value, subitem.value, "TEMP"],
                    },
                  });
                }}
                className={classcat([
                  "ml-7 hover:text-primary transition-all cursor-pointer",
                ])}
                key={`sub-cate-${subitem.value}`}>
                {subitem.label}
              </div>
            ))}
          </div>
        </Collapse.Panel>
      ))}
    </Collapse>
  );
};
