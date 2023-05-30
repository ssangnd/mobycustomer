import { DeleteOutlined } from "@ant-design/icons";
import { useCounter, useDebouncedValue } from "@mantine/hooks";
import { useMutation } from "@tanstack/react-query";
import { Button, Checkbox, InputNumber, Spin } from "antd";
import classcat from "classcat";
import Link from "next/link";
import numeral from "numeral";
import { useEffect } from "react";
import { cartService } from "services/axios/cart";
import { useMainContext } from "../context";

type Props = {
  data;
};
export const CartItem = ({ data }: Props) => {
  const [count, handlers] = useCounter(data.itemQuantity, {
    min: 1,
    max: data?.itemVM?.itemShareAmount,
  });
  const [debounced] = useDebouncedValue(count, 200);
  const mainCtx = useMainContext();

  const deleteCartDetailMutation = useMutation(
    () => cartService.deleteCart(data.cartDetailId),
    {
      onSuccess: async (data) => {
        mainCtx.cart.refetch();
      },
    }
  );
  const updateCartDetailMutation = useMutation(
    () => cartService.updateCart(data.cartDetailId, count),
    {
      onSuccess: async (data) => {
        mainCtx.cart.refetch();
      },
    }
  );

  useEffect(() => {
    if (count !== data.itemQuantity) {
      updateCartDetailMutation.mutate();
    }
  }, [count]);
  return (
    <Spin
      spinning={
        deleteCartDetailMutation.isLoading || updateCartDetailMutation.isLoading
      }
      tip={
        deleteCartDetailMutation.isLoading ? "Đang xoá..." : "Đang cập nhật..."
      }>
      <div
        className={classcat([
          "flex justify-between  p-3 rounded-md",
          {
            "bg-red-50": data?.itemVM?.itemShareAmount === 0,
          },
        ])}>
        <div className="flex gap-4 ">
          <Checkbox
            value={data.cartDetailId}
            className="self-center"
            disabled={data?.itemVM?.itemShareAmount === 0}
          />
          <img
            src={JSON.parse(data.itemVM?.image)[0]}
            width={100}
            height={100}
            style={{ objectFit: "cover" }}
          />
          <div className="flex flex-col">
            <Link
              href={`/product/${data.itemVM?.itemId}`}
              className="flex gap-3 ">
              <div className="pr-10 text-black">{data.itemVM?.itemTitle}</div>
            </Link>
            <div className="flex items-center gap-2">
              <div className=" text-gray-600 whitespace-nowrap">
                {data.itemVM?.itemSalePrice !== 0 ? (
                  <span>
                    &#8363; {numeral(data.itemVM?.itemSalePrice).format("0,0")}
                  </span>
                ) : (
                  "Miễn phí"
                )}
              </div>
              <Button
                type="text"
                shape="circle"
                onClick={() => deleteCartDetailMutation.mutate()}
                icon={<DeleteOutlined className="text-gray-400" />}
              />
            </div>
            {data.itemVM.itemShareAmount < 10 ? (
              <div className="italic text-gray-400">
                Số lượng hàng còn lại: {data.itemVM.itemShareAmount}
              </div>
            ) : null}
            {data.itemVM.itemShareAmount === 0 ? (
              <div className="text-red-400">Hết hàng</div>
            ) : null}
          </div>
        </div>
        <div className="flex flex-col items-end">
          <div className="whitespace-nowrap text-lg">
            {data.itemVM?.itemSalePrice !== 0 ? (
              <span>
                &#8363;{" "}
                {numeral(data.itemVM?.itemSalePrice * data.itemQuantity).format(
                  "0,0"
                )}
              </span>
            ) : (
              "Miễn phí"
            )}
          </div>

          <div className="flex flex-row gap-2">
            <Button
              type="primary"
              className="bg-white text-primary border-primary hover:border-white font-bold"
              size="small"
              onClick={handlers.decrement}
              disabled={count === 1}>
              -
            </Button>
            <InputNumber
              className="text-center quantity-item-input"
              size="small"
              style={{ width: 40 }}
              value={count}
              onChange={(value) => {
                handlers.set(value);
              }}
              controls={false}></InputNumber>
            <Button
              type="primary"
              className="bg-white text-primary border-primary hover:border-white font-bold"
              size="small"
              onClick={handlers.increment}
              disabled={count === data?.itemVM?.itemShareAmount}>
              +
            </Button>
          </div>
        </div>
      </div>
    </Spin>
  );
};
