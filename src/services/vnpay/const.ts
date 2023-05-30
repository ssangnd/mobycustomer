export const vnpayEnv = {
  vnp_TmnCode: "VKNCTQK9",
  vnp_HashSecret: "HGHTJGJYJCFNRGVIFZHISMANCZSCKVIB",
  vnp_Url: "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html",
  //   vnp_ReturnUrl: "http://localhost:3001/order/payment-success",
  vnp_ReturnUrl: "",
};

export const RESPONSE_TRANSACTION_STATUS = {
  "00": "Giao dịch thành công",
  "01": "Giao dịch chưa hoàn tất",
  "02": "Giao dịch bị lỗi",
  "04": "Giao dịch đảo (Khách hàng đã bị trừ tiền tại Ngân hàng nhưng GD chưa thành công ở VNPAY)",
  "05": "VNPAY đang xử lý giao dịch này (GD hoàn tiền)",
  "06": "VNPAY đã gửi yêu cầu hoàn tiền sang Ngân hàng (GD hoàn tiền)",
  "07": "Giao dịch bị nghi ngờ gian lận",
  "09": "GD Hoàn trả bị từ chối",
};

export const RESPONSE_TRANSACTION_CODE = {
  "00": "Giao dịch thành công",
  "07": "Trừ tiền thành công. Giao dịch bị nghi ngờ (liên quan tới lừa đảo, giao dịch bất thường).",
  "09": "Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng chưa đăng ký dịch vụ InternetBanking tại ngân hàng.",
  "10": "Giao dịch không thành công do: Khách hàng xác thực thông tin thẻ/tài khoản không đúng quá 3 lần",
  "11": "Giao dịch không thành công do: Đã hết hạn chờ thanh toán. Xin quý khách vui lòng thực hiện lại giao dịch.",
  "12": "Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng bị khóa.",
  "13": "Giao dịch không thành công do Quý khách nhập sai mật khẩu xác thực giao dịch (OTP). Xin quý khách vui lòng thực hiện lại giao dịch.",
  "24": "Giao dịch không thành công do: Khách hàng hủy giao dịch",
  "51": "Giao dịch không thành công do: Tài khoản của quý khách không đủ số dư để thực hiện giao dịch.",
  "65": "Giao dịch không thành công do: Tài khoản của Quý khách đã vượt quá hạn mức giao dịch trong ngày.",
  "75": "Ngân hàng thanh toán đang bảo trì.",
  "79": "Giao dịch không thành công do: KH nhập sai mật khẩu thanh toán quá số lần quy định. Xin quý khách vui lòng thực hiện lại giao dịch",
  "99": "Các lỗi khác (lỗi còn lại, không có trong danh sách mã lỗi đã liệt kê)",
};
