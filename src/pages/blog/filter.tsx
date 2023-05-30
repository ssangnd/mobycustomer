import { useMainContext } from "@/components/context";
import { BlogItem } from "@/components/items/blog-item";
import { useBlogsForSearch } from "@/hooks/blog";
import { SearchOutlined } from "@ant-design/icons";
import { Button, Form, Input, Pagination, Skeleton } from "antd";
import classcat from "classcat";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FiMenu } from "react-icons/fi";

const BlogFilterPage = () => {
  const [form] = Form.useForm();
  const mainContext = useMainContext();

  const [cateId, setCateId] = useState(undefined);
  const router = useRouter();
  const [filter, setFilter] = useState("");

  const [{ pageNumber, pageSize }, setPagination] = useState({
    pageNumber: 1,
    pageSize: 10,
  });
  const blogsForSearch = useBlogsForSearch({
    PageNumber: pageNumber,
    PageSize: pageSize,
    CategoryId: cateId,
    Tittle: filter,
    OrderBy: true,
  });

  useEffect(() => {
    setFilter(router.query.title as string);

    if (router.query) {
      if (router.query.title) {
        console.log(router.query.title);
        form.setFieldsValue({ Title: router.query.title });
        setFilter(router.query.title as string);
      }
      if (router.query.cateId) {
        setCateId(router.query.cateId);
      }
    }
    form.submit();
  }, [router.query]);
  console.log(filter);
  return (
    <>
      <Head>
        <title>Moby | Nền tảng chia sẻ dành cho mẹ và bé</title>
      </Head>
      <div className="grid place-items-center mb-10">
        <div className="xl:w-[1280px] lg:w-[1024px] w-full px-4 flex flex-col gap-5 mt-5 ">
          <Form
            form={form}
            name="basic"
            layout="vertical"
            onFinish={(value) => {
              console.log(value);
              setFilter(value.Title);
            }}>
            <div className="grid lg:grid-cols-7 grid-cols-3 gap-3">
              <div className="flex flex-col col-span-2 gap-2">
                <div className="font-bold text-xl uppercase flex items-center gap-3 text-primary">
                  <FiMenu />
                  BLOG
                </div>
                <div className="bg-gray-50 rounded-md p-3">
                  {mainContext.blogCategory.map((item) => (
                    <div
                      className={classcat([
                        "flex items-center gap-2 hover:text-primary transition-all cursor-pointer",
                        {
                          "text-primary":
                            Number.parseInt(cateId) === item.value,
                        },
                      ])}
                      onClick={() => {
                        setCateId(item.value);
                      }}>
                      {item.label}
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex flex-col col-span-5 gap-2 w-full">
                <div className="flex flex-wrap gap-x-4">
                  <div className="w-[300px]">
                    <Form.Item name="Title">
                      <Input
                        placeholder="Từ khoá tìm kiếm"
                        suffix={<SearchOutlined />}
                      />
                    </Form.Item>
                  </div>
                  <Button
                    type="text"
                    className="bg-gray-100 text-primary"
                    onClick={() => {
                      form.resetFields();
                      setCateId(undefined);
                      form.submit();
                    }}>
                    Đặt lại bộ lọc
                  </Button>
                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={blogsForSearch.isLoading}
                      icon={<SearchOutlined />}>
                      Tìm kiếm
                    </Button>
                  </Form.Item>
                </div>
                <div className="flex flex-col">
                  <div className="grid md:grid-cols-3 grid-cols-2 gap-3 items-stretch">
                    {blogsForSearch.data?.listModel?.map((item) => (
                      <BlogItem item={item} />
                    ))}
                    {blogsForSearch.isFetching ? <Skeleton /> : null}
                    {!blogsForSearch.isFetching &&
                    !blogsForSearch.data?.listModel?.length ? (
                      <>Trống</>
                    ) : (
                      ""
                    )}
                  </div>

                  {blogsForSearch.data?.totalRecord ? (
                    <div className="flex justify-end mt-2">
                      <Pagination
                        current={pageNumber}
                        pageSize={pageSize}
                        total={blogsForSearch.data?.totalRecord || 0}
                        onChange={(pageNumber, pageSize) =>
                          setPagination({ pageNumber, pageSize })
                        }
                      />
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </Form>
        </div>
      </div>
    </>
  );
};

export default BlogFilterPage;
