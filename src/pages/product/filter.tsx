import { Banner } from "@/components/common/banner";
import { useMainContext } from "@/components/context";
import { MobyItem } from "@/components/items/moby-item";
import { ItemSkeleton } from "@/components/loading/item-skeleton";
import { useCreateRecord, useItemDynamicFilter } from "@/hooks/product";
import { SearchOutlined } from "@ant-design/icons";
import { useWindowScroll } from "@mantine/hooks";
import {
  Button,
  Collapse,
  Divider,
  Form,
  Input,
  InputNumber,
  Pagination,
} from "antd";
import classcat from "classcat";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FiMenu } from "react-icons/fi";
import { match } from "ts-pattern";
const ProductFilterPage = ({}) => {
  const [form] = Form.useForm();

  const mainContext = useMainContext();
  const router = useRouter();
  const defaultValue = {
    categoryID: null,
    titleName: null,
    location: null,
    minPrice: 0,
    maxPrice: 0,
    maxUsable: 0,
    minUsable: 0,
    share: null,
  };

  const [scroll, scrollTo] = useWindowScroll();

  const [filter, setFilter] = useState(defaultValue);
  const [{ pageNumber, pageSize }, setPagination] = useState({
    pageNumber: 1,
    pageSize: 10,
  });
  const [{ id: cateId, type }, setCategory] = useState<{
    id: number;
    type: "category" | "subcategory";
  }>({ id: undefined, type: undefined });

  const itemsByFilter = useItemDynamicFilter({
    ...filter,
    [type === "category" ? "categoryID" : "subCategoryID"]: cateId || undefined,
    pageNumber,
    pageSize,
  });
  const createRecord = useCreateRecord({
    userId: mainContext.user?.userId,
    [type === "category" ? "categoryId" : "subCategoryId"]: cateId,
  });
  useEffect(() => {
    scrollTo({ y: 350 });
  }, [cateId]);
  useEffect(() => {
    if (router.query) {
      if (router.query.titleName) {
        form.setFieldsValue({ titleName: router.query.titleName });
      }
      if (router.query.category) {
        match(router.query.category.length)
          .with(3, () =>
            setCategory({
              id: Number.parseInt(router.query.category[1]),
              type: "subcategory",
            })
          )
          .with(2, () =>
            setCategory({
              id: Number.parseInt(router.query.category[0]),
              type: "category",
            })
          )
          .otherwise(() =>
            setCategory({
              id: undefined,
              type: undefined,
            })
          );
      }

      form.submit();
    }
  }, [router.query]);
  return (
    <>
      <Head>
        <title>Moby | Nền tảng chia sẻ dành cho mẹ và bé</title>
      </Head>
      <div className="grid place-items-center mb-10">
        <div className="xl:w-[1280px] lg:w-[1024px] w-full px-4 flex flex-col gap-5 mt-5 ">
          <Banner />
          <Form
            form={form}
            name="basic"
            layout="vertical"
            onFinish={(value) => {
              setFilter(value);
              // saveAddressMutation.mutate(value);
            }}>
            <div className="grid lg:grid-cols-7 grid-cols-3 gap-3">
              <div className="flex flex-col col-span-2 gap-2">
                <div className="font-bold text-xl uppercase flex items-center gap-3 text-primary">
                  <FiMenu />
                  Danh mục
                </div>
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
                            {
                              "text-primary":
                                cateId === item.value && type === "category",
                            },
                          ])}
                          onClick={() => {
                            setCategory({ id: item.value, type: "category" });
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
                              setCategory({
                                id: subitem.value,
                                type: "subcategory",
                              });
                            }}
                            className={classcat([
                              "ml-7 hover:text-primary transition-all cursor-pointer",
                              {
                                "text-primary":
                                  cateId === subitem.value &&
                                  type === "subcategory",
                              },
                            ])}
                            key={`sub-cate-${subitem.value}`}>
                            {subitem.label}
                          </div>
                        ))}
                      </div>
                    </Collapse.Panel>
                  ))}
                </Collapse>
              </div>
              <div className="flex flex-col col-span-5 gap-2 w-full">
                <div className="flex flex-wrap gap-x-4">
                  <div className="w-[300px]">
                    <Form.Item name="titleName">
                      <Input
                        placeholder="Từ khoá tìm kiếm"
                        suffix={<SearchOutlined />}
                      />
                    </Form.Item>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="text-gray-400 mt-1">Khoảng giá</div>
                    <Form.Item name="minPrice">
                      <InputNumber
                        placeholder="Từ "
                        style={{ width: 120 }}
                        prefix={`₫`}
                      />
                    </Form.Item>
                    <Form.Item name="maxPrice">
                      <InputNumber
                        placeholder="Đến "
                        style={{ width: 120 }}
                        prefix={`₫`}
                      />
                    </Form.Item>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="text-gray-400 mt-1">Tình trạng</div>
                    <Form.Item name="minUsable">
                      <InputNumber
                        placeholder="Từ "
                        min={40}
                        max={100}
                        style={{ width: 100 }}
                        addonAfter={`%`}
                      />
                    </Form.Item>
                    <Form.Item name="maxUsable">
                      <InputNumber
                        placeholder="Đến "
                        min={0}
                        max={100}
                        style={{ width: 100 }}
                        addonAfter={`%`}
                      />
                    </Form.Item>
                  </div>
                  <Button
                    type="text"
                    className="bg-gray-100 text-primary"
                    onClick={() => {
                      form.resetFields();
                      setCategory({ id: undefined, type: undefined });
                      form.submit();
                    }}>
                    Đặt lại bộ lọc
                  </Button>
                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={itemsByFilter.isLoading}
                      icon={<SearchOutlined />}>
                      Tìm kiếm
                    </Button>
                  </Form.Item>
                </div>

                <div className="flex flex-col">
                  <div className="grid md:grid-cols-3 grid-cols-2 gap-3 items-stretch">
                    {itemsByFilter.data?.list?.map((item) => (
                      <MobyItem item={item} />
                    ))}
                    {itemsByFilter.isFetching ? (
                      <ItemSkeleton size={4} />
                    ) : null}
                    {!itemsByFilter.isFetching &&
                    !itemsByFilter.data.list.length ? (
                      <>Trống</>
                    ) : (
                      ""
                    )}
                  </div>

                  {itemsByFilter.data?.total ? (
                    <div className="flex justify-end mt-2">
                      <Pagination
                        current={pageNumber}
                        pageSize={pageSize}
                        total={itemsByFilter.data?.total || 0}
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
          <Divider />
        </div>
      </div>
    </>
  );
};

export default ProductFilterPage;
