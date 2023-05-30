import axios from "axios";

export const API_ENDPOINT = "https://be-homework.vercel.app/api";

export const sendPayment = async (amount) => {
  const { data } = await axios.post(`${API_ENDPOINT}/card`, { amount });
  return data;
};

export const getPaymentInfor = async () => {
  const { data } = await axios.get(`${API_ENDPOINT}/bank`);
  return data;
};
