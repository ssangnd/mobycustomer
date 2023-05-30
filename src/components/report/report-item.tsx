import { useItem } from "@/hooks/product";
import { useReportStatusByID } from "@/hooks/report";
import { Splide, SplideSlide, SplideTrack } from "@splidejs/react-splide";
import { Alert, Card, Skeleton } from "antd";
import dayjs from "dayjs";
import numeral from "numeral";
import { createRef, useEffect } from "react";
import { FiChevronRight } from "react-icons/fi";
import { useMainContext } from "../context";

export const ReportItem = ({ id }: { id: string }) => {
  const itembyId = useItem(id);

  const reportStatusByID = useReportStatusByID({
    id: Number.parseInt(id),
    type: 0,
  });
  const mainCtx = useMainContext();

  const mainRef = createRef<Splide>();

  const thumbsRef = createRef<Splide>();

  useEffect(() => {
    if (mainRef.current && thumbsRef.current && thumbsRef.current.splide) {
      mainRef.current.sync(thumbsRef.current.splide);
    }
  }, []);

  if (!itembyId.data) return <Skeleton />;

  return (
    <div className="flex flex-col mb-4">
      {!itembyId.data?.itemStatus && (
        <Alert
          message={<div className="text-red-500">Sản phẩm đã bị ẩn</div>}
          type="error"
          showIcon
          className="mb-2"
        />
      )}
      <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
        <div>
          {" "}
          <Splide
            ref={mainRef}
            hasTrack={false}
            options={{
              type: "loop",
              autoplay: true,
              perPage: 1,
              gap: 10,
            }}>
            <SplideTrack>
              {JSON.parse(itembyId?.data?.image)?.map((item) => (
                <SplideSlide>
                  <img
                    src={item}
                    alt={item}
                    width={"100%"}
                    height={300}
                    style={{ objectFit: "cover", borderRadius: 10 }}
                  />
                </SplideSlide>
              ))}
            </SplideTrack>
          </Splide>
          <Splide
            ref={thumbsRef}
            hasTrack={false}
            options={{
              type: "slide",
              rewind: true,
              gap: "1rem",
              pagination: false,
              fixedWidth: 110,
              fixedHeight: 70,
              cover: true,
              focus: "center",
              isNavigation: true,
              arrows: false,
            }}>
            <SplideTrack className="mt-2">
              {JSON.parse(itembyId.data?.image)?.map((item) => (
                <SplideSlide>
                  <img
                    src={item}
                    alt={item}
                    width={"100%"}
                    height={70}
                    style={{ objectFit: "cover", borderRadius: 10 }}
                  />
                </SplideSlide>
              ))}
            </SplideTrack>
          </Splide>
        </div>
        <div className="flex flex-col gap-1">
          <div className="font-bold text-2xl">{itembyId.data?.itemTitle}</div>
          <div className="flex items-center">
            <div className="text-start align-text-top px-0">
              {itembyId.data.categoryName}
            </div>
            <div className="text-gray-500 ">
              <FiChevronRight />
            </div>
            <div className="text-start align-text-top px-0">
              {itembyId.data.subCategoryName}
            </div>
          </div>

          <div className="whitespace-nowrap text-3xl text-primary font-bold mt-4">
            {itembyId.data?.itemSalePrice !== 0 ? (
              <span>
                &#8363; {numeral(itembyId.data?.itemSalePrice).format("0,0")}
              </span>
            ) : (
              "Miễn phí"
            )}
          </div>

          <div className="flex gap-3 mt-3 flex-wrap">
            {/* <div className="flex flex-row gap-2">
                    <Button
                      type="primary"
                      className="bg-white text-primary border-primary hover:border-white font-bold"
                      size="large"
                      onClick={handlers.decrement}>
                      -
                    </Button>
                    <InputNumber
                      className="quantity-item-input"
                      size="large"
                      value={count}
                      style={{ width: 70 }}
                      onChange={(value: number) => handlers.set(value || 0)}
                      controls={false}></InputNumber>
                    <Button
                      type="primary"
                      rootClassName="text-center"
                      className="bg-white text-primary border-primary hover:border-white font-bold"
                      size="large"
                      onClick={handlers.increment}>
                      +
                    </Button>
                  </div> */}
          </div>
          <div className="italic text-sm text-gray-400">
            * Số lượng hàng còn lại: {itembyId.data.itemShareAmount}
          </div>
        </div>
      </div>
      <Card className="mt-4" title="Mô tả sản phẩm">
        {itembyId.data.itemDetailedDescription}
      </Card>
      <Card className="mt-4" title="Chi tiết sản phẩm">
        <div className="grid  lg:grid-cols-2 grid-cols-1 items-center gap-2">
          <div className="flex flex-wrap items-center lg:col-span-2 grid-cols-1">
            <span className="text-gray-500 whitespace-nowrap ">Danh mục:</span>
            <div className="flex items-center ml-1">
              <div className="no-underline">{itembyId.data.categoryName}</div>
              <div className="text-gray-500">
                <FiChevronRight />
              </div>
              <div className="no-underline">
                {itembyId.data.subCategoryName}
              </div>
            </div>
          </div>
          <div>
            <span className="text-gray-500 mr-1"> Tình trạng:</span>
            {itembyId.data?.itemQuanlity}
          </div>
          <div>
            <span className="text-gray-500 mr-1"> Khối lượng:</span>
            {itembyId.data?.itemMass} gram
          </div>
          <div>
            <span className="text-gray-500 mr-1"> Kích thước hàng:</span>
            {itembyId.data?.itemSize ? "Hàng cồng kềnh" : "Hàng nhỏ"}
          </div>
          <div>
            <span className="text-gray-500 mr-1"> Thể loại:</span>
            {itembyId.data?.share ? "Đơn chia sẻ" : "Đơn hỗ trợ"}
          </div>

          <div>
            <span className="text-gray-500 mr-1"> Ngày khởi tạo:</span>
            {dayjs(itembyId.data?.itemDateCreated).format("DD-MM-YYYY HH:mm")}
          </div>

          {itembyId.data?.itemExpiredTime ? (
            <div>
              <span className="text-gray-500 mr-1"> Ngày hết hạn:</span>
              {dayjs(itembyId.data?.itemExpiredTime).format("DD-MM-YYYY HH:mm")}
            </div>
          ) : null}

          <div>
            <span className="text-gray-500 mr-1"> Tạo bởi:</span>
            {itembyId.data?.userName}
          </div>
        </div>
      </Card>
    </div>
  );
};
