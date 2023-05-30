import ProductForm from "@/components/form/product";
import Head from "next/head";
import { useRouter } from "next/router";

const ProductAddPage = () => {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Thêm mới sản phẩm</title>
      </Head>
      <ProductForm share={router.query.type === "share" ? true : false} />
    </>
  );
};

export default ProductAddPage;
