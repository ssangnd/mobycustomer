import { mobyAxios } from "./axios";

class BannerMethod {
  async getBannerList() {
    const res = await mobyAxios.get("Banner/GetAllBanner");
    return res.data;
  }
}

export const bannerService = new BannerMethod();
