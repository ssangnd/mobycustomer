import { CheckOutlined } from "@ant-design/icons";
import { useMutation } from "@tanstack/react-query";
import {
  Button,
  DatePicker,
  Form,
  InputNumber,
  Radio,
  notification,
} from "antd";
import dayjs from "dayjs";
import { useEffect } from "react";
import { accountService } from "services/axios";
import { useMainContext } from "../context";

export const BabyForm = ({
  data,
  onTriggerClose,
}: {
  data?: any;
  onTriggerClose: () => void;
}) => {
  const [form] = Form.useForm();
  const mainContext = useMainContext();

  useEffect(() => {
    if (data) {
      form.setFieldsValue({
        ...data,
        dateOfBirth: dayjs(data.dateOfBirth),
      });
    }
  }, [data]);

  const saveBabyMutation = useMutation(
    (value: any) =>
      data
        ? accountService.updateBaby({ ...value, idbaby: data.idbaby })
        : accountService.createBaby({
            ...value,
            userId: mainContext.user.userId,
          }),
    {
      onSuccess: async (data) => {
        notification.success({
          message: "Lưu em bé thành công",
        });
        triggerClose();

        // window.location.reload();
      },
      onError: async (data) => {
        notification.error({
          message: "Lưu em bé không thành công",
          description: "Vui lòng liên hệ quản trị viên để biết thêm chi tiết.",
        });
      },
    }
  );

  const triggerClose = () => {
    form.resetFields();
    onTriggerClose();
  };
  return (
    <Form
      form={form}
      name="basic"
      layout="vertical"
      onFinish={(value) => {
        saveBabyMutation.mutate(value);
      }}>
      <div className="flex gap-2">
        <Form.Item
          label="Giới tính"
          name="sex"
          rules={[{ required: true, message: "Vui lòng nhập giới tính" }]}>
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
          name="dateOfBirth"
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
      <div className="flex gap-2">
        <Form.Item
          label="Cân nặng"
          name="weight"
          rules={[{ required: true, message: "Vui lòng nhập cân nặng" }]}>
          <InputNumber min={0.1} addonAfter="kg" />
        </Form.Item>
        <Form.Item
          label="Chiều cao"
          name="height"
          rules={[{ required: true, message: "Vui lòng nhập Chiều cao" }]}>
          <InputNumber min={1} addonAfter="cm" />
        </Form.Item>
      </div>
      <div className="flex flex-row gap-2">
        <Button type="text" onClick={triggerClose}>
          Huỷ
        </Button>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            icon={<CheckOutlined />}
            loading={saveBabyMutation.isLoading}>
            {data ? "Cập nhật" : "Tạo mới"}
          </Button>
        </Form.Item>
      </div>
    </Form>
  );
};
