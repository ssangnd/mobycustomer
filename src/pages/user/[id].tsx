import { BreadcrumbBase } from "@/components/breadcrumb";
import { useMainContext } from "@/components/context";
import { useChatContext } from "@/components/context/chat";
import { MobyItem } from "@/components/items/moby-item";
import { useUserById } from "@/hooks/account";
import { useBlogsBySpecificUserId } from "@/hooks/blog";
import { useItemsByUserId } from "@/hooks/product";
import BlueBackground from "@/images/bg-blue.png";
import AvtBG from "@/images/footer-shape-bg.webp";

import {
  FacebookOutlined,
  MessageOutlined,
  ShareAltOutlined,
  TwitterOutlined,
} from "@ant-design/icons";
import { useCounter, useListState } from "@mantine/hooks";
import { Avatar, Button, Card, Divider, Tag } from "antd";
import dayjs from "dayjs";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { FaTelegramPlane } from "react-icons/fa";
import { FiChevronDown, FiClock } from "react-icons/fi";
const UserDetailPage = () => {
  const router = useRouter();
  const id = router.query.id as string;
  const mainContext = useMainContext();

  const userById = useUserById(Number.parseInt(id));
  const itemsByUserId = useItemsByUserId(id, true);
  const chatCtx = useChatContext();
  const [pageIndex, indexHandlers] = useCounter(1, { min: 1 });
  const [blogItems, itemHandlers] = useListState([]);
  const blogByUserId = useBlogsBySpecificUserId(
    Number.parseInt(id),
    pageIndex,
    6
  );
  useEffect(() => {
    if (blogByUserId.data) {
      itemHandlers.append(...blogByUserId.data.listModel);
    }
  }, [blogByUserId.data]);

  return (
    <>
      <Head>
        <title>Nguời dùng</title>
      </Head>
      <div className="grid place-items-center mb-4">
        <div className="xl:w-[1280px] lg:w-[1024px] w-full px-4 flex flex-col gap-5 ">
          <BreadcrumbBase
            items={[{ name: "Người dùng" }, { name: userById.data?.userName }]}
          />
          <div className="grid grid-cols-6 gap-2 ">
            <Card
              hoverable
              className="col-span-2 cursor-default self-start"
              size="small"
              bodyStyle={{
                backgroundImage: `url(${AvtBG.src})`,
                backgroundSize: "cover",
              }}
              actions={[
                <MessageOutlined
                  onClick={() => {
                    chatCtx.triggerChat({ userId: id });
                  }}
                />,
                <ShareAltOutlined />,
                <FacebookOutlined />,
                <TwitterOutlined />,
                <FaTelegramPlane className="mt-1" />,
              ]}>
              <div className="flex flex-col items-center ">
                <Avatar src={userById.data?.userImage} size={80}></Avatar>
                <div className="font-bold text-xl text-primary mt-2">
                  {userById.data?.userName}
                </div>
                <div className=" text-pink-300">{userById.data?.userGmail}</div>
              </div>
            </Card>
            <div className="col-span-4 flex flex-col">
              <div className="grid md:grid-cols-3 grid-cols-2 gap-3 items-stretch">
                {itemsByUserId.data?.map((item) => (
                  <MobyItem key={`user-item-${item.itemId}`} item={item} />
                ))}
              </div>
              <Divider />
              <div className="grid md:grid-cols-3 grid-cols-1 place-items-center items-stretch gap-3 content-center place-content-center">
                {blogItems.map((item) => (
                  <Card className="w-full" size="small" hoverable>
                    <Link
                      href={`/blog/${item.blogId}`}
                      className="no-underline w-full">
                      <div className="flex flex-col items-start gap-2">
                        <img
                          src={item.image || BlueBackground.src}
                          alt="News"
                          style={{
                            width: "100%",
                            height: 150,
                            objectFit: "cover",
                            borderRadius: 20,
                          }}
                        />
                        <div className="font-bold text-lg text-black">
                          {item.blogTitle}{" "}
                          <Tag color="magenta" className="font-normal ml-1">
                            {item.blogCategory?.blogCategoryName}
                          </Tag>
                        </div>
                        <div className="text-gray-400  flex items-center gap-1">
                          <FiClock />
                          {dayjs(item.blogDateCreate).format(
                            "DD-MM-YYYY HH:mm"
                          )}
                        </div>

                        <span className="text-black line-clamp-2 min-h-[40px]">
                          {item.blogDescription}
                        </span>
                      </div>
                    </Link>
                  </Card>
                ))}
              </div>
              <Button type="link" onClick={() => indexHandlers.increment()}>
                <div className="flex justify-center items-center">
                  Xem thêm <FiChevronDown />
                </div>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserDetailPage;
