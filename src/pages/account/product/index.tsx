import { useMainContext } from "@/components/context";
import { useItemsByUserId } from "@/hooks/product";
import { DeleteOutlined } from "@ant-design/icons";
import { useCounter } from "@mantine/hooks";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Button,
  Image,
  Modal,
  Popover,
  Spin,
  Table,
  Tabs,
  Tooltip,
  notification,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import Head from "next/head";
import Link from "next/link";
import numeral from "numeral";
import { useState } from "react";
import { FiEdit3, FiPlus, FiTrash } from "react-icons/fi";
import { productService } from "services/axios";
const ProductPage = () => {
  const mainContext = useMainContext();

  const [count, handlers] = useCounter(0, { min: 0, max: 10 });
  const [itemType, setItemType] = useState("share");
  const itemsByUserId = useItemsByUserId(
    mainContext.user?.userId,
    itemType === "share" ? true : false
  );
  const queryClient = useQueryClient();
  const columns: ColumnsType<any> = [
    {
      title: "Ảnh",
      dataIndex: "image",
      key: "image",
      width: 50,
      align: "center",
      render: (text) => (
        <Image
          src={JSON.parse(text)[0]}
          width={40}
          height={40}
          className="rounded-md"
        />
      ),
    },

    {
      title: "Tên sản phẩm",
      dataIndex: "itemTitle",
      key: "itemTitle",
      render: (text, record) => (
        <>
          {" "}
          <Link href={`/account/product/${record.itemId}`}>{text}</Link>{" "}
          {!record.itemStatus && (
            <div className="text-red-400">Đã bị ẩn bởi Quản trị viên</div>
          )}
        </>
      ),
      width: 260,
    },
    {
      title: "Phân loại",
      dataIndex: "subCategoryName",
      key: "subCategoryName",
      width: 120,
    },
    {
      title: "Giá bán",
      dataIndex: "itemSalePrice",
      key: "itemSalePrice",
      render: (text) => (
        <span className="whitespace-nowrap">
          &#8363; {numeral(text).format("0,0")}
        </span>
      ),
      width: 80,
    },
    {
      title: "Tác vụ",
      dataIndex: "itemId",
      key: "itemId",
      align: "center",
      width: 100,
      render: (text, record) => (
        <span className="flex justify-center">
          <Tooltip title="Chỉnh sửa">
            <Link href={`/account/product/${text}`}>
              <Button type="link" icon={<FiEdit3 />}></Button>
            </Link>
          </Tooltip>
          <Tooltip title="Xoá">
            <Button
              onClick={() => confirmToDelete(record)}
              danger
              type="text"
              icon={<FiTrash />}></Button>
          </Tooltip>
        </span>
      ),
    },
  ];

  const deleteItemMutation = useMutation(
    (value) => productService.deleteProduct(value, mainContext.user.userId),
    {
      onSuccess: async (data) => {
        notification.success({
          message: "Xoá sản phẩm thành công",
        });
        queryClient.invalidateQueries({ queryKey: ["/items-by-user-id"] });
        itemsByUserId.refetch();
      },
    }
  );

  const confirmToDelete = (item) => {
    Modal.confirm({
      title: (
        <span>
          Bạn có muốn xoá <span className="font-bold">{item.itemTitle}</span> ?
        </span>
      ),
      content: "Việc xoá sản phẩm không thể hoàn tác vụ.",
      icon: <DeleteOutlined />,
      okText: "Xoá",
      cancelText: "Không",
      okButtonProps: { className: "bg-red-500" },
      onOk: () => {
        deleteItemMutation.mutate(item.itemId);
      },
    });
  };
  return (
    <>
      <Head>
        <title>Sản phẩm của tôi</title>
      </Head>
      <div className="flex flex-col mb-10 gap-4">
        <div className="flex justify-between">
          <div className="font-bold text-lg ">SẢN PHẨM CHIA SẺ/HỖ TRỢ</div>

          <Popover
            trigger="click"
            arrow={false}
            placement="bottomRight"
            content={
              <div className="flex flex-col">
                <Link href="/account/product/add?type=share">
                  <Button type="text">Chia sẻ</Button>
                </Link>
                <Link href="/account/product/add?type=request">
                  <Button type="text">Hỗ trợ</Button>
                </Link>
              </div>
            }>
            <Button type="primary">
              <div className="flex flex-row items-center gap-1 ">
                <FiPlus />
                Thêm mới
              </div>
            </Button>
          </Popover>
        </div>
        <Tabs
          defaultActiveKey="share"
          items={[
            { key: "share", label: "Chia sẻ" },
            { key: "request", label: "Hỗ trợ" },
          ]}
          onChange={setItemType}
        />
        <Spin spinning={itemsByUserId.isFetching} tip="Đang tải...">
          <Table
            scroll={{ y: 240 }}
            columns={columns}
            dataSource={itemsByUserId.data || []}
            size="small"
          />
        </Spin>
      </div>
    </>
  );
};

export default ProductPage;
