import ProductForm from "@/components/form/product";
import Head from "next/head";
import { useRouter } from "next/router";

const ProductEditPage = () => {
  const router = useRouter();
  const id = router.query.id as string;

  return (
    <>
      <Head>
        <title>Chỉnh sửa sản phẩm</title>
      </Head>
      <ProductForm id={id} />
    </>
  );
};

export default ProductEditPage;
