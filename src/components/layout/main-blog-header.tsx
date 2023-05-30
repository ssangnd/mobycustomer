import { FormOutlined, HomeOutlined, ReadOutlined } from "@ant-design/icons";
import { useViewportSize } from "@mantine/hooks";
import { Button, Input } from "antd";
import Link from "next/link";
import { useRouter, withRouter } from "next/router";
import { Fragment, useState } from "react";
const MainBlogHeader = () => {
  const { width } = useViewportSize();
  const [open, setOpen] = useState(false);
  const router = useRouter();
  return (
    <Fragment>
      <div className="grid place-items-center">
        <div className="xl:w-[1280px] lg:w-[1024px] w-full flex flex-col md:flex-row md:justify-between justify-items-start md:items-center px-4 ">
          <div className="flex flex-wrap flex-col md:flex-row gap-1">
            <Link href="/blog">
              <Button
                type="text"
                className="uppercase text-primary"
                icon={<HomeOutlined />}>
                Trang chủ
              </Button>
            </Link>
            {/* <Link href="">
              <Button type="text">
                <div className="flex items-center gap-2 uppercase">Chủ đề</div>
              </Button>
            </Link> */}
            <Link href="/account/blog/add">
              <Button
                type="text"
                className="uppercase text-primary"
                icon={<FormOutlined />}>
                Đăng bài viết
              </Button>
            </Link>
            <Link href="/account/blog">
              <Button
                type="text"
                className="uppercase text-primary"
                icon={<ReadOutlined />}>
                Bài của tôi
              </Button>
            </Link>
          </div>
          <Input.Search
            placeholder="Tìm kiếm tin tức"
            onSearch={(item: string) => {
              router.push({
                pathname: "/blog/filter",
                query: {
                  title: item,
                },
              });
            }}
            style={{ width: 200 }}
          />
        </div>
      </div>
    </Fragment>
  );
};

export default withRouter(MainBlogHeader);
