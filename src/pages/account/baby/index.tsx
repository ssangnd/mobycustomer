import { BabyForm } from "@/components/baby/baby-form";
import { useMainContext } from "@/components/context";
import { useBaby } from "@/hooks/account";
import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import { useDisclosure } from "@mantine/hooks";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, Card, Modal, Spin, notification } from "antd";
import dayjs from "dayjs";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FiPlus } from "react-icons/fi";
import { accountService } from "services/axios";
import { dateService } from "services/tool/date-time";

const BabyPage = () => {
  const mainContext = useMainContext();
  const queryClient = useQueryClient();
  const [{ pageNumber, pageSize }, setPagination] = useState({
    pageNumber: 1,
    pageSize: 10,
  });
  const [trigger, handlerTrigger] = useDisclosure(false);

  const babyByMe = useBaby();

  const [selectedBaby, setSelectedBaby] = useState(null);
  const handleToOpenAddressForm = (value) => {
    if (value) {
      setSelectedBaby(value);
    }
    handlerTrigger.open();
  };
  useEffect(() => {
    if (!trigger) {
      setSelectedBaby(null);
      babyByMe.refetch();
    }
  }, [trigger]);

  const deleteBabyMutation = useMutation(
    (value) => accountService.deleteMyBaby(value),
    {
      onSuccess: async (data) => {
        notification.success({
          message: "Xoá em bé thành công",
        });
        queryClient.invalidateQueries({ queryKey: ["/get-baby-by-user"] });
        babyByMe.refetch();
      },
    }
  );
  const [modal, contextHolder] = Modal.useModal();

  const confirmToDelete = (item) => {
    Modal.confirm({
      title: <span>Bạn có muốn xoá em bé này ?</span>,
      content: "Việc xoá em bé không thể hoàn tác vụ.",
      icon: <DeleteOutlined />,
      okText: "Xoá",
      cancelText: "Không",
      okButtonProps: { className: "bg-red-500" },
      onOk: () => {
        deleteBabyMutation.mutate(item.idbaby);
      },
    });
  };
  return (
    <>
      <Head>
        <title>Em bé nhà tôi</title>
      </Head>
      <div className="flex flex-col mb-10 gap-4">
        <div className="flex justify-between">
          <div className="font-bold text-lg uppercase">Em bé nhà tôi</div>

          <Button type="primary" onClick={handlerTrigger.open}>
            <div className="flex flex-row items-center gap-1 ">
              <FiPlus />
              Thêm mới
            </div>
          </Button>
        </div>
        <div>
          Thêm em bé để MOBY có thể đề xuất sản phẩm tốt nhất cho nhà bạn nhé!
        </div>
        <Spin spinning={babyByMe.isFetching} tip="Đang tải...">
          {babyByMe?.data?.map((item, index) => {
            return (
              <Card
                hoverable
                size="small"
                key={`address-${index}`}
                className="mb-2">
                <div className="flex flex-col">
                  <div className=" flex gap-10 justify-between">
                    <span className="font-bold">
                      Ngày sinh: {dayjs(item.dateOfBirth).format("DD-MM-YYYY")}
                      <span className="ml-2">
                        ({dateService.getTimeRelative(item.dateOfBirth)} tuổi)
                      </span>
                    </span>
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
                      <Link
                        href={{
                          pathname: `/wow/baby-items`,
                          query: {
                            babyId: item.idbaby,
                          },
                        }}>
                        <Button
                          type="text"
                          className="text-primary"
                          icon={<EyeOutlined />}>
                          Xem đề xuất
                        </Button>
                      </Link>
                    </div>
                  </div>{" "}
                  <span className="text-primary">
                    {item.sex ? "Nam" : "Nữ"}
                  </span>
                  <div className="text-gray-400">
                    Chiều cao: {item.height}cm - Cân nặng: {item.weight}kg
                  </div>
                </div>
              </Card>
            );
          })}
        </Spin>
      </div>
      <Modal
        title={selectedBaby ? "Cập nhật em bé" : "Tạo mới em bé"}
        open={trigger}
        onCancel={() => handlerTrigger.close()}
        footer={null}>
        <BabyForm data={selectedBaby} onTriggerClose={handlerTrigger.close} />
      </Modal>
    </>
  );
};

export default BabyPage;
