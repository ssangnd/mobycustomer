import { mobyAxios } from "./axios";

class RequestMethod {
  async getRequestBySharer() {
    const res = await mobyAxios.get("useraccount/item/request/sharer");
    return res.data;
  }
  async getRequestByReceiver() {
    const res = await mobyAxios.get("useraccount/request/reciever");
    return res.data;
  }
  async getRequestById(id) {
    const res = await mobyAxios.get("request?RequestId=" + id);
    return res.data;
  }

  async acceptRequest(requestID, listRequestDetailID) {
    const res = await mobyAxios.post("request/confirm", {
      requestID,
      listRequestDetailID,
    });
    return res.data;
  }
  async denyRequest(requestId) {
    const res = await mobyAxios.post("request/deny", {
      requestId,
    });
    return res.data;
  }
}
export const requestService = new RequestMethod();
