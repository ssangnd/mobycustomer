import { useQuery } from "@tanstack/react-query";
import { cartService } from "services/axios/cart";

export const useCart = () => {
  return useQuery({
    queryKey: ["/get-cart-by-me"],
    queryFn: () => {
      if (localStorage.getItem("userToken")) {
        return cartService.getCartByMe();
      }
      return null;
    },
    keepPreviousData: true,
    refetchOnWindowFocus: false,
    retry: 0,
  });
};

export const useConfirmCart = (data: {
  address: string;
  note: string;
  vnp_TransactionNo: string;
  vnp_CardType: string;
  vnp_BankCode: string;
  transactionDate: string;
  listCartDetailID: number[];
  vnp_ResponseCode?: string;
}) => {
  return useQuery({
    queryKey: ["/confirm-cart"],
    queryFn: () => {
      return cartService.confirmCartWithPayment(data);
    },
    enabled:
      data.address &&
      data.listCartDetailID &&
      ((data.vnp_ResponseCode && data.vnp_ResponseCode === "00") ||
        !data.vnp_ResponseCode)
        ? true
        : false,
    keepPreviousData: true,
    refetchOnWindowFocus: false,
    retry: 0,
  });
};
