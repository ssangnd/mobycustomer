import { BreadcrumbBase } from "@/components/breadcrumb";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { useCounter, useViewportSize, useWindowScroll } from "@mantine/hooks";
import Head from "next/head";
const DetailOrderPage = () => {
  const [count, handlers] = useCounter(0, { min: 0, max: 10 });
  const [scroll, scrollTo] = useWindowScroll();
  const { height, width } = useViewportSize();
  return (
    <>
      <Head>
        <title>Đơn hàng</title>
      </Head>
      <div className="grid place-items-center mb-10">
        <div className="xl:w-[1280px] lg:w-[1024px] w-full px-4 flex flex-col gap-5 mt-5 ">
          <BreadcrumbBase
            items={[
              {
                name: "Đơn hàng",
                icon: <ShoppingCartOutlined />,
              },
            ]}
          />
        </div>
      </div>
    </>
  );
};

export default DetailOrderPage;
