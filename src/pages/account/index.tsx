import { useMainContext } from "@/components/context";
import { CheckOutlined } from "@ant-design/icons";
import { useCounter, useId } from "@mantine/hooks";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Avatar,
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  Radio,
  Select,
  Upload,
  notification,
} from "antd";
import dayjs from "dayjs";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import Head from "next/head";
import { useEffect, useState } from "react";
import { accountService } from "services/axios";
import { storage } from "services/firebase";

const AccountPage = () => {
  const [count, handlers] = useCounter(0, { min: 0, max: 10 });
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const [image, setImage] = useState(null);
  const mainContext = useMainContext();

  const addressProvince = Form.useWatch("addressProvince", form);
  const addressDistrict = Form.useWatch("addressDistrict", form);
  const saveUserMutation = useMutation(
    (value) => accountService.updateAccount(value),
    {
      onSuccess: async (data) => {
        notification.success({
          message: "Cập nhật thông tin cá nhân thành công",
        });
        queryClient.prefetchQuery({
          queryKey: ["/get-user"],
          queryFn: () => {
            if (localStorage.getItem("userToken"))
              return accountService.getUserInfo();
            return null;
          },
        });
      },
    }
  );
  useEffect(() => {
    if (mainContext.user) {
      form.setFieldsValue({
        ...mainContext.user,
        userDateOfBirth: mainContext.user.userDateOfBirth
          ? dayjs(new Date(mainContext.user.userDateOfBirth))
          : null,
        addressProvince:
          mainContext.user.userAddress &&
          JSON.parse(mainContext.user.userAddress)?.addressProvince,
        addressDistrict:
          mainContext.user.userAddress &&
          JSON.parse(mainContext.user.userAddress)?.addressDistrict,
        addressWard:
          mainContext.user.userAddress &&
          JSON.parse(mainContext.user.userAddress)?.addressWard,
        addressDetail:
          mainContext.user.userAddress &&
          JSON.parse(mainContext.user.userAddress)?.addressDetail,
      });
      setImage(mainContext.user.userImage);
    }
  }, [mainContext.user]);
  const uploadImg = async (file: File) => {
    const uid = useId("image");
    uploadBytes(ref(storage, `chat/${uid}-${file.name}`), file).then(
      (snapshot) => {
        getDownloadURL(snapshot.ref).then((downloadURL) => {
          setImage(downloadURL);
        });
      }
    );
  };
  return (
    <>
      <Head>
        <title>Tài khoản</title>
      </Head>
      <Form
        name="basic"
        form={form}
        layout="vertical"
        onFinishFailed={(value) => {}}
        onFinish={(value) => {
          saveUserMutation.mutate({
            ...value,
            userAddress: JSON.stringify({
              addressProvince: value.addressProvince,
              addressDistrict: value.addressDistrict,
              addressWard: value.addressWard,
              addressDetail: value.addressDetail,
            }),
            userImage: image,
          });
        }}>
        <div className="flex flex-col mb-10 gap-4">
          <div className="flex justify-between">
            <div className="font-bold text-lg ">THÔNG TIN CÁ NHÂN</div>
            <Button
              type="primary"
              htmlType="submit"
              icon={<CheckOutlined />}
              loading={saveUserMutation.isLoading}>
              Cập nhật
            </Button>
          </div>
          <Card title="Ảnh cá nhân" size="small">
            <Form.Item
              name="userImage"
              rules={[{ required: true, message: "Vui lòng nhập tên" }]}>
              <Avatar size={100} src={image}>
                A
              </Avatar>
              <Upload
                className="ml-3"
                fileList={[]}
                customRequest={({ file, onSuccess }) => {
                  uploadImg(file as File);
                  setTimeout(() => {
                    onSuccess("ok");
                  }, 0);
                }}>
                <Button type="default">Tải hình </Button>
              </Upload>
            </Form.Item>
          </Card>
          <Card size="small">
            <Form.Item
              label="Tên"
              name="userName"
              rules={[{ required: true, message: "Vui lòng nhập tên" }]}>
              <Input size="large" />
            </Form.Item>
            <Form.Item label="Mail" name="userGmail">
              <Input readOnly disabled />
            </Form.Item>
            <Form.Item label="Số điện thoại" name="userPhone">
              <Input />
            </Form.Item>
            <div className="grid grid-cols-2">
              <Form.Item label="Giới tính" name="userSex">
                <Radio.Group
                  options={[
                    { label: "Nam", value: true },
                    { label: "Nữ", value: false },
                  ]}
                  optionType="button"
                  buttonStyle="solid"></Radio.Group>
              </Form.Item>

              <Form.Item
                label="Ngày sinh"
                name="userDateOfBirth"
                rules={[
                  { required: true, message: "Vui lòng nhập ngày sinh" },
                  {
                    validator: (rule, value, cb) => {
                      value
                        ? new Date(value) > new Date()
                          ? cb("'time' is exceed")
                          : cb()
                        : cb();
                    },
                    message: "Ngày sinh không quá ngày hiện tại",
                  },
                ]}>
                <DatePicker format={"DD/MM/YYYY"} />
              </Form.Item>
            </div>
          </Card>
          <Card title="Địa chỉ mặc định" size="small">
            <div className="grid md:grid-cols-2 grid-cols-1 gap-2">
              <Form.Item
                label="Tỉnh/Thành phố"
                name="addressProvince"
                rules={[
                  { required: true, message: "Vui lòng chọn Tỉnh/Thành phố" },
                ]}>
                <Select
                  placeholder=""
                  className="w-full"
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    ((option?.label as string) ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  options={mainContext.vnAddress.provinces ?? []}></Select>
              </Form.Item>
              <Form.Item
                label="Quận/Huyện"
                name="addressDistrict"
                rules={[
                  { required: true, message: "Vui lòng chọn Quận/Huyện" },
                ]}>
                <Select
                  placeholder=""
                  className="w-full"
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    ((option?.label as string) ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  options={
                    mainContext.vnAddress.districts.filter(
                      (item) => item.parent_code === addressProvince
                    ) ?? []
                  }></Select>
              </Form.Item>
              <Form.Item
                label="Phường xã"
                name="addressWard"
                rules={[
                  { required: true, message: "Vui lòng chọn Phường xã" },
                ]}>
                <Select
                  placeholder=""
                  className="w-full"
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    ((option?.label as string) ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  options={
                    mainContext.vnAddress.wards.filter(
                      (item) => item.parent_code === addressDistrict
                    ) ?? []
                  }></Select>
              </Form.Item>
              <Form.Item
                label="Số nhà, đường"
                name="addressDetail"
                rules={[
                  { required: true, message: "Vui lòng nhập số nhà, đường" },
                ]}>
                <Input />
              </Form.Item>
            </div>
          </Card>
        </div>{" "}
      </Form>
    </>
  );
};

export default AccountPage;
