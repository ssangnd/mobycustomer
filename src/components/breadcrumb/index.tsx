import { HomeOutlined } from "@ant-design/icons";
import { Breadcrumb } from "antd";
import Link from "next/link";
import type { BreadcrumbInfo } from "./type";

export const BreadcrumbBase = ({ items }: { items: BreadcrumbInfo[] }) => {
  return (
    <Breadcrumb>
      <Breadcrumb.Item href="/">
        <HomeOutlined className="text-primary" />
      </Breadcrumb.Item>
      {items.map((item, index) => (
        <Breadcrumb.Item key={`breadcrumb-${index}`}>
          {item.href !== undefined ? (
            <Link
              href={item.href}
              className="flex items-center gap-2 justify-center">
              <span className="mr-1"> {item.icon}</span>
              <span>{item.name}</span>
            </Link>
          ) : (
            <>
              {item.icon}
              <span>{item.name}</span>
            </>
          )}
        </Breadcrumb.Item>
      ))}
    </Breadcrumb>
  );
};
