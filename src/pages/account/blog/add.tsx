import BlogForm from "@/components/form/blog";
import Head from "next/head";

const BlogAddPage = () => {
  return (
    <>
      <Head>
        <title>Thêm mới blog</title>
      </Head>
      <BlogForm />
    </>
  );
};

export default BlogAddPage;
