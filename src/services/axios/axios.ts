import axios from "axios";
import { Service } from "axios-middleware";

const service = new Service(axios);
// const BASE_URL =
//   "https://default-webapp-endpoint-6dc6d2ce-chdmbxdfffhpg7fe.z01.azurefd.net/api";
const BASE_URL = "https://mobyapicore6sa.azurewebsites.net/api";

service.register({
  onRequest(config) {
    if (typeof window !== "undefined") {
      if (localStorage?.getItem("userToken") && config.baseURL) {
        config.headers.Authorization = `Bearer ${localStorage.getItem(
          "userToken"
        )}`;
      }
    }
    return config;
  },
  onResponseError(error) {
    if (typeof window !== "undefined") {
      if (error?.response.status === 401) {
        if (localStorage?.getItem("userToken")) {
          localStorage?.removeItem("userToken");
        }
      }
    }
    throw error;
  },
});

const mobyAxios = axios.create({
  baseURL: BASE_URL,
  // baseURL: `https://mobyapicore620230210225951-staging.azurewebsites.net/api`,
  timeout: 50000,
});

export { mobyAxios };
