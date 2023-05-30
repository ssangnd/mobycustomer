import { useMainContext } from "@/components/context";
import { useBlog } from "@/hooks/blog";
import { useId } from "@mantine/hooks";
import { useMutation } from "@tanstack/react-query";
import {
  Alert,
  Button,
  Card,
  Form,
  Image,
  Input,
  notification,
  Select,
  Spin,
  Upload,
} from "antd";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { FiCheck } from "react-icons/fi";
import { blogService } from "services/axios/blog";
import { storage } from "services/firebase";
import type { FormProps } from "../type";
import { buttonFormatSun } from "./const";
const SunEditor = dynamic(() => import("suneditor-react"), {
  ssr: false,
});

const BlogForm = ({ id }: FormProps) => {
  const router = useRouter();
  const blogbyId = useBlog(id, "BlogId");
  const [form] = Form.useForm();
  const editor = useRef();
  const [image, setImage] = useState(null);

  useEffect(() => {
    if (blogbyId.data) {
      form.setFieldsValue({
        ...blogbyId.data,
      });
      setImage(blogbyId.data.image);
    }
  }, [blogbyId.data]);

  useEffect(() => {}, []);

  const saveBlogMutation = useMutation((value) => blogService.saveBlog(value), {
    onSuccess: async (data) => {
      notification.success({
        message: !id ? "Tạo blog thành công" : "Cập nhật blog thành công",
        description: "Vui lòng chờ quản trị viên để được duyệt blog.",
      });
      router.back();
    },
    onError: async (data) => {
      notification.error({
        message: !id
          ? "Tạo blog không thành công"
          : "Cập nhật blog không thành công",
        description: "Vui lòng liên hệ quản trị viên để biết thêm chi tiết.",
      });
    },
  });
  const mainContext = useMainContext();

  const getSunEditorInstance = (sunEditor) => {
    editor.current = sunEditor;
  };

  useEffect(() => {}, []);
  const onImageUploadBefore = (files, info, uploadHandler) => {
    const uid = useId("image");

    uploadBytes(ref(storage, `blogs/${uid}-${files[0].name}`), files[0]).then(
      (snapshot) => {
        getDownloadURL(snapshot.ref).then((downloadURL) => {
          const response = {
            result: [
              {
                url: downloadURL,
                name: files[0].name,
                size: files[0].size,
              },
            ],
          };
          uploadHandler(response);
        });
      }
    );
    return false;
  };
  const uploadImg = async (file: File) => {
    const uid = useId("image");
    uploadBytes(ref(storage, `blog/${uid}-${file.name}`), file).then(
      (snapshot) => {
        getDownloadURL(snapshot.ref).then((downloadURL) => {
          setImage(downloadURL);
        });
      }
    );
  };
  return (
    <Form
      form={form}
      name="basic"
      layout="vertical"
      initialValues={{ blogContent: "<div>abcdjdskfhdjksfhdfjkhjk</div>" }}
      onFinish={(value) => {
        saveBlogMutation.mutate({ ...value, blogId: id, image });
      }}>
      <Spin spinning={blogbyId.isFetching} tip="Đang tải dữ liệu...">
        <div className="flex flex-col mb-10 gap-2">
          <div className="flex justify-between">
            <div className="font-bold text-lg ">
              {!id ? "TẠO BLOG" : "CHỈNH SỬA BLOG"}
            </div>
            <div className="flex flex-row gap-2">
              <Button type="text" onClick={() => router.back()}>
                Huỷ
              </Button>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={saveBlogMutation.isLoading}>
                  <div className="flex flex-row items-center gap-2 ">
                    <FiCheck />
                    {id ? "Cập nhật" : "Tạo mới"}
                  </div>
                </Button>
              </Form.Item>
            </div>
          </div>
          <div className="text-red-400">* Bắt buộc</div>
          {blogbyId.data?.blogStatus === 2 ? (
            <Alert
              message={
                <div className="text-red-500">Blog không được duyệt</div>
              }
              description={
                <div className="flex flex-col">
                  <div className="whitespace-pre-wrap">
                    {blogbyId.data?.reasonDeny}
                  </div>
                  <div className="italic">
                    Vui lòng chỉnh sửa lại để blog được quản trị viên duyệt thêm
                    1 lần nữa.
                  </div>
                </div>
              }
              type="error"
              showIcon
              closable
            />
          ) : null}
          <Card title="Thông tin cơ bản" size="small">
            <Form.Item
              label="Danh mục"
              name="blogCategoryId"
              rules={[{ required: true, message: "Vui lòng chọn danh mục" }]}>
              <Select
                placeholder=""
                className="w-full"
                options={mainContext.blogCategory}></Select>
            </Form.Item>
            <Form.Item
              label="Tiêu đề"
              name="blogTitle"
              rules={[{ required: true, message: "Vui lòng nhập tiêu đề" }]}>
              <Input size="large" />
            </Form.Item>
            <Form.Item name="image" label="Thumbnail">
              <Image src={image} height={200}></Image>
              <Upload
                className="ml-3"
                fileList={[]}
                customRequest={({ file, onSuccess }) => {
                  uploadImg(file as File);
                  setTimeout(() => {
                    onSuccess("ok");
                  }, 0);
                }}>
                <Button type="default">Tải hình thumbnail </Button>
              </Upload>
            </Form.Item>
            <Form.Item
              label="Mô tả "
              name="blogDescription"
              rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}>
              <Input.TextArea />
            </Form.Item>
            <Form.Item
              label="Nội dung"
              name="blogContent"
              rules={[{ required: true, message: "Vui lòng nhập nội dung" }]}>
              {!id || (id && blogbyId.isFetched) ? (
                <SunEditor
                  getSunEditorInstance={getSunEditorInstance}
                  setOptions={{
                    height: "400",
                    buttonList: buttonFormatSun,
                  }}
                  defaultValue={blogbyId.data?.blogContent || ""}
                  onImageUploadBefore={onImageUploadBefore}
                />
              ) : null}
            </Form.Item>
          </Card>
        </div>
      </Spin>
    </Form>
  );
};
export default BlogForm;
