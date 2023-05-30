import { ReportBlog } from "@/components/report/report-blog";
import { ReportComment } from "@/components/report/report-comment";
import { ReportItem } from "@/components/report/report-item";
import { ReportOrder } from "@/components/report/report-order";
import { ReportReply } from "@/components/report/report-reply";
import { useReportByID } from "@/hooks/report";
import { DeleteOutlined } from "@ant-design/icons";
import { useMutation } from "@tanstack/react-query";
import { Avatar, Button, Card, Image, Modal, Tag, notification } from "antd";
import Head from "next/head";
import { useRouter } from "next/router";
import { useMemo } from "react";
import { reportService } from "services/axios/report";
import { match } from "ts-pattern";

const ReportDetailPage = () => {
  const router = useRouter();
  const { id, type } = router.query;
  const reportById = useReportByID({
    report: Number.parseInt(id as string),
    type: Number.parseInt(type as string),
  });
  const reportType = useMemo(
    () =>
      match(Number.parseInt(type as string))
        .with(0, () => ({
          type: "item",
          label: "Sản phẩm",
          bool: "isItem",
          id: "itemId",
        }))
        .with(4, () => ({
          type: "blog",
          label: "Blog",
          bool: "isBlog",
          id: "blogId",
        }))
        .with(1, () => ({
          type: "order",
          label: "Đơn hàng",
          bool: "isOrder",
          id: "orderId",
        }))
        .with(2, () => ({
          type: "comment",
          label: "Bình luận",
          bool: "isComment",
          id: "commentId",
        }))
        .with(3, () => ({
          type: "reply",
          label: "Phản hồi",
          bool: "isReply",
          id: "replyId",
        }))

        .otherwise(() => ({
          type: "",
          label: "",
          bool: "",
          id: "",
        })),
    [type]
  );

  const deleteReportMutation = useMutation(
    (value: any) => reportService.deleteReport(value),
    {
      onSuccess: async (data) => {
        notification.success({
          message: "Xoá báo cáo thành công",
        });
        reportById.refetch();
      },
    }
  );
  const confirmToDelete = () => {
    Modal.confirm({
      title: (
        <span>
          Bạn có muốn xoá báo cáo "
          <span className="font-bold">{reportById.data?.title}</span>" ?
        </span>
      ),
      content: "Việc xoá báo cáo không thể hoàn tác vụ.",
      icon: <DeleteOutlined />,
      okText: "Xoá",
      cancelText: "Không",
      okButtonProps: { className: "bg-red-500" },
      onOk: () => {
        deleteReportMutation.mutate(id);
      },
    });
  };
  return (
    <>
      <Head>
        <title>Chi tiết báo cáo</title>
      </Head>
      <div className="flex justify-between">
        <div className="font-bold text-lg ">CHI TIẾT BÁO CÁO</div>
        <div className="flex gap-3 items-center">
          {match(reportById.data?.reportStatus)
            .with(0, () => <Tag color="volcano">Đang chờ</Tag>)
            .with(1, () => <Tag color="green">Đã chấp nhận</Tag>)
            .otherwise(() => (
              <Tag color="">Không duyệt</Tag>
            ))}
          <Button onClick={() => router.back()}>Trở về</Button>
          {reportById.data?.reportStatus == 0 && (
            <Button onClick={() => confirmToDelete()} danger type="text">
              Xoá báo cáo
            </Button>
          )}
        </div>
      </div>
      <Card className="mt-3" size="small" title="Nội dung phản ánh">
        <div className="flex flex-col">
          <div>
            Tiêu đề:{" "}
            <span className="font-bold"> {reportById.data?.title}</span>
          </div>
          <div>
            Nội dung:{" "}
            <span className="font-bold whitespace-pre-wrap">
              {" "}
              {reportById.data?.reportContent}
            </span>
          </div>
          <div>Hình ảnh đính kèm (nếu có)</div>
          <div className="flex gap-3">
            {reportById.data?.evident &&
              JSON.parse(reportById.data?.evident).map((item) => (
                <Image src={item} key={item} style={{ width: 100 }} />
              ))}
          </div>
        </div>
      </Card>
      <Card size="small" className="mt-2" title="Người bị phản ánh">
        <div className="flex justify-between">
          <div className="flex flex-col">
            <div className="flex gap-2">
              Người dùng:{" "}
              <span className="font-bold">
                {reportById.data?.userNameReport ||
                  reportById.data?.nameUreport}
              </span>
            </div>
            <div className="flex gap-2">
              Email:{" "}
              <span className="font-bold">
                {reportById.data?.userGmailReport ||
                  reportById.data?.gmailUreport}
              </span>
            </div>
          </div>
          <Avatar src={reportById.data?.userImageReport}>A</Avatar>
        </div>
      </Card>
      <Card
        className="mt-2"
        size="small"
        title={`Loại báo cáo: ${reportType.label}`}>
        {match(reportType.type)
          .with("item", () => (
            <ReportItem
              id={reportById.data && reportById.data[reportType.id]}
            />
          ))
          .with("order", () => (
            <ReportOrder
              id={reportById.data && reportById.data[reportType.id]}
            />
          ))
          .with("comment", () => (
            <ReportComment
              id={reportById.data && reportById.data[reportType.id]}
            />
          ))
          .with("reply", () => (
            <ReportReply
              id={reportById.data && reportById.data[reportType.id]}
            />
          ))
          .with("blog", () => (
            <ReportBlog
              id={reportById.data && reportById.data[reportType.id]}
            />
          ))
          .otherwise(() => "")}
      </Card>
    </>
  );
};

export default ReportDetailPage;
