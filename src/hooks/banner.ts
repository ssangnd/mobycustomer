import { useQuery } from "@tanstack/react-query";
import { bannerService } from "services/axios/banner";

export const useBannerList = () => {
  return useQuery({
    queryKey: ["/banner-list"],
    queryFn: () => {
      return bannerService.getBannerList();
    },
    refetchOnWindowFocus: false,
    keepPreviousData: true,
  });
};
