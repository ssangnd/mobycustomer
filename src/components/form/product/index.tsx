import { useMainContext } from "@/components/context";
import { useItem } from "@/hooks/product";
import { useReportStatusByID } from "@/hooks/report";
import { DeleteOutlined, EyeOutlined, InboxOutlined } from "@ant-design/icons";
import { useId, useListState } from "@mantine/hooks";
import { useMutation } from "@tanstack/react-query";
import {
  Alert,
  Button,
  Card,
  Cascader,
  DatePicker,
  Form,
  Image,
  Input,
  InputNumber,
  Popover,
  Radio,
  Select,
  Space,
  Spin,
  Upload,
  notification,
} from "antd";
import dayjs from "dayjs";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  FiAperture,
  FiBox,
  FiCheck,
  FiImage,
  FiNavigation,
} from "react-icons/fi";
import { productService } from "services/axios";
import { storage } from "services/firebase";
import type { FormProps } from "../type";

const ProductForm = ({ id, share }: FormProps) => {
  const [form] = Form.useForm();
  const router = useRouter();
  const mainContext = useMainContext();
  const itembyId = useItem(id);
  const reportStatusByID = useReportStatusByID({
    id: id ? Number.parseInt(id) : undefined,
    type: 0,
  });
  const saveProductMutation = useMutation(
    (value) => productService.saveProduct(value),
    {
      onSuccess: async (data) => {
        notification.success({
          message: !id
            ? "Tạo sản phẩm thành công"
            : "Cập nhật sản phẩm thành công",
          description: "Vui lòng chờ quản trị viên để được duyệt sản phẩm.",
        });
        router.replace("/account/product");
      },
    }
  );

  useEffect(() => {
    if (itembyId.data) {
      form.setFieldsValue({
        ...itembyId.data,
        subCategoryId: [itembyId.data.categoryId, itembyId.data.subCategoryId],
        stringDateTimeExpiredTime: itembyId.data.itemExpiredTime ? true : null,
        stringDateTimeExpired: itembyId.data.itemExpiredTime
          ? dayjs(itembyId.data.itemExpiredTime)
          : null,
        addressProvince:
          itembyId.data.itemShippingAddress &&
          JSON.parse(itembyId.data.itemShippingAddress)?.AddressProvince,
        addressDistrict:
          itembyId.data.itemShippingAddress &&
          JSON.parse(itembyId.data.itemShippingAddress)?.AddressDistrict,
        addressWard:
          itembyId.data.itemShippingAddress &&
          JSON.parse(itembyId.data.itemShippingAddress)?.AddressWard,
        addressDetail:
          itembyId.data.itemShippingAddress &&
          JSON.parse(itembyId.data.itemShippingAddress)?.AddressDetail,
      });
      handler.setState(JSON.parse(itembyId.data.image));
    }
  }, [itembyId.data]);

  const [imageList, handler] = useListState([]);

  const uploadImg = async (file: File) => {
    const uid = useId("image");
    uploadBytes(ref(storage, `items/${uid}-${file.name}`), file).then(
      (snapshot) => {
        getDownloadURL(snapshot.ref).then((downloadURL) => {
          handler.append(downloadURL);
        });
      }
    );
  };

  const [dragStart, setDragStart] = useState(null);
  const [dragEnd, setDragEnd] = useState(null);

  const onDragStart = (e, index) => {
    setDragStart(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", e.target.parentNode);
    e.dataTransfer.setDragImage(e.target.parentNode, 20, 20);
  };

  const onDragOver = (e, index) => {
    e.preventDefault();
    setDragEnd(index);
  };

  const onDragEnd = () => {
    handler.reorder({ from: dragStart, to: dragEnd });
  };

  const stringDateTimeExpiredTime = Form.useWatch(
    "stringDateTimeExpiredTime",
    form
  );
  const addressProvince = Form.useWatch("addressProvince", form);
  const addressDistrict = Form.useWatch("addressDistrict", form);

  useEffect(() => {
    form.setFieldsValue({
      image: imageList.length > 0 ? JSON.stringify(imageList) : "",
    });
  }, [imageList]);

  //   useEffect(() => {
  //     form.setFieldsValue({
  //       subCategoryId: [1, 2],
  //       itemTitle: "Sản phẩm 1",
  //       itemDetailedDescription: "Sản phẩm mô tả chi tiết",
  //       itemMass: 1,
  //       itemSize: true,
  //       itemEstimateValue: 1234500,
  //       itemSalePrice: 54320,
  //       itemShareAmount: 2,
  //       itemQuanlity: "Còn mới",
  //       itemSponsoredOrderShippingFee: true,
  //       stringDateTimeExpired: null,
  //       image: JSON.stringify([
  //         "https://firebasestorage.googleapis.com/v0/b/moby-app-customer.appspot.com/o/images%2Fimage-3d1b9b0ef851220f7b40.jpg?alt=media&token=d8f9747b-d9ff-42d0-9dd7-d9b6a9a0793c",
  //       ]),
  //       itemShippingAddress: null,
  //     });
  //   }, []);

  return (
    <Form
      name="basic"
      form={form}
      layout="vertical"
      initialValues={{
        itemSize: false,
      }}
      onFinishFailed={(value) => {}}
      onFinish={(value) => {
        saveProductMutation.mutate({
          userId: mainContext.user.userId,
          ...value,
          itemShippingAddress: JSON.stringify({
            addressProvince: value.addressProvince,
            addressDistrict: value.addressDistrict,
            addressWard: value.addressWard,
            addressDetail: value.addressDetail,
          }),
          subCategoryId: value.subCategoryId[1],
          share: itembyId?.data?.share || share,
          itemID: id,
        });
      }}>
      <Spin spinning={itembyId.isFetching} tip="Đang tải dữ liệu...">
        <div className="flex flex-col mb-10 gap-2">
          <div className="flex justify-between">
            <div className="font-bold text-lg ">
              {id ? "CẬP NHẬT ĐƠN " : "TẠO ĐƠN "}
              {itembyId?.data?.share || share ? " CHIA SẺ" : " HỖ TRỢ"}
            </div>
            <div className="flex gap-3">
              <Button type="text" onClick={() => router.back()}>
                Huỷ
              </Button>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={saveProductMutation.isLoading}>
                  <div className="flex flex-row items-center gap-2 ">
                    <FiCheck />
                    {id ? "Cập nhật" : "Tạo mới"}
                  </div>
                </Button>
              </Form.Item>
            </div>
          </div>

          {!itembyId.data?.itemStatus && (
        <Alert
          message={<div className="text-red-500">Sản phẩm đã bị ẩn</div>}
          type="error"
          showIcon
          className="mb-2"
          description={
            <div className="whitespace-pre-wrap">
              {reportStatusByID.data?.reasonHiden}
            </div>
          }
        />
      )}
          <div className="text-red-400">* Bắt buộc</div>
          <Card
            title={
              <div className="flex items-center gap-2 text-blue-600 text-lg">
                <FiBox />
                Thông tin cơ bản
              </div>
            }
            size="small">
            <Form.Item
              label="Danh mục"
              name="subCategoryId"
              rules={[{ required: true, message: "Vui lòng chọn danh mục" }]}>
              <Cascader
                placeholder=""
                className="w-full"
                options={mainContext.category}
                expandTrigger="hover"></Cascader>
            </Form.Item>
            <Form.Item
              label="Tên sản phẩm"
              name="itemTitle"
              rules={[
                { required: true, message: "Vui lòng nhập tên sản phẩm" },
              ]}>
              <Input size="large" />
            </Form.Item>
            <Form.Item
              label="Mô tả chi tiết"
              name="itemDetailedDescription"
              rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}>
              <Input.TextArea />
            </Form.Item>
          </Card>
          <Card
            title={
              <div className="flex items-center gap-2 text-blue-600 text-lg">
                <FiAperture />
                Thông tin chi tiết
              </div>
            }
            size="small">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col">
                <Form.Item
                  label="Khối lượng"
                  name="itemMass"
                  style={{ width: 170 }}
                  rules={[
                    { required: true, message: "Vui lòng nhập khối lượng" },
                  ]}>
                  <InputNumber addonAfter="gram" />
                </Form.Item>
                <Form.Item
                  label="Kích thước hàng"
                  extra="1 trong 3 chiều dài, rộng, cao của kiện hàng có kích thước >1.5m và trọng lương >10g"
                  name="itemSize"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng chọn kích thước hàng",
                    },
                  ]}>
                  <Radio.Group
                    options={[
                      { label: "Hàng nhỏ", value: false },
                      { label: "Hàng cồng kềnh", value: true },
                    ]}
                    defaultValue={false}
                    optionType="button"
                    buttonStyle="solid"></Radio.Group>
                </Form.Item>

                <Form.Item
                  label="Tình trạng còn sử dụng được"
                  name="itemEstimateValue"
                  style={{ width: 250 }}
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập Tình trạng còn sử dụng được",
                    },
                  ]}>
                  <InputNumber addonAfter="%" max={100} min={40} />
                </Form.Item>
                <Form.Item
                  label="Giá bán"
                  name="itemSalePrice"
                  style={{ width: 250 }}
                  rules={[
                    { required: true, message: "Vui lòng nhập Giá bán" },
                  ]}>
                  <InputNumber addonAfter="VND" />
                </Form.Item>
                <Form.Item
                  label="Số lượng"
                  name="itemShareAmount"
                  style={{ width: 250 }}
                  rules={[
                    { required: true, message: "Vui lòng nhập số lượng" },
                  ]}>
                  <InputNumber />
                </Form.Item>
                <div>Độ tuổi</div>
                <Space.Compact>
                  <Form.Item
                    name="minAge"
                    rules={[
                      {
                        validator: (rule, value, cb) => {
                          const maxAge = form.getFieldValue("maxAge");
                          value && maxAge && value >= maxAge
                            ? cb("'time' is exceed")
                            : cb();
                        },
                        message: "Vui lòng nhập tuổi hợp lệ",
                      },
                    ]}>
                    <InputNumber placeholder="Từ" min={0} />
                  </Form.Item>
                  <Form.Item name="maxAge" style={{ width: 250 }}>
                    <InputNumber placeholder="Đến" min={0} />
                  </Form.Item>
                </Space.Compact>
                <div>Chiều cao</div>
                <Space.Compact>
                  <Form.Item
                    name="minHeight"
                    rules={[
                      {
                        validator: (rule, value, cb) => {
                          const maxHeight = form.getFieldValue("maxHeight");
                          value && maxHeight && value >= maxHeight
                            ? cb("'time' is exceed")
                            : cb();
                        },
                        message: "Vui lòng nhập chiều cao hợp lệ",
                      },
                    ]}>
                    <InputNumber placeholder="Từ" min={0} />
                  </Form.Item>
                  <Form.Item name="maxHeight">
                    <InputNumber placeholder="Đến" min={0} addonAfter="cm" />
                  </Form.Item>
                </Space.Compact>
                <div>Cân nặng</div>
                <Space.Compact>
                  <Form.Item
                    name="minWeight"
                    rules={[
                      {
                        validator: (rule, value, cb) => {
                          const maxWeight = form.getFieldValue("maxWeight");
                          value && maxWeight && value >= maxWeight
                            ? cb("'time' is exceed")
                            : cb();
                        },
                        message: "Vui lòng nhập cân nặng hợp lệ",
                      },
                    ]}>
                    <InputNumber placeholder="Từ" min={0} />
                  </Form.Item>
                  <Form.Item name="maxWeight">
                    <InputNumber placeholder="Đến" min={0} addonAfter="kg" />
                  </Form.Item>
                </Space.Compact>
              </div>
              <div className="flex flex-col">
                <Form.Item
                  label="Thời gian hết hạn"
                  name="stringDateTimeExpiredTime">
                  <Radio.Group
                    options={[
                      { label: "Không hết hạn", value: null },
                      { label: "Hết hạn vào ngày", value: true },
                    ]}
                    defaultValue={null}
                    optionType="button"
                    buttonStyle="solid"></Radio.Group>
                </Form.Item>

                {stringDateTimeExpiredTime ? (
                  <Form.Item
                    label="Ngày hết hạn"
                    name="stringDateTimeExpired"
                    style={{ width: 250 }}
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập ngày hết hạn",
                      },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (new Date() < new Date(value)) {
                            return Promise.resolve();
                          }
                          if (!value) return Promise.resolve();
                          return Promise.reject(
                            new Error(
                              "Vui lòng chọn ngày lớn hơn ngày hiện tại"
                            )
                          );
                        },
                      }),
                    ]}>
                    <DatePicker format="DD/MM/YYYY" className="w-full" />
                  </Form.Item>
                ) : null}
              </div>
            </div>
          </Card>
          <Card
            title={
              <div className="flex items-center gap-2 text-blue-600 text-lg">
                <FiImage />
                Hình ảnh sản phẩm
              </div>
            }
            size="small">
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
              <div>
                <div className="text-pink-300 text-5xl">
                  <InboxOutlined />
                </div>

                <div className="mt-3 font-bold">
                  Nhấn tải lên hoặc kéo thả tại đây
                </div>
                <div>*Chọn ít nhất 01 hình ảnh</div>
              </div>
            </Upload.Dragger>
            <div className="text-gray-400 italic mt-1">
              *Có thể kéo thả các hình ảnh để thay đổi vị trí hiển thị
            </div>
            <div className="mt-5 flex flex-wrap gap-4">
              {imageList.map((item, index) => (
                <Popover
                  placement="top"
                  arrow={false}
                  content={
                    <div>
                      <Button
                        onClick={() => handler.remove(index)}
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
                      draggable
                      onDragStart={(e) => onDragStart(e, index)}
                      onDragEnd={onDragEnd}
                      onDragOver={(e) => onDragOver(e, index)}
                      onDragEnter={(e) => onDragOver(e, index)}
                      preview={false}
                      className="rounded-md border-1 border-gray-100 border-solid cursor-move"
                    />
                    {index == 0 && (
                      <span className="text-xs">
                        <span className="text-red-500">*</span>Ảnh bìa
                      </span>
                    )}
                  </div>
                </Popover>
              ))}
            </div>
            <Form.Item
              name="image"
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn ít nhất 1 hình chính",
                },
              ]}></Form.Item>
          </Card>
          <Card
            title={
              <div className="flex items-center gap-2 text-blue-600 text-lg">
                <FiNavigation />
                Địa chỉ gửi hàng
              </div>
            }
            size="small">
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
        </div>
      </Spin>
    </Form>
  );
};
export default ProductForm;
