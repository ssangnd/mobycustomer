import { useBannerList } from "@/hooks/banner";
import { Splide, SplideSlide, SplideTrack } from "@splidejs/react-splide";
import Link from "next/link";
import { useMainContext } from "../context";

export const Banner = () => {
  const mainContext = useMainContext();
  const bannerList = useBannerList();

  return (
    <>
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
            {bannerList.data?.map((item) => (
              <SplideSlide>
                <Link href={item.link} legacyBehavior>
                  <a target="_blank">
                    <img
                      src={item.image}
                      alt="Image 1"
                      width={"100%"}
                      height={"100%"}
                      style={{ objectFit: "contain", borderRadius: 10 }}
                    />
                  </a>
                </Link>
              </SplideSlide>
            ))}
          </SplideTrack>

          <div className="splide__arrows" />
        </div>
      </Splide>
    </>
  );
};
