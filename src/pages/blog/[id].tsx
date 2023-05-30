import { BreadcrumbBase } from "@/components/breadcrumb";
import { CommentTee } from "@/components/commentee";
import { useMainContext } from "@/components/context";
import { BlogItem } from "@/components/items/blog-item";
import { ReportSection } from "@/components/report";
import { useUserById } from "@/hooks/account";
import { useAllBlogRecently, useBlog, useBlogForSEO } from "@/hooks/blog";
import { queryClient } from "@/libs/react-query/query-client";
import { dehydrate } from "@tanstack/react-query";
import { Avatar, Button, Card, Divider, Tag } from "antd";
import dayjs from "dayjs";
import Head from "next/head";
import { useRouter } from "next/router";
import { FiClock } from "react-icons/fi";
import { blogService } from "services/axios/blog";

const BlogDetailPage = () => {
  const router = useRouter();
  const id = router.query.id as string;
  const mainContext = useMainContext();

  const itemSEO = useBlogForSEO(id);
  const itembyId = useBlog(id, "BlogId");

  const userbyId = useUserById(itembyId?.data?.userId);
  const getBlogsByCategoryId = useBlog(
    itembyId.data?.blogCategoryId,
    "categoryId",
    1,
    8
  );

  const getAllBlogRecently = useAllBlogRecently(1, 10);

  return (
    <>
      <Head>
        <title>{itemSEO.data?.blogTitle}</title>
        <meta
          property="og:title"
          content={`${itemSEO.data?.blogTitle} | Moby`}
        />
        <meta property="og:type" content="article" />
        <meta property="og:image" content={itemSEO.data?.image} />
        <meta
          property="og:url"
          content={`https://moby-customer.vercel.app/blog/${id}`}
        />
      </Head>
      <div className="grid place-items-center mb-4">
        <div className="xl:w-[1280px] lg:w-[1024px] w-full px-4 flex flex-col gap-5 ">
          <div className="flex justify-between flex-wrap">
            <BreadcrumbBase
              items={[
                { href: "/blog", name: "Blog" },
                { name: itembyId.data?.blogTitle },
              ]}
            />
            <ReportSection id={id} category="blog">
              <Button type="text" size="small" className="text-gray-400">
                Tố cáo
              </Button>
            </ReportSection>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
            <div className="col-span-3">
              <div className="font-bold text-2xl">
                {itembyId.data?.blogTitle}{" "}
                <Tag color="magenta" className="ml-3">
                  {
                    mainContext.blogCategory.find(
                      (item) => item.value === itembyId.data?.blogCategoryId
                    )?.label
                  }
                </Tag>
              </div>
              <div className="text-gray-500 flex items-center gap-2 mt-2">
                <FiClock />{" "}
                {dayjs(itembyId.data?.blogDateCreate).format(
                  "DD-MM-YYYY HH:mm"
                )}
              </div>
              <div className="mt-3 whitespace-pre-wrap">
                {itembyId.data?.blogDescription}
              </div>
              <img
                src={itembyId.data?.image}
                alt="News"
                style={{
                  width: "100%",
                  height: 250,
                  objectFit: "cover",
                  borderRadius: 20,
                }}
                className="mt-5"
              />
              <Divider />
              <div className="flex gap-2">
                <Avatar size="large" src={userbyId.data?.userImage} />{" "}
                <div className="flex flex-col gap-1">
                  <div className="font-bold">Tác giả</div>
                  <div className="">{userbyId.data?.userName}</div>
                </div>
              </div>
              <Divider />

              <div
                dangerouslySetInnerHTML={{
                  __html: itembyId.data?.blogContent,
                }}
              />
            </div>
            <div className="flex flex-col gap-2">
              <div>Bài viết liên quan</div>
              {getBlogsByCategoryId.data?.listModel.map((item) => (
                <BlogItem item={item} key={`blog-${item.blogId}`} />
              ))}
            </div>
          </div>
          <div className="grid grid-cols-5">
            <Card className="mt-4 md:col-span-3 col-span-5" title="Bình luận">
              <CommentTee id={id} type="blog" />
            </Card>
          </div>
          <div>Bài viết gần đây</div>

          <div className="grid md:grid-cols-3 grid-cols-1 place-items-center items-stretch gap-3 content-center place-content-center">
            {getAllBlogRecently.data?.listModel?.map((item, index) => (
              <BlogItem item={item} key={`blog-${item.blogId}`} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export async function getStaticProps({ params }) {
  const { id } = params;
  await queryClient.prefetchQuery({
    queryKey: ["/blog-details-seo", id],
    queryFn: () => {
      if (!id) {
        throw new Error("[useItem] Invalid item_id parameter");
      }
      return blogService.getBlogForSEOByID({ id });
    },
  });
  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: "blocking",
  };
}

export default BlogDetailPage;
