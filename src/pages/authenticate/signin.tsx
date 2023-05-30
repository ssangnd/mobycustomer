import { useMainContext } from "@/components/context";
import BlueBackground from "@/images/bg-blue.png";
import notOkSticker from "@/sticker/not-ok.json";
import { FacebookFilled, GoogleOutlined } from "@ant-design/icons";
import { Player } from "@lottiefiles/react-lottie-player";
import { useCounter, useToggle } from "@mantine/hooks";
import { useMutation } from "@tanstack/react-query";
import {
  Button,
  Card,
  DatePicker,
  Divider,
  Form,
  Input,
  Modal,
  Radio,
  Select,
} from "antd";
import { signInWithPopup } from "firebase/auth";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import { FiCheck } from "react-icons/fi";
import { accountService } from "services/axios";
import { auth, provider } from "services/firebase";

const SigninPage = () => {
  const [count, handlers] = useCounter(0, { min: 0, max: 10 });
  const [isOpenModal, toggleModal] = useToggle();
  const [banModal, toggleBanModal] = useToggle();
  const router = useRouter();
  const mainContext = useMainContext();
  const [userToken, setUserToken] = useState("");
  const signInWithGoogle = async () => {
    await localStorage.removeItem("userToken");

    await mainContext.setUserToken("");

    signInWithPopup(auth, provider)
      .then(async (result) => {
        const idtoken = await result.user.getIdToken();
        setUserToken(idtoken);
        await checkAccountMutation.mutate(idtoken);
      })
      .catch((error) => console.log(error));
  };

  const checkAccountMutation = useMutation(
    (value: string) => accountService.checkLogin(value),
    {
      onSuccess: async (value, initial) => {
        if (value.message === "new user") {
          toggleModal();
        } else {
          await localStorage.setItem("userToken", initial);
          accountService.getUserInfo().then(async (data) => {
            if (data.userStatus) {
              await localStorage.setItem("userToken", initial);
              await window.location.replace(
                (router.query.url as string) || "/"
              );
            } else {
              await toggleBanModal();
              await localStorage.removeItem("userToken");
            }
          });
        }
      },
    }
  );
  const createAccountMutation = useMutation(
    (value: any) =>
      accountService.createAccount(
        {
          ...value,
          userAddress: JSON.stringify({
            addressProvince: value.addressProvince,
            addressDistrict: value.addressDistrict,
            addressWard: value.addressWard,
            addressDetail: value.addressDetail,
          }),
        },
        userToken
      ),
    {
      onSuccess: async (value) => {
        if (value) {
          await localStorage.setItem("userToken", userToken);
          window.location.replace("/");
        }
      },
    }
  );
  const [form] = Form.useForm();

  const addressProvince = Form.useWatch("addressProvince", form);
  const addressDistrict = Form.useWatch("addressDistrict", form);
  return (
    <>
      <Head>
        <title>Đăng nhập Moby</title>
      </Head>

      <div
        className="grid place-items-center bg-cover min-h-screen "
        style={{ backgroundImage: `url(${BlueBackground.src})` }}>
        <div className="xl:w-[1280px] lg:w-[1024px] h-full w-full px-4 grid  md:grid-cols-2 grid-cols-1  gap-5 ">
          <div></div>
          <div className="flex flex-col  md:mt-48 mt-0">
            <Card className="p-3 lg:ml-3 ml-1 max-w-[400px]">
              <div className="flex flex-col">
                <div className="font-bold text-lg mb-4">
                  Đăng nhập / Đăng ký MOBY
                </div>
                <Button
                  type="primary"
                  className="bg-orange-400"
                  size="large"
                  icon={<GoogleOutlined />}
                  onClick={signInWithGoogle}>
                  Đăng nhập bằng Google
                </Button>
                <Divider className="m-0" plain>
                  hoặc
                </Divider>
                <Button
                  size="large"
                  type="primary"
                  className="bg-blue-400"
                  icon={<FacebookFilled />}>
                  Đăng nhập bằng Facebook
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
      <Modal
        open={isOpenModal}
        onCancel={() => toggleModal()}
        title="Bạn là người mới?"
        footer={null}>
        <div className="mb-4">Hãy cho mình biết vài thông tin của bạn nhé</div>
        <Form
          name="basic"
          form={form}
          layout="vertical"
          initialValues={{ userSex: true }}
          onFinish={(value) => {
            createAccountMutation.mutate(value);
          }}
          autoComplete="off">
          <Form.Item
            label="SĐT"
            name="userPhone"
            rules={[{ required: true, message: "Vui lòng nhập SĐT" }]}>
            <Input />
          </Form.Item>
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
              rules={[{ required: true, message: "Vui lòng chọn Quận/Huyện" }]}>
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
              rules={[{ required: true, message: "Vui lòng chọn Phường xã" }]}>
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
          <div className="flex items-end justify-end">
            <div className="flex gap-2">
              <Button type="text" onClick={() => toggleModal()}>
                Huỷ
              </Button>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={createAccountMutation.isLoading}>
                  <div className="flex flex-row items-center gap-2 ">
                    <FiCheck />
                    Lưu
                  </div>
                </Button>
              </Form.Item>
            </div>
          </div>
        </Form>
      </Modal>
      <Modal open={banModal} onCancel={() => toggleBanModal()} footer={null}>
        <div className="flex flex-col items-center">
          <Player
            className="w-[170px]"
            src={notOkSticker}
            autoplay
            keepLastFrame
          />
          <div className="text-red-400 text-xl">
            Tài khoản của bạn đã bị khoá
          </div>
          <div>Vui lòng liên hệ quản trị viên để biết thêm chi tiết</div>
        </div>
      </Modal>
    </>
  );
};

export default SigninPage;
