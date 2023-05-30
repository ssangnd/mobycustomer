import { useQuery } from "@tanstack/react-query";
import { requestService } from "services/axios/request";

export const useGetRequestBySharer = () => {
  return useQuery({
    queryKey: ["/get-request-by-sharer"],
    queryFn: () => {
      return requestService.getRequestBySharer();
    },
    keepPreviousData: true,
    refetchOnWindowFocus: false,
    retry: 0,
  });
};

export const useGetRequestByReveiver = () => {
  return useQuery({
    queryKey: ["/get-request-by-receiver"],
    queryFn: () => {
      return requestService.getRequestByReceiver();
    },
    keepPreviousData: true,
    refetchOnWindowFocus: false,
    retry: 0,
  });
};
export const useGetRequest = (type: "receiver" | "sharer") => {
  return useQuery({
    queryKey: ["/get-request-options", type],
    queryFn: () => {
      return type === "receiver"
        ? requestService.getRequestByReceiver()
        : requestService.getRequestBySharer();
    },
    keepPreviousData: true,
    refetchOnWindowFocus: false,
  });
};

export const useGetRequestById = (id?: string) => {
  return useQuery({
    queryKey: ["/request-details", id],
    queryFn: () => {
      if (!id) {
        throw new Error("[useItem] Invalid item_id parameter");
      }
      return requestService.getRequestById(id);
    },
    enabled: id ? true : false,
    refetchOnWindowFocus: false,
    keepPreviousData: true,

    retry: 3,
  });
};
