import { useQuery } from "@tanstack/react-query";
import { addressService } from "services/axios/address";

export const useVNProvinceAddress = () => {
  return useQuery({
    queryKey: ["/get-address-city-viet-nam"],
    queryFn: () => {
      return addressService.getVietNamCityData();
    },
    keepPreviousData: true,
    refetchOnWindowFocus: false,
  });
};
export const useVNDistrictAddress = () => {
  return useQuery({
    queryKey: ["/get-address-district-viet-nam"],
    queryFn: () => {
      return addressService.getVietNamDistrictData();
    },
    keepPreviousData: true,
    refetchOnWindowFocus: false,
  });
};
export const useVNWardAddress = () => {
  return useQuery({
    queryKey: ["/get-address-ward-viet-nam"],
    queryFn: () => {
      return addressService.getVietNamWardData();
    },
    keepPreviousData: true,
    refetchOnWindowFocus: false,
  });
};
