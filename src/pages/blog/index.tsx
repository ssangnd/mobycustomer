import { useMainContext } from "@/components/context";
import { BlogSectionByCategory } from "@/components/items/blog-section-by-category";
import { useAllBlogRecently } from "@/hooks/blog";
import BlueBackground from "@/images/bg-blue.png";
import { FieldTimeOutlined } from "@ant-design/icons";
import { useCounter } from "@mantine/hooks";
import { Card, Skeleton, Tag } from "antd";
import dayjs from "dayjs";
import Head from "next/head";
import Link from "next/link";
import { FiClock } from "react-icons/fi";

const BlogPage = () => {
  const [count, handlers] = useCounter(0, { min: 0, max: 10 });
  const getAllBlogRecently = useAllBlogRecently(1, 10);
  const mainContext = useMainContext();
  return (
    <>
      <Head>
        <title>Tin tức</title>
      </Head>
      <div className="grid place-items-center mb-10">
        <div className="xl:w-[1280px] lg:w-[1024px] w-full px-4 flex flex-col gap-5 mt-5 ">
          <div className="font-bold text-2xl uppercase flex items-center gap-3 text-primary">
            <FieldTimeOutlined />
            Bài đăng mới nhất
          </div>
          {getAllBlogRecently.isFetching ? <Skeleton /> : null}

          <div className="grid md:grid-cols-3 grid-cols-1 place-items-center items-stretch gap-3 content-center place-content-center">
            {getAllBlogRecently.data?.listModel?.map((item, index) => {
              if (index == 0)
                return (
                  <Link
                    href={`/blog/${item.blogId}`}
                    className="no-underline col-span-3 w-full">
                    <Card size="small" hoverable>
                      <div className="grid md:grid-cols-2 grid-cols-1 md:gap-10 gap-3">
                        <img
                          src={item.image || BlueBackground.src}
                          alt="News"
                          style={{
                            width: "100%",
                            height: 250,
                            objectFit: "cover",
                            borderRadius: 20,
                          }}
                        />
                        <div className="flex flex-col items-start">
                          <div className="font-bold text-xl">
                            {item.blogTitle}
                          </div>
                          <div className="text-gray-400  flex items-center gap-1">
                            <FiClock />
                            {dayjs(item.blogDateCreate).format(
                              "DD-MM-YYYY HH:mm"
                            )}
                          </div>
                          <Tag color="magenta">
                            {item.blogCategory?.blogCategoryName}
                          </Tag>
                          <span className="mt-3 ">{item.blogDescription}</span>
                        </div>
                      </div>
                    </Card>
                  </Link>
                );
              return (
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
                        {dayjs(item.blogDateCreate).format("DD-MM-YYYY HH:mm")}
                      </div>

                      <span className="text-black line-clamp-2 min-h-[40px]">
                        {item.blogDescription}
                      </span>
                    </div>
                  </Link>
                </Card>
              );
            })}
          </div>
          {mainContext.blogCategory.map((item) => (
            <BlogSectionByCategory
              key={`blog-section-by-categogy-${item.value}`}
              label={item.label}
              id={item.value}
            />
          ))}
          {/* <div className="font-bold text-2xl uppercase flex items-center gap-3 text-primary">
            <FiSun />
            KINH NGHIỆM CHO MẸ
          </div>
          <div className="grid md:grid-cols-3 grid-cols-1 place-items-center gap-3">
            {[0, 1, 2, 3, 4].map((item) => (
              <Link href="/" className="no-underline">
                <Card className="w-full" size="small" hoverable>
                  <div className="flex flex-col gap-2">
                    <Image
                      src={BlueBackground}
                      alt="News"
                      style={{
                        width: "100%",
                        height: 150,
                        objectFit: "cover",
                        borderRadius: 20,
                      }}
                    />
                    <div className="font-bold text-lg">
                      Trầm cảm sau sinh: Nhận biết, phòng ngừa và điều trị
                    </div>
                    <div className="text-gray-400  flex items-center gap-1">
                      <FiClock />
                      18h00 12/12/2023
                    </div>
                    <div className="mt-3">
                      Lorem Ipsum is simply dummy text of the printing and
                      typesetting industry. Lorem Ipsum has been the industry's
                      standard dummy text ever since the 1500s.
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div> */}
        </div>
      </div>
    </>
  );
};

export default BlogPage;
