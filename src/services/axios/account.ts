import { mobyAxios } from "./axios";

class AccountMethod {
  async checkLogin(token: string) {
    const res = await mobyAxios.post(
      "useraccount/login",
      {},
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );

    return res.data;
  }
  async createAccount(data, token) {
    const res = await mobyAxios.post("useraccount/create", data, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });

    return res.data;
  }
  async updateAccount(data) {
    const res = await mobyAxios.put("useraccount", data, {});
    return res.data;
  }

  async getUserInfo() {
    const res = await mobyAxios.get("useraccount/token");
    return res.data;
  }
  async getUserInfoById(id: number) {
    const res = await mobyAxios.get("useraccount?UserId=" + id);
    return res.data;
  }

  async getBabyInfo() {
    const res = await mobyAxios.get("useraccount/baby");
    return res.data;
  }

  async createBaby(data) {
    const res = await mobyAxios.post("baby", data);
    return res.data;
  }

  async updateBaby(data) {
    const res = await mobyAxios.put("baby/update", data);
    return res.data;
  }
  async deleteMyBaby(id) {
    const res = await mobyAxios.delete("useraccount/baby?id=" + id);
    return res;
  }
}

export const accountService = new AccountMethod();
