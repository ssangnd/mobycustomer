import { useQuery } from "@tanstack/react-query";
import { accountService } from "services/axios";

export const useUser = () => {
  return useQuery({
    queryKey: ["/get-user"],
    queryFn: () => {
      if (localStorage.getItem("userToken"))
        return accountService.getUserInfo();
      return null;
    },
    keepPreviousData: true,
    refetchOnWindowFocus: false,
    retry: 0,
  });
};

export const useBaby = () => {
  return useQuery({
    queryKey: ["/get-baby-by-user"],
    queryFn: () => {
      if (localStorage.getItem("userToken"))
        return accountService.getBabyInfo();
      return null;
    },
    keepPreviousData: true,
    refetchOnWindowFocus: false,
    retry: 0,
  });
};
export const useUserById = (id: number) => {
  return useQuery({
    queryKey: ["/get-user-by-id", id],
    queryFn: () => {
      return accountService.getUserInfoById(id);
    },
    enabled: id ? true : false,
    keepPreviousData: true,
    refetchOnWindowFocus: false,
  });
};
