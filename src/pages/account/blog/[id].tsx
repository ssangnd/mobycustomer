import BlogForm from "@/components/form/blog";
import Head from "next/head";
import { useRouter } from "next/router";

const BlogEditPage = () => {
  const router = useRouter();
  const id = router.query.id as string;
  return (
    <>
      <Head>
        <title>Chỉnh sửa blog</title>
      </Head>
      <BlogForm id={id} />
    </>
  );
};

export default BlogEditPage;
