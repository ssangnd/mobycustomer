import { useMainContext } from "@/components/context";
import { CheckOutlined } from "@ant-design/icons";
import { useMutation } from "@tanstack/react-query";
import { Button, Form, Input, notification, Select } from "antd";
import { useEffect } from "react";
import { myAddressService } from "services/axios/my-address";

const AddressForm = ({
  content,
  onTriggerClose,
}: {
  content?: any;
  onTriggerClose: () => void;
}) => {
  const [form] = Form.useForm();
  const mainContext = useMainContext();

  const triggerClose = () => {
    form.resetFields();
    onTriggerClose();
  };
  const saveAddressMutation = useMutation(
    (value) =>
      myAddressService.saveMyAddress(
        JSON.stringify(value),
        content?.userAddressID
      ),
    {
      onSuccess: async (data) => {
        notification.success({
          message: !content
            ? "Tạo địa chỉ thành công"
            : "Cập nhật địa chỉ thành công",
        });
        triggerClose();
      },
      onError: async (data) => {
        notification.error({
          message: !content
            ? "Tạo địa chỉ không thành công"
            : "Cập nhật địa chỉ không thành công",
        });
      },
    }
  );

  useEffect(() => {
    form.resetFields();
    if (content) {
      form.setFieldsValue({
        name: JSON.parse(content.address)?.name,
        phone: JSON.parse(content.address)?.phone,
        addressProvince: JSON.parse(content.address)?.addressProvince,
        addressDistrict: JSON.parse(content.address)?.addressDistrict,
        addressWard: JSON.parse(content.address)?.addressWard,
        addressDetail: JSON.parse(content.address)?.addressDetail,
      });
    }
    if (!content) {
      form.setFieldsValue({
        name: mainContext.user.userName,
        phone: mainContext.user.userPhone,
      });
    }
  }, [content]);

  const addressProvince = Form.useWatch("addressProvince", form);
  const addressDistrict = Form.useWatch("addressDistrict", form);

  return (
    <Form
      form={form}
      name="basic"
      layout="vertical"
      onFinish={(value) => {
        saveAddressMutation.mutate(value);
      }}>
      <div className="grid md:grid-cols-2 grid-cols-1 gap-2">
        <Form.Item
          label="Tên"
          name="name"
          rules={[{ required: true, message: "Vui lòng nhập tên" }]}>
          <Input />
        </Form.Item>
        <Form.Item
          label="SĐT"
          name="phone"
          rules={[{ required: true, message: "Vui lòng nhập SĐT" }]}>
          <Input />
        </Form.Item>
        <Form.Item
          label="Tỉnh/Thành phố"
          name="addressProvince"
          rules={[{ required: true, message: "Vui lòng chọn Tỉnh/Thành phố" }]}>
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
          rules={[{ required: true, message: "Vui lòng nhập số nhà, đường" }]}>
          <Input />
        </Form.Item>
        <div className="flex flex-row gap-2">
          <Button type="text" onClick={triggerClose}>
            Huỷ
          </Button>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={saveAddressMutation.isLoading}
              icon={<CheckOutlined />}>
              {content ? "Cập nhật" : "Tạo mới"}
            </Button>
          </Form.Item>
        </div>
      </div>
    </Form>
  );
};
export default AddressForm;
