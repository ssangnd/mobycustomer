import MobyLogo from "@/images/moby-landscape-logo.png";
import {
  AuditOutlined,
  PoweroffOutlined,
  UserOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import { getHotkeyHandler, useTimeout, useViewportSize } from "@mantine/hooks";
import { useQueryClient } from "@tanstack/react-query";
import { Avatar, Badge, Button, Cascader, Input, Popover } from "antd";
import { signOut } from "firebase/auth";
import Image from "next/image";
import Link from "next/link";
import { useRouter, withRouter } from "next/router";
import { Fragment, useState } from "react";
import { FiMap, FiSearch, FiShoppingCart } from "react-icons/fi";
import { auth } from "services/firebase";
import { useMainContext } from "../context";

import { MainDrawer } from "./main-drawer";
const MainHeader = () => {
  const mainContext = useMainContext();
  const queryClient = useQueryClient();
  const { start, clear } = useTimeout(() => window.location.replace("/"), 1000);
  const router = useRouter();
  const { width } = useViewportSize();
  const [open, setOpen] = useState(false);
  const logout = async () => {
    await signOut(auth).then(async () => {
      await localStorage.removeItem("userToken");
      window.location.replace("/");
    });
  };
  const [searchValue, setSearchValue] = useState(undefined);
  const [searchCategory, setSearchCategory] = useState(undefined);
  const pushToSeach = () => {
    router.push({
      pathname: "/product/filter",
      query: {
        category: searchCategory ? [...searchCategory, "TEMP"] : undefined,
        titleName: searchValue || undefined,
      },
    });
    console.log(searchValue, searchCategory);
  };
  return (
    <Fragment>
      <div className="drop-shadow-md bg-white grid place-items-center">
        <div className="xl:w-[1280px] lg:w-[1024px] w-full flex justify-between items-center p-4 ">
          <div className="flex flex-row items-center">
            <MainDrawer />
            <Link href="/">
              <Image
                src={MobyLogo}
                alt="Moby"
                width={width > 768 ? 150 : 100}
                className="w-50"></Image>
            </Link>
          </div>
          <div className="hidden md:flex w-full pl-6 items-center justify-center">
            <Input.Group compact className="w-full" size="large">
              <Cascader
                placeholder="Tất cả danh mục"
                style={{ width: 170 }}
                options={mainContext.category}
                expandTrigger="hover"
                onChange={setSearchCategory}
                changeOnSelect></Cascader>
              <Input
                style={{ width: "calc(100% - 170px)" }}
                defaultValue=""
                onChange={(e) => setSearchValue(e.target.value)}
                suffix={<FiSearch onClick={pushToSeach} />}
                onKeyDown={getHotkeyHandler([["Enter", () => pushToSeach()]])}
              />
            </Input.Group>
          </div>
          <div className="hidden sm:flex text-2xl text-primary  flex-row items-center gap-4">
            <div className=" w-32 flex flex-col justify-end items-end gap-0">
              <div className="text-base font-bold text-black">1800 1234</div>
              <div className="text-xs text-gray-400">Hỗ trợ 24/7</div>
            </div>
            {!mainContext.user ? (
              <Link href="/authenticate/signin">
                <Button type="primary">Đăng nhập / Đăng ký</Button>
              </Link>
            ) : (
              <>
                <Link href="/my-order/cart">
                  <Button
                    type="text"
                    icon={
                      <Badge
                        size="small"
                        count={
                          mainContext.cart?.data?.cartDetailList.length || 0
                        }>
                        <FiShoppingCart className="text-2xl text-primary" />
                      </Badge>
                    }
                  />
                </Link>
                <Popover
                  arrow={false}
                  content={
                    <div className="flex flex-col gap-2">
                      <Link
                        href="/account"
                        className="text-sm no-underline text-gray-700 hover:text-primary">
                        <UserOutlined /> Tài khoản của tôi
                      </Link>
                      <Link
                        href="/account/order"
                        className="text-sm no-underline text-gray-700 hover:text-primary">
                        <AuditOutlined /> Đơn hàng của tôi
                      </Link>
                      <Link
                        href="/account/address"
                        className="flex items-center gap-1 text-sm no-underline text-gray-700 hover:text-primary">
                        <FiMap /> Sổ địa chỉ
                      </Link>
                      <Link
                        href="/account/report"
                        className="flex items-center gap-1 text-sm no-underline text-gray-700 hover:text-primary">
                        <WarningOutlined /> Báo cáo
                      </Link>
                      <div
                        onClick={() => logout()}
                        className="cursor-pointer text-sm no-underline text-red-500 hover:text-primary">
                        <PoweroffOutlined /> Đăng xuất
                      </div>
                    </div>
                  }
                  title={`Xin chào, ${mainContext.user?.userName}`}
                  trigger="click"
                  open={open}
                  placement="bottomRight"
                  onOpenChange={setOpen}>
                  <div className="cursor-pointer duration-200 p-1 border-white hover:border-pink-100 hover:bg-pink-100  border-solid rounded-lg flex gap-2 items-center">
                    <Avatar src={mainContext.user?.userImage}>A</Avatar>
                    <div className="whitespace-nowrap text-sm text-gray-600">
                      {mainContext.user?.userName}
                    </div>
                  </div>
                </Popover>
              </>
            )}
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default withRouter(MainHeader);
