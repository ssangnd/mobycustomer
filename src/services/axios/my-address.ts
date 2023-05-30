import { mobyAxios } from "./axios";

class MyAddressMethod {
  async getMyAddress(): Promise<any[]> {
    const res = await mobyAxios.get("useraddress");
    return res.data;
  }
  async deleteMyAddress(id) {
    const res = await mobyAxios.delete("useraddress?userAddressID=" + id);
    return res;
  }
  async saveMyAddress(address, id) {
    const operator = {
      operate: id ? mobyAxios.patch : mobyAxios.post,
      params: id ?? "",
    };
    const res = await operator.operate("useraddress", {
      userAddressID: id,
      address,
    });
    return res.data;
  }
}

export const myAddressService = new MyAddressMethod();
