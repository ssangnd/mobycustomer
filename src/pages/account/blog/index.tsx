import { useMainContext } from "@/components/context";
import { useBlogsByUserId } from "@/hooks/blog";
import { DeleteOutlined } from "@ant-design/icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, Modal, notification, Spin, Table, Tag, Tooltip } from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import { FiEdit3, FiPlus, FiTrash } from "react-icons/fi";
import { blogService } from "services/axios/blog";
import { match } from "ts-pattern";

const BlogPage = () => {
  const mainContext = useMainContext();
  const queryClient = useQueryClient();
  const [{ pageNumber, pageSize }, setPagination] = useState({
    pageNumber: 1,
    pageSize: 10,
  });

  const blogByUserId = useBlogsByUserId(pageNumber, pageSize);
  const columns: ColumnsType<any> = [
    {
      title: "Tiêu đề",
      dataIndex: "blogTitle",
      key: "blogTitle",
      render: (text, record) => (
        <Link href={`/account/blog/${record.blogId}`}>{text}</Link>
      ),
    },
    {
      title: "Danh mục",
      dataIndex: "blogCategoryId",
      key: "blogCategoryId",
      render: (text) => (
        <span>
          {mainContext.blogCategory.find((item) => item.value === text)?.label}
        </span>
      ),
    },
    {
      title: "Mô tả",
      dataIndex: "blogDescription",
      key: "blogDescription",
    },
    {
      title: "Trạng thái",
      dataIndex: "blogStatus",
      key: "blogStatus",
      render: (value) => (
        <span>
          {match(value)
            .with(0, () => <Tag color="volcano">Đang duyệt</Tag>)
            .with(1, () => <Tag color="green">Đã duyệt</Tag>)
            .otherwise(() => (
              <Tag color="">Không duyệt</Tag>
            ))}
        </span>
      ),
    },
    {
      title: "Ngày khởi tạo",
      dataIndex: "blogDateCreate",
      key: "blogDateCreate",
      render: (text) => <span>{dayjs(text).format("DD-MM-YYYY HH:mm")}</span>,
    },
    {
      title: "Ngày cập nhật",
      dataIndex: "blogDateUpdate",
      key: "blogDateUpdate",
      render: (text) => (
        <span>{text ? dayjs(text).format("DD-MM-YYYY HH:mm") : ""}</span>
      ),
    },
    {
      title: "Tác vụ",
      dataIndex: "blogId",
      key: "blogId",
      align: "center",
      render: (text, record) => (
        <span className="flex justify-center">
          <Tooltip title="Chỉnh sửa">
            <Link href={`/account/blog/${text}`}>
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
    (value) => blogService.deleteBlog(value),
    {
      onSuccess: async (data) => {
        notification.success({
          message: "Xoá blog thành công",
        });
        queryClient.invalidateQueries({ queryKey: ["/items-by-user-id"] });
        blogByUserId.refetch();
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
      content: "Việc xoá blog không thể hoàn tác vụ.",
      icon: <DeleteOutlined />,
      okText: "Xoá",
      cancelText: "Không",
      okButtonProps: { className: "bg-red-500" },
      onOk: () => {
        deleteItemMutation.mutate(item.blogId);
      },
    });
  };
  return (
    <>
      <Head>
        <title>Blog của tôi</title>
      </Head>
      <div className="flex flex-col mb-10 gap-4">
        <div className="flex justify-between">
          <div className="font-bold text-lg uppercase">Blog CHIA SẺ</div>

          <Link href="/account/blog/add">
            <Button type="primary">
              <div className="flex flex-row items-center gap-1 ">
                <FiPlus />
                Thêm mới
              </div>
            </Button>
          </Link>
        </div>
        <Spin spinning={blogByUserId.isFetching} tip="Đang tải...">
          <Table
            columns={columns}
            dataSource={
              blogByUserId?.data?.listModel.filter(
                (item) => item.blogStatus !== 3
              ) || []
            }
            pagination={{
              current: pageNumber,
              total: blogByUserId?.data?.totalRecord,
              pageSize,
              showSizeChanger: true,
              onChange: (pageNumber, pageSize) =>
                setPagination({ pageNumber, pageSize }),
            }}
          />
        </Spin>
      </div>
    </>
  );
};

export default BlogPage;
