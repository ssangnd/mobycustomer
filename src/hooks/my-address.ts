import { useQuery } from "@tanstack/react-query";
import { myAddressService } from "services/axios/my-address";

export const useMyAddress = () => {
  return useQuery({
    queryKey: ["/get-user-address-by-me"],
    queryFn: () => {
      if (localStorage.getItem("userToken"))
        return myAddressService.getMyAddress();
      return null;
    },
    keepPreviousData: true,
    refetchOnWindowFocus: false,
    retry: 0,
  });
};
