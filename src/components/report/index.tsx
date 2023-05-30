import problemSticker from "@/sticker/problem.json";
import { DeleteOutlined, EyeOutlined, InboxOutlined } from "@ant-design/icons";
import { Player } from "@lottiefiles/react-lottie-player";
import { useDisclosure, useId, useListState } from "@mantine/hooks";
import { useMutation } from "@tanstack/react-query";
import {
  Button,
  Form,
  Image,
  Input,
  Modal,
  Popover,
  Upload,
  message,
} from "antd";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import Link from "next/link";
import { useRouter } from "next/router";
import { ReactNode, useEffect } from "react";
import { reportService } from "services/axios/report";
import { storage } from "services/firebase";
import { match } from "ts-pattern";
import { useMainContext } from "../context";

type Props = {
  category: "product" | "blog" | "user" | "order" | "comment" | "reply";
  id: string;
  children: ReactNode;
  onRefetch?: () => void;
};

export const ReportSection = ({ children, category, id, onRefetch }: Props) => {
  const [modal, handler] = useDisclosure(false);
  const [form] = Form.useForm();
  const [imageList, imagehandler] = useListState([]);
  const mainCtx = useMainContext();
  const router = useRouter();
  const uploadImg = async (file: File) => {
    const uid = useId("image");
    uploadBytes(ref(storage, `items/${uid}-${file.name}`), file).then(
      (snapshot) => {
        getDownloadURL(snapshot.ref).then((downloadURL) => {
          imagehandler.append(downloadURL);
        });
      }
    );
  };
  const typeID = (category) =>
    match(category)
      .with("product", () => "itemID")
      .with("blog", () => "blogID")
      .with("user", () => "userID")
      .with("order", () => "orderID")
      .with("comment", () => "commentID")
      .with("reply", () => "replyID")
      .otherwise(() => "");
  const typeInt = (category) =>
    match(category)
      .with("product", () => 0)
      .with("blog", () => 4)
      .with("user", () => 5)
      .with("order", () => 1)
      .with("comment", () => 2)
      .with("reply", () => 3)
      .otherwise(() => 6);
  useEffect(() => {
    form.setFieldsValue({
      image: imageList.length > 0 ? JSON.stringify(imageList) : "",
    });
  }, [imageList]);
  const createReportMutation = useMutation(
    (value: any) =>
      reportService.saveReport({
        [typeID(category)]: Number.parseInt(id),
        type: typeInt(category),
        ...value,
        image: JSON.stringify(imageList),
      }),
    {
      onSuccess: async (data) => {},
    }
  );
  const handleOpen = () => {
    if (mainCtx.user) {
      handler.open();
    } else {
      message.info("Vui lòng đăng nhập để có thể thực hiện");
      router.push({
        pathname: "/authenticate/signin",
        query: { url: router.asPath },
      });
    }
  };
  useEffect(() => {
    if (createReportMutation.isSuccess) {
      onRefetch();
    }
  }, [createReportMutation.isSuccess]);
  return (
    <>
      <div onClick={handleOpen}>{children}</div>

      <Modal
        title="Báo cáo"
        open={modal}
        width={createReportMutation.isSuccess ? 500 : 900}
        style={{ top: 20 }}
        bodyStyle={{ overflowX: "scroll" }}
        onCancel={() => {
          handler.close();
          if (createReportMutation.isSuccess) {
            router.push("/account/report");
          }
        }}
        footer={null}>
        {createReportMutation.isSuccess ? (
          <div className="flex flex-col items-center gap-2">
            <div className="text-primary text-xl font-bold">
              Đã báo cáo thành công!
            </div>
            <div>
              Cảm ơn bạn vì đã báo cáo, rất xin lỗi vì sự cố không đáng có này.
              Vui lòng chờ quản trị viên xem xét vấn đề này
            </div>
            <div className="flex gap-2">
              <Link href="/">
                <Button type="link">Về trang chủ</Button>
              </Link>
              <Link href="/account/report">
                <Button type="primary">Tới trang report</Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-4 grid-cols-1">
            <div>
              <Player
                className="w-[170px]"
                src={problemSticker}
                loop
                autoplay
              />
            </div>
            <div className="flex flex-col col-span-3">
              <div className="font-bold text-xl">Hãy nhập vấn đề</div>
              <div className="text-gray-400">
                Nếu bạn nhận thấy vấn đề đó nguy hiểm, đừng chần chừ mà hãy tìm
                ngay sự giúp đỡ trước khi báo cáo với Moby.
              </div>
              <div></div>
              <Form
                layout="vertical"
                form={form}
                initialValues={{ reason: "" }}
                onFinish={(value) => {
                  createReportMutation.mutate(value);
                  // denyBlogMutation.mutate(value.reason);
                }}
                className="gap-0">
                <Form.Item
                  label="Tiêu đề"
                  name="title"
                  rules={[
                    { required: true, message: "Vui lòng nhập tiêu đề" },
                  ]}>
                  <Input size="large" />
                </Form.Item>
                <Form.Item
                  name="content"
                  label="Nhập rõ lý do"
                  extra={
                    <div className="flex flex-wrap mt-1">
                      {[
                        "Danh mục không phù hợp",
                        "Thiếu mô tả trực quan",
                        "Nội dung gây phản cảm",
                        "Nội dung quá ngắn",
                        "Truyền tải sai kiến thức",
                        "",
                      ].map((item, index) => (
                        <Button
                          key={`reason-${index}`}
                          type="text"
                          size="small"
                          onClick={() =>
                            form.setFieldsValue({
                              content:
                                form.getFieldValue("content") + "\n" + item,
                            })
                          }>
                          {item}
                        </Button>
                      ))}
                    </div>
                  }
                  rules={[{ required: true, message: "Vui lòng nhập lý do" }]}>
                  <Input.TextArea placeholder="" rows={5} />
                </Form.Item>
                <div className="h-[150px]">
                  <Upload.Dragger
                    customRequest={({ file, onSuccess }) => {
                      uploadImg(file as File);
                      setTimeout(() => {
                        onSuccess("ok");
                      }, 0);
                    }}
                    multiple={true}
                    listType="picture-card"
                    fileList={[]}>
                    <div className="">
                      <div className="text-pink-300 text-5xl">
                        <InboxOutlined />
                      </div>
                      <div className="mt-3">
                        Vui lòng thêm chứng cứ bằng hình ảnh (nếu có)
                      </div>
                      <div className=" font-bold">
                        Nhấn tải lên hoặc kéo thả tại đây
                      </div>
                    </div>
                  </Upload.Dragger>
                </div>

                <div className="mt-5 flex flex-wrap gap-4">
                  {imageList.map((item, index) => (
                    <Popover
                      placement="top"
                      arrow={false}
                      content={
                        <div>
                          <Button
                            onClick={() => imagehandler.remove(index)}
                            icon={<DeleteOutlined />}
                            type="text"></Button>
                          <Button icon={<EyeOutlined />} type="text"></Button>
                        </div>
                      }>
                      <div className="flex flex-col items-center gap-1">
                        <Image
                          src={item}
                          width={100}
                          height={100}
                          className="rounded-md border-1 border-gray-100 border-solid cursor-move"
                        />
                      </div>
                    </Popover>
                  ))}
                </div>
                <div className="flex gap-2 items-center justify-end">
                  {/* <Button type="link">Xem lại thông tin báo cáo</Button> */}
                  <Button
                    type="text"
                    onClick={() => handler.close()}
                    className="bg-gray-100 text-gray-500">
                    Huỷ
                  </Button>
                  <Form.Item className="mb-0">
                    <Button
                      type="primary"
                      htmlType="submit"
                      danger
                      loading={createReportMutation.isLoading}>
                      Báo cáo
                    </Button>
                  </Form.Item>
                </div>
              </Form>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};
