import qs from "query-string";
import { mobyAxios } from "./axios";

class CartMethod {
  async getCartByMe() {
    const res = await mobyAxios.get("useraccount/cart");
    return res.data;
  }

  async addToCartDetail(cartId: string, itemId: string) {
    const res = await mobyAxios.post("cartdetail/create", { cartId, itemId });
    return res.data;
  }

  async updateCart(cartDetailId: string, itemQuantity: number) {
    const res = await mobyAxios.put("cartdetail", {
      cartDetailId,
      itemQuantity,
    });
    return res.data;
  }

  async deleteCart(cartDetailId: string) {
    const res = await mobyAxios.delete(
      "cartdetail?cartDetailid=" + cartDetailId
    );
    return res.data;
  }
  async confirmCart(listCartDetailID, note: string) {
    const res = await mobyAxios.post("cartdetail/confirm", {
      listCartDetailID,
      note,
    });
    new Promise((resolve) => setTimeout(resolve, 1500));
    return res.data;
  }
  async checkCart(listCartDetailID: number[]) {
    const res = await mobyAxios.get(
      `cartdetail/checking?${qs.stringify({
        listCartDetailID,
      })}`
    );
    return res.data;
  }
  async confirmCartWithPayment(data) {
    const res = await mobyAxios.post("cartdetail/confirm", data);
    return res.data;
  }

  async updateCartAddress(address) {
    const res = await mobyAxios.patch("cart", {
      address,
    });
    return res.data;
  }
}

export const cartService = new CartMethod();
