import crypto from "crypto";
import dayjs from "dayjs";
import qs from "query-string";
import { vnpayEnv } from "./const";
export const GoToVNPayPayment = (data: PaymentProps) => {
  window.location.replace(URLVNPayPayment(data));
  //   console.log(URLVNPayPayment(data));
};

const URLVNPayPayment = ({
  amount,
  bankCode,
  locale,
  info,
  ipAdrr,
  returnUrl,
}: PaymentProps) => {
  process.env.TZ = "Asia/Ho_Chi_Minh";
  const { vnp_HashSecret, vnp_TmnCode, vnp_Url, vnp_ReturnUrl } = vnpayEnv;
  let createDate = dayjs(new Date()).format("YYYYMMDDHHmmss");
  let orderId = dayjs(new Date()).format("HHmmss");
  let currCode = "VND";
  let vnp_Params: Partial<PaymentParams> = {
    vnp_Version: "2.1.0",
    vnp_Command: "pay",
    vnp_TmnCode,
    vnp_Locale: locale,
    vnp_CurrCode: currCode,
    vnp_TxnRef: orderId,
    vnp_OrderInfo: info,
    vnp_OrderType: "other",
    vnp_Amount: amount * 100,
    vnp_ReturnUrl: returnUrl,
    vnp_IpAddr: ipAdrr,
    vnp_CreateDate: createDate,
  };
  if (bankCode !== null && bankCode !== "") {
    vnp_Params["vnp_BankCode"] = bankCode;
  }
  console.log("Before", vnp_Params);

  vnp_Params = sortObject(vnp_Params);
  let signData = qs.stringify(vnp_Params, { encode: false });
  let hmac = crypto.createHmac("sha512", vnp_HashSecret);
  console.log(hmac);
  let signed = hmac.update(new Buffer(signData, "utf-8")).digest("hex");
  vnp_Params["vnp_SecureHash"] = signed;
  console.log("after", vnp_Params);
  console.log("after", signed);

  return vnp_Url + "?" + qs.stringify(vnp_Params, { encode: false });
};
type PaymentProps = {
  amount: number;
  bankCode: "" | "VNPAYQR" | "VNBANK" | "INTCARD";
  locale: "vn" | "en";
  info: string;
  ipAdrr: string;
  returnUrl?: string;
};

type PaymentParams = {
  vnp_Version: string;
  vnp_Command: string;
  vnp_TmnCode: string;
  vnp_Locale: string;
  vnp_CurrCode: string;
  vnp_TxnRef: string;
  vnp_OrderInfo: string;
  vnp_OrderType: string;
  vnp_Amount: number;
  vnp_ReturnUrl: string;
  vnp_IpAddr: string;
  vnp_CreateDate: string;
  vnp_BankCode: string;
};

const sortObject = (obj) => {
  let sorted = {};
  let str = [];
  let key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
  }
  return sorted;
};
