import { useMainContext } from "@/components/context";
import AddressForm from "@/components/form/address";
import { useMyAddress } from "@/hooks/my-address";
import { DeleteOutlined, EditOutlined, PhoneOutlined } from "@ant-design/icons";
import { useDisclosure } from "@mantine/hooks";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, Card, Modal, Spin, notification } from "antd";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FiPlus } from "react-icons/fi";
import { myAddressService } from "services/axios/my-address";

const AddressPage = () => {
  const mainContext = useMainContext();
  const queryClient = useQueryClient();
  const [{ pageNumber, pageSize }, setPagination] = useState({
    pageNumber: 1,
    pageSize: 10,
  });
  const [trigger, handlerTrigger] = useDisclosure(false);

  const addressByMe = useMyAddress();

  const [selectedAddr, setSelectedAddr] = useState(null);
  const handleToOpenAddressForm = (value) => {
    if (value) {
      setSelectedAddr(value);
    }
    handlerTrigger.open();
  };
  useEffect(() => {
    if (!trigger) {
      setSelectedAddr(null);
      addressByMe.refetch();
    }
  }, [trigger]);

  const deleteAddressMutation = useMutation(
    (value) => myAddressService.deleteMyAddress(value),
    {
      onSuccess: async (data) => {
        notification.success({
          message: "Xoá địa chỉ thành công",
        });
        queryClient.invalidateQueries({ queryKey: ["/items-by-user-id"] });
        addressByMe.refetch();
      },
    }
  );
  const [modal, contextHolder] = Modal.useModal();

  const confirmToDelete = (item) => {
    Modal.confirm({
      title: <span>Bạn có muốn xoá Địa chỉ này ?</span>,
      content: "Việc xoá địa chỉ không thể hoàn tác vụ.",
      icon: <DeleteOutlined />,
      okText: "Xoá",
      cancelText: "Không",
      okButtonProps: { className: "bg-red-500" },
      onOk: () => {
        deleteAddressMutation.mutate(item.userAddressID);
      },
    });
  };
  return (
    <>
      <Head>
        <title>Địa chỉ của tôi</title>
      </Head>
      <div className="flex flex-col mb-10 gap-4">
        <div className="flex justify-between">
          <div className="font-bold text-lg uppercase">Sổ địa chỉ</div>

          <Button type="primary" onClick={handlerTrigger.open}>
            <div className="flex flex-row items-center gap-1 ">
              <FiPlus />
              Thêm mới
            </div>
          </Button>
        </div>
        <Spin spinning={addressByMe.isFetching} tip="Đang tải...">
          {mainContext.user ? (
            <Card hoverable size="small" className="mb-2 bg-pink-50">
              <div className="flex flex-col">
                <div className=" flex gap-10 justify-between">
                  <span className="font-bold">
                    {mainContext.user.userName}{" "}
                    <span className="text-primary italic ml-2">
                      Địa chỉ mặc định
                    </span>
                  </span>
                  <div className="flex gap-2">
                    <Link href="/account">
                      <Button
                        type="text"
                        className="text-primary"
                        icon={<EditOutlined />}>
                        Chỉnh sửa
                      </Button>
                    </Link>
                  </div>
                </div>{" "}
                <span className="text-primary">
                  <PhoneOutlined /> {mainContext.user.userPhone}
                </span>
                <div className="text-gray-400">
                  {JSON.parse(mainContext.user.userAddress).addressDetail}
                  {", "}
                  {
                    mainContext.vnAddress.wards.find(
                      (i) =>
                        i.value ===
                        JSON.parse(mainContext.user.userAddress).addressWard
                    )?.label
                  }
                  {", "}
                  {
                    mainContext.vnAddress.districts.find(
                      (i) =>
                        i.value ===
                        JSON.parse(mainContext.user.userAddress).addressDistrict
                    )?.label
                  }
                  {", "}
                  {
                    mainContext.vnAddress.provinces.find(
                      (i) =>
                        i.value ===
                        JSON.parse(mainContext.user.userAddress).addressProvince
                    )?.label
                  }
                </div>
              </div>
            </Card>
          ) : null}

          {addressByMe?.data?.map((item, index) => {
            const detail = JSON.parse(item.address);
            return (
              <Card
                hoverable
                size="small"
                key={`address-${index}`}
                className="mb-2">
                <div className="flex flex-col">
                  <div className=" flex gap-10 justify-between">
                    <span className="font-bold">{detail.name}</span>
                    <div className="flex gap-2">
                      <Button
                        type="text"
                        className="text-primary"
                        icon={<DeleteOutlined />}
                        onClick={() => confirmToDelete(item)}>
                        Xoá
                      </Button>
                      <Button
                        type="text"
                        className="text-primary"
                        icon={<EditOutlined />}
                        onClick={() => handleToOpenAddressForm(item)}>
                        Chỉnh sửa
                      </Button>
                    </div>
                  </div>{" "}
                  <span className="text-primary">
                    <PhoneOutlined /> {detail.phone}
                  </span>
                  <div className="text-gray-400">
                    {detail.addressDetail}
                    {", "}
                    {
                      mainContext.vnAddress.wards.find(
                        (i) => i.value === detail.addressWard
                      )?.label
                    }
                    {", "}
                    {
                      mainContext.vnAddress.districts.find(
                        (i) => i.value === detail.addressDistrict
                      )?.label
                    }
                    {", "}
                    {
                      mainContext.vnAddress.provinces.find(
                        (i) => i.value === detail.addressProvince
                      )?.label
                    }
                  </div>
                </div>
              </Card>
            );
          })}
        </Spin>
      </div>
      <Modal
        title={selectedAddr ? "Cập nhật địa chỉ" : "Tạo mới địa chỉ"}
        open={trigger}
        onCancel={() => handlerTrigger.close()}
        footer={null}>
        <AddressForm
          content={selectedAddr}
          onTriggerClose={handlerTrigger.close}
        />
      </Modal>
    </>
  );
};

export default AddressPage;
