import { WarningOutlined } from "@ant-design/icons";
import { useViewportSize } from "@mantine/hooks";
import { Avatar, Button, Card, Divider } from "antd";
import classcat from "classcat";
import Link from "next/link";
import { withRouter } from "next/router";
import { Fragment, useState } from "react";
import { FaBabyCarriage } from "react-icons/fa";
import { FiArchive, FiBookOpen, FiMap, FiPackage } from "react-icons/fi";
import { useMainContext } from "../context";
const MainAccountLayout = ({ router, children }) => {
  const { width } = useViewportSize();
  const [open, setOpen] = useState(false);
  const mainContext = useMainContext();
  return (
    <Fragment>
      <div className="grid place-items-center border-solid border-t-pink-100 border-l-transparent border-r-transparent border-b-transparent h-full pt-5">
        <div className="xl:w-[1280px] lg:w-[1024px] w-full items-start  px-4 grid lg:grid-cols-7 grid-cols-1 gap-2 ">
          <Card className="w-full col-span-2">
            <div className="flex flex-row gap-2">
              <Avatar size="large" src={mainContext.user?.userImage || ""}>
                A
              </Avatar>
              <div className="flex flex-col ">
                <div className="font-bold"> {mainContext.user?.userName}</div>
                <Link href={"/account"}>Sửa hồ sơ</Link>
              </div>
            </div>
            <Divider />
            <div className="flex lg:flex-col flex-row flex-wrap">
              <Link href="/account/address">
                <Button type="text">
                  <div
                    className={classcat([
                      "flex flex-row items-center gap-2",
                      {
                        "text-primary":
                          router.pathname.includes("/account/address"),
                      },
                    ])}>
                    <FiMap />
                    Sổ địa chỉ
                  </div>
                </Button>
              </Link>
              <Link href="/account/baby">
                <Button type="text">
                  <div
                    className={classcat([
                      "flex flex-row items-center gap-2",
                      {
                        "text-primary":
                          router.pathname.includes("/account/baby"),
                      },
                    ])}>
                    <FaBabyCarriage />
                    Em bé nhà tôi
                  </div>
                </Button>
              </Link>
              <Link href="/account/product">
                <Button type="text">
                  <div
                    className={classcat([
                      "flex flex-row items-center gap-2",
                      {
                        "text-primary":
                          router.pathname.includes("/account/product"),
                      },
                    ])}>
                    <FiArchive />
                    Sản phẩm của tôi
                  </div>
                </Button>
              </Link>
              <Link href="/account/blog">
                <Button type="text">
                  <div
                    className={classcat([
                      "flex flex-row items-center gap-2",
                      {
                        "text-primary":
                          router.pathname.includes("/account/blog"),
                      },
                    ])}>
                    <FiBookOpen />
                    Blog của tôi
                  </div>
                </Button>
              </Link>
              <Link href="/account/order">
                <Button type="text">
                  <div
                    className={classcat([
                      "flex flex-row items-center gap-2",
                      {
                        "text-primary":
                          router.pathname.includes("/account/order"),
                      },
                    ])}>
                    <FiPackage />
                    Quản lý đơn hàng
                  </div>
                </Button>
              </Link>
              <Link href="/account/report">
                <Button type="text">
                  <div
                    className={classcat([
                      "flex flex-row items-center gap-2",
                      {
                        "text-primary":
                          router.pathname.includes("/account/report"),
                      },
                    ])}>
                    <WarningOutlined />
                    Báo cáo của tôi
                  </div>
                </Button>
              </Link>
            </div>
          </Card>
          <div className="col-span-5">{children}</div>
        </div>
      </div>
    </Fragment>
  );
};

export default withRouter(MainAccountLayout);
