import { useQuery } from "@tanstack/react-query";
import { orderService } from "services/axios/order";

type GetOrderProps = {
  type: "receiver" | "sharer";
  pageNumber: number;
  pageSize: number;
  orderStatus: number;
};
export const useGetOrder = ({
  type,
  pageNumber,
  pageSize,
  orderStatus,
}: GetOrderProps) => {
  return useQuery({
    queryKey: ["/get-order-options", type, pageNumber, pageSize, orderStatus],
    queryFn: () => {
      return type === "receiver"
        ? orderService.getOrderByReceiver({ pageNumber, pageSize, orderStatus })
        : orderService.getOrderBySharer({ pageNumber, pageSize, orderStatus });
    },
    keepPreviousData: true,
    refetchOnWindowFocus: false,
    retry: 0,
  });
};

export const useGetOrderById = (id?: string) => {
  return useQuery({
    queryKey: ["/order-details", id],
    queryFn: () => {
      if (!id) {
        throw new Error("[useItem] Invalid item_id parameter");
      }
      return orderService.getOrderById(id);
    },
    enabled: id ? true : false,
    refetchOnWindowFocus: false,
    retry: 3,
  });
};
