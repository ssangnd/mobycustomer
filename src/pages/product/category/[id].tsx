import { CheckCircleOutlined } from "@ant-design/icons";
import { useCounter } from "@mantine/hooks";
import { Button } from "antd";
import Head from "next/head";
import Link from "next/link";
const ProductListByCategoryPage = () => {
  const [count, handlers] = useCounter(0, { min: 0, max: 10 });

  return (
    <>
      <Head>
        <title>Category</title>
      </Head>
      <div className="grid place-items-center mb-10">
        <div className="xl:w-[1280px] lg:w-[1024px] w-full px-4 flex flex-col gap-5 mt-5 ">
          <div className="flex flex-col items-center gap-3">
            <CheckCircleOutlined
              size={30}
              className="text-primary text-[70px]"
            />
            <div className="text-primary text-2xl">Thanh toán thành công</div>
            <div className="">
              Mã đơn hàng: <span className="font-bold">1239712983</span>{" "}
            </div>
            <div className="flex md:flex-row flex-col items-center flex-wrap gap-3">
              <Link href="/order/detail/121312">
                <Button type="primary">Xem chi tiết đơn hàng</Button>
              </Link>
              <Link href="/">
                <Button type="default">Tiếp tục mua sắm</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductListByCategoryPage;
