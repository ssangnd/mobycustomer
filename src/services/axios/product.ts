import qs from "query-string";
import { mobyAxios } from "./axios";
class ProductMethod {
  async getProductList(params) {
    const res = await mobyAxios.get("", {
      params,
    });

    return res.data;
  }

  async getProductById(id: string) {
    const res = await mobyAxios.get(`Item/GetItemDetail?itemID=${id}`);
    return res.data;
  }
  async getProductForSEOByID({ id }: { id: string }) {
    const res = await this.getProductById(id);
    const { itemTitle, image } = res;
    return { itemTitle, image };
  }

  async getItemDynamicFilters(data) {
    const res = await mobyAxios.post(`Item/GetItemDynamicFilters`, data);
    return res.data;
  }

  async getProductByUserID(id: string, share: boolean) {
    const res = await mobyAxios.get(
      `Item/GetAllMyBriefItemAndBriefRequest?userID=${id}&share=${share}`
    );
    return res.data;
  }
  async getAllShareProductRecently(index: number, pageSize: number) {
    const res = await mobyAxios.get(
      `Item/GetAllShareRecently?pageNumber=${index}&pageSize=${pageSize}`
    );
    return res.data;
  }
  async getAllShareProductFree(index: number, pageSize: number) {
    const res = await mobyAxios.get(
      `Item/GetAllShareFree?pageNumber=${index}&pageSize=${pageSize}`
    );
    return res.data;
  }
  async getAllShareProductNearYou(
    index: number,
    pageSize: number,
    location: string
  ) {
    const res = await mobyAxios.get(
      `Item/GetAllShareNearYou?${qs.stringify({
        pageNumber: index,
        pageSize,
        location,
      })}`
    );
    return res.data;
  }

  async saveProduct(data) {
    const operator = {
      operate: data.itemID === undefined ? mobyAxios.post : mobyAxios.put,
      params: data.itemID ?? "",
    };
    const res = await operator.operate(
      operator.params ? "Item/UpdateItem" : "Item/CreateItem",
      data
    );
    return res.data.data;
  }
  async deleteProduct(itemID, userID) {
    const res = await mobyAxios.patch(`Item/DeleteItem`, { itemID, userID });
    return res.data;
  }

  async createRecordUSerSearch(data) {
    const res = await mobyAxios.post(`Item/CreateRecordUserSearch`, data);
    return res.data;
  }

  async getAllItemRecommend(pageNumber: number, pageSize: number) {
    const res = await mobyAxios.get(
      `Item/GetListRecommend?${qs.stringify({
        pageNumber,
        pageSize,
      })}`
    );
    return res.data;
  }
  async getAllItemRecommendByBaby(
    pageNumber: number,
    pageSize: number,
    babyID: number
  ) {
    const res = await mobyAxios.get(
      `Item/GetListRecommendByBaby?${qs.stringify({
        pageNumber,
        pageSize,
        babyID,
      })}`
    );
    return res.data;
  }
}

export const productService = new ProductMethod();
