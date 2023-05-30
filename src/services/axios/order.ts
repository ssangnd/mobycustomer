import qs from "query-string";
import { mobyAxios } from "./axios";

class OrderMethod {
  async getOrderByReceiver({
    pageNumber,
    pageSize,
    orderStatus,
  }: {
    pageNumber?: number;
    pageSize?: number;
    orderStatus: number;
  }) {
    const res = await mobyAxios.get(
      `useraccount/order/reciever?${qs.stringify({
        pageNumber,
        pageSize,
        OrderStatus: orderStatus,
      })}`
    );
    return res.data;
  }
  async getOrderBySharer({
    pageNumber,
    pageSize,
    orderStatus,
  }: {
    pageNumber?: number;
    pageSize?: number;
    orderStatus: number;
  }) {
    const res = await mobyAxios.get(
      `useraccount/order/sharer?${qs.stringify({
        pageNumber,
        pageSize,
        OrderStatus: orderStatus,
      })}`
    );
    return res.data;
  }

  async getOrderById(id) {
    const res = await mobyAxios.get("order?OrderId=" + id);
    return res.data;
  }
  async changeStatusOrder(orderId, status: number) {
    const res = await mobyAxios.put("order", {
      orderId,
      status,
    });
    return res.data;
  }
  async cancelOrder(orderId, reasonCancel: string) {
    const res = await mobyAxios.put("order/cancel", {
      orderId,
      reasonCancel,
    });
    return res.data;
  }
}
export const orderService = new OrderMethod();
