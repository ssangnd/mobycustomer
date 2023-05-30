import { useMainContext } from "@/components/context";
import { Splide, SplideSlide, SplideTrack } from "@splidejs/react-splide";
import { Card, Collapse, Divider } from "antd";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { FiMenu } from "react-icons/fi";
const CategoryPage = ({}) => {
  const mainContext = useMainContext();
  const router = useRouter();
  const id = router.query.id as string;

  useEffect(() => {}, []);
  return (
    <>
      <Head>
        <title>Moby | Nền tảng chia sẻ dành cho mẹ và bé</title>
      </Head>
      <div className="grid place-items-center mb-10">
        <div className="xl:w-[1280px] lg:w-[1024px] w-full px-4 flex flex-col gap-5 mt-5 ">
          <Splide
            hasTrack={false}
            options={{
              type: "loop",
              autoplay: true,
              perPage: 1,
              gap: 10,
            }}>
            <div className="custom-wrapper">
              <SplideTrack>
                {[0, 2, 3, 4, 4].map((item) => (
                  <SplideSlide>
                    <img
                      src="https://firebasestorage.googleapis.com/v0/b/fir-projecty-5.appspot.com/o/images%2F1068-1634314876-cover.png?alt=media&token=132163bf-2662-4e3b-a2ac-e018036c4d80"
                      alt="Image 1"
                      width={"100%"}
                      height={"100%"}
                      style={{ objectFit: "contain", borderRadius: 10 }}
                    />
                  </SplideSlide>
                ))}
              </SplideTrack>

              <div className="splide__arrows" />
            </div>
          </Splide>
          <div className="grid lg:grid-cols-7 grid-cols-3 gap-3">
            <div className="flex flex-col col-span-2 gap-2">
              <div className="font-bold text-xl uppercase flex items-center gap-3 text-primary">
                <FiMenu />
                Danh mục
              </div>
              <Collapse defaultActiveKey={[1]} ghost size="small">
                {mainContext.category.map((item) => (
                  <Collapse.Panel
                    className="bg-gray-100 "
                    header={
                      <div className="flex items-center gap-2">
                        <img
                          src={item.image}
                          alt={item.label}
                          width={18}
                          height={20}
                          style={{ objectFit: "contain" }}
                          className="w-50"></img>{" "}
                        {item.label}
                      </div>
                    }
                    key={item.id}>
                    {item.children?.map((subitem) => (
                      <div>{subitem.label}</div>
                    ))}
                  </Collapse.Panel>
                ))}
              </Collapse>
            </div>
            <div className="flex flex-col col-span-4">ihihi</div>
          </div>
          <Divider />

          <div className="grid md:grid-cols-4 grid-cols-2 gap-3">
            {[0, 2, 3, 3].map((item) => (
              <Link href="/product/1" className="no-underline">
                <Card hoverable bordered>
                  <div className="flex flex-col gap-2">
                    <img
                      src={
                        "https://firebasestorage.googleapis.com/v0/b/fir-projecty-5.appspot.com/o/images%2F919cddc28d20e7189e1763fb425c4785.png?alt=media&token=58eb247a-902d-4e93-b2b6-de81acc42805"
                      }
                      alt={"Product"}
                      width="100%"
                      height={150}
                      style={{ objectFit: "contain" }}
                      className="w-50"></img>
                    <div>Nước hoa Johnson's Baby Cho bé - dung tích 125ml</div>
                    <div className="flex flex-col">
                      <div className="font-bold text-2xl text-primary">
                        126.000 đ
                      </div>
                      <div className="flex justify-between">
                        <div>
                          bởi <span className="font-bold">Thai Lai</span>
                        </div>
                        <div>10/5/2022</div>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default CategoryPage;
