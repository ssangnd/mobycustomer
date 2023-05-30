import { useMyAddress } from "@/hooks/my-address";
import { PhoneOutlined } from "@ant-design/icons";
import { Card, Spin } from "antd";
import { useMainContext } from "../context";

type Props = {
  onSelect: (selected) => void;
};
export const AddressSelection = ({ onSelect }: Props) => {
  const mainContext = useMainContext();

  const addressByMe = useMyAddress();
  return (
    <Spin spinning={addressByMe.isFetching} tip="Đang tải...">
      {mainContext.user ? (
        <Card
          hoverable
          size="small"
          className="mb-2 bg-pink-50"
          onClick={() => onSelect(mainContext.user.userAddress)}>
          <div className="flex flex-col">
            <div className=" flex gap-10 justify-between">
              <span className="font-bold">
                {mainContext.user.userName}{" "}
                <span className="text-primary italic ml-2">
                  Địa chỉ mặc định
                </span>
              </span>
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
            onClick={() => onSelect(item.address)}
            className="mb-2">
            <div className="flex flex-col">
              <div className=" flex gap-10 justify-between">
                <span className="font-bold">{detail.name}</span>
                <div className="flex gap-2"></div>
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
  );
};
