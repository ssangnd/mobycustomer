import { useMainContext } from "@/components/context";
import { useConfirmCart } from "@/hooks/cart";
import checkCompleted from "@/sticker/check-completed.json";
import notOkSticker from "@/sticker/not-ok.json";
import waiting from "@/sticker/waiting.json";
import { Player } from "@lottiefiles/react-lottie-player";
import { useCounter } from "@mantine/hooks";
import { Button } from "antd";
import Head from "next/head";
import { useRouter } from "next/router";
import { RESPONSE_TRANSACTION_STATUS } from "services/vnpay/const";

const PaymentSuccessPage = () => {
  const [count, handlers] = useCounter(0, { min: 0, max: 10 });
  const router = useRouter();
  console.log(router);
  const {
    vnp_Amount,
    vnp_BankCode,
    vnp_CardType,
    vnp_OrderInfo,
    vnp_PayDate,
    vnp_ResponseCode,
    vnp_SecureHash,
    vnp_TmnCode,
    vnp_TransactionNo,
    vnp_TransactionStatus,
    vnp_TxnRef,
  } = router.query;
  const mainCtx = useMainContext();
  const { cart } = mainCtx;

  const confirmCartPayment = useConfirmCart({
    address: cart?.data?.address,
    note: vnp_OrderInfo ? JSON.parse(vnp_OrderInfo as string).note : undefined,
    vnp_TransactionNo: (vnp_TransactionNo as string) || "",
    vnp_BankCode: (vnp_BankCode as string) || "",
    vnp_CardType: (vnp_CardType as string) || "",
    transactionDate: (vnp_PayDate as string) || "",
    vnp_ResponseCode: (vnp_ResponseCode as string) || "",
    listCartDetailID: vnp_OrderInfo
      ? JSON.parse(vnp_OrderInfo as string).selectedCart
      : undefined,
  });
  return (
    <>
      <Head>
        <title>Thanh toán thành công</title>
      </Head>
      <div className="grid place-items-center mb-10">
        <div className="xl:w-[1280px] lg:w-[1024px] w-full px-4 flex flex-col gap-5 mt-5 ">
          {confirmCartPayment.isFetching && (
            <div className="flex flex-col items-center gap-3">
              <Player
                className=" w-[200px]"
                src={waiting}
                keepLastFrame
                loop={true}
                autoplay
              />
              <div className="text-primary text-xl mt-[-10px]">
                Đang khởi tạo đơn hàng...
              </div>
            </div>
          )}
          {vnp_ResponseCode && (vnp_ResponseCode as string) !== "00" && (
            <div className="flex flex-col items-center gap-3">
              <Player
                className=" w-[250px]"
                src={notOkSticker}
                keepLastFrame
                loop={false}
                autoplay
              />
              <div className="text-red-400 text-xl mt-[-56px]">
                Thanh toán thất bại
              </div>
              <div className="">Vui lòng vào giỏ hàng để thanh toán lại.</div>
              <div className="flex md:flex-row flex-col items-center flex-wrap gap-3">
                <a href="/my-order/cart">
                  <Button type="primary">Vào giỏ hàng</Button>
                </a>

                <a href="/">
                  <Button type="default">Tiếp tục mua sắm</Button>
                </a>
              </div>
            </div>
          )}
          {confirmCartPayment.isSuccess && (
            <div className="flex flex-col items-center gap-3">
              <Player
                className=" w-[250px]"
                src={checkCompleted}
                keepLastFrame
                loop={false}
                autoplay
              />
              <div className="text-primary text-2xl mt-[-56px]">
                Thanh toán thành công
              </div>
              {router.query.vnp_TransactionNo ? (
                <div className="">
                  Mã giao dịch thanh toán:{" "}
                  <span className="font-bold">
                    {router.query.vnp_TransactionNo}
                  </span>
                </div>
              ) : null}
              <div>
                {RESPONSE_TRANSACTION_STATUS[vnp_TransactionStatus as string]}
              </div>
              <div>Sản phẩm đã được đưa vào trong đơn hàng của bạn</div>
              <div className="flex md:flex-row flex-col items-center flex-wrap gap-3">
                {confirmCartPayment.isSuccess && (
                  <a href="/account/order?itemType=receiver&status=0">
                    <Button type="primary">Xem chi tiết đơn hàng</Button>
                  </a>
                )}

                <a href="/">
                  <Button type="default">Tiếp tục mua sắm</Button>
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default PaymentSuccessPage;
