import { useMainContext } from "@/components/context";
import { useReportListByUser } from "@/hooks/report";
import { DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, Modal, Spin, Table, Tag, Tooltip, notification } from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import { FiTrash } from "react-icons/fi";
import { reportService } from "services/axios/report";
import { P, match } from "ts-pattern";

const ReportPage = () => {
  const mainContext = useMainContext();
  const queryClient = useQueryClient();
  const [{ pageNumber, pageSize }, setPagination] = useState({
    pageNumber: 1,
    pageSize: 10,
  });

  const reportByUserId = useReportListByUser({ pageNumber, pageSize });
  const columns: ColumnsType<any> = [
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
      render: (text, record) => (
        <Link
          href={{
            pathname: `/account/report/${record.reportId}`,
            query: {
              ...match(record)
                .with({ itemId: P.number }, () => ({
                  type: 0,
                }))
                .with({ orderId: P.number }, () => ({
                  type: 1,
                }))
                .with({ commentId: P.number }, () => ({
                  type: 2,
                }))
                .with({ replyId: P.number }, () => ({
                  type: 3,
                }))
                .with({ blogId: P.number }, () => ({
                  type: 4,
                }))
                .otherwise(() => {}),
            },
          }}>
          {text}
        </Link>
      ),
    },

    {
      title: "Trạng thái",
      dataIndex: "reportStatus",
      key: "reportStatus",
      render: (value) => (
        <span>
          {match(value)
            .with(0, () => <Tag color="volcano">Đang chờ</Tag>)
            .with(1, () => <Tag color="green">Đã chấp nhận</Tag>)
            .otherwise(() => (
              <Tag color="">Không duyệt</Tag>
            ))}
        </span>
      ),
    },
    {
      title: "Ngày khởi tạo",
      dataIndex: "reportDateCreate",
      key: "reportDateCreate",
      render: (text) => <span>{dayjs(text).format("DD-MM-YYYY HH:mm")}</span>,
    },
    {
      title: "Ngày giải quyết",
      dataIndex: "reportDateResolve",
      key: "reportDateResolve",
      render: (text) => (
        <span>
          {text ? (
            dayjs(text).format("DD-MM-YYYY HH:mm")
          ) : (
            <span className="text-gray-400">Đang chờ...</span>
          )}
        </span>
      ),
    },

    {
      title: "Tác vụ",
      dataIndex: "reportId",
      key: "reportId",
      align: "center",
      render: (text, record) => (
        <span className="flex justify-center">
          <Tooltip title="Xem">
            <Link
              href={{
                pathname: `/account/report/${record.reportId}`,
                query: {
                  ...match(record)
                    .with({ itemId: P.number }, () => ({
                      type: 0,
                    }))
                    .with({ orderId: P.number }, () => ({
                      type: 1,
                    }))
                    .with({ commentId: P.number }, () => ({
                      type: 2,
                    }))
                    .with({ replyId: P.number }, () => ({
                      type: 3,
                    }))
                    .with({ blogId: P.number }, () => ({
                      type: 4,
                    }))
                    .otherwise(() => {}),
                },
              }}>
              <Button type="link" icon={<EyeOutlined />}></Button>
            </Link>
          </Tooltip>
          {record.reportStatus == 0 && (
            <Tooltip title="Xoá">
              <Button
                onClick={() => confirmToDelete(record)}
                danger
                type="text"
                icon={<FiTrash />}></Button>
            </Tooltip>
          )}
        </span>
      ),
    },
  ];

  const deleteReportMutation = useMutation(
    (value: any) => reportService.deleteReport(value),
    {
      onSuccess: async (data) => {
        notification.success({
          message: "Xoá báo cáo thành công",
        });
        reportByUserId.refetch();
      },
    }
  );

  const confirmToDelete = (item) => {
    Modal.confirm({
      title: (
        <span>
          Bạn có muốn xoá báo cáo "
          <span className="font-bold">{item.title}</span>" ?
        </span>
      ),
      content: "Việc xoá báo cáo không thể hoàn tác vụ.",
      icon: <DeleteOutlined />,
      okText: "Xoá",
      cancelText: "Không",
      okButtonProps: { className: "bg-red-500" },
      onOk: () => {
        deleteReportMutation.mutate(item.reportId);
      },
    });
  };
  return (
    <>
      <Head>
        <title>Báo cáo của tôi</title>
      </Head>
      <div className="flex flex-col mb-10 gap-4">
        <div className="flex justify-between">
          <div className="font-bold text-lg uppercase">Báo cáo của tôi</div>
        </div>
        <Spin spinning={reportByUserId.isFetching} tip="Đang tải...">
          <Table
            columns={columns}
            dataSource={reportByUserId.data?.list}
            pagination={{
              current: pageNumber,
              total: reportByUserId.data?.total,
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

export default ReportPage;
