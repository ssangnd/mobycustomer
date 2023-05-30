import { useQuery } from "@tanstack/react-query";
import { blogService } from "services/axios/blog";

export const useBlog = (
  id: string,
  type: "BlogId" | "userId" | "categoryId",
  pageNumber?: number,
  pageSize?: number
) => {
  return useQuery({
    queryKey: ["/blog-details", id, type, pageNumber, pageSize],
    queryFn: () => {
      if (!id) {
        throw new Error("[useItem] Invalid user_id parameter");
      }
      return blogService.getBlogByIds({ id, type, pageNumber, pageSize });
    },
    enabled: id ? true : false,
    refetchOnWindowFocus: false,
    retry: 3,
  });
};

export const useBlogsForSearch = (data: any) => {
  return useQuery({
    queryKey: ["/blog-details", data],
    queryFn: () => {
      if (!data) {
        throw new Error("[useItem] Invalid user_id parameter");
      }
      return blogService.getBlogsForSearch(data);
    },
    enabled: data ? true : false,
    refetchOnWindowFocus: false,
    retry: 3,
  });
};

export const useBlogForSEO = (id: string) => {
  return useQuery({
    queryKey: ["/blog-details-seo", id],
    queryFn: () => {
      if (!id) {
        throw new Error("[useItem] Invalid user_id parameter");
      }
      return blogService.getBlogForSEOByID({ id });
    },
    enabled: id ? true : false,
    refetchOnWindowFocus: false,
    retry: 3,
  });
};

export const useBlogsByUserId = (pageNumber: number, pageSize: number) => {
  return useQuery({
    queryKey: ["/blogs-by-user-id", pageNumber, pageSize],
    queryFn: () => {
      return blogService.getBlogByUserID({ pageNumber, pageSize });
    },
    refetchOnWindowFocus: false,
    keepPreviousData: true,
  });
};
export const useBlogsBySpecificUserId = (
  userId: number,
  pageNumber: number,
  pageSize: number
) => {
  return useQuery({
    queryKey: ["/blogs-by-specific-user-id", userId, pageNumber, pageSize],
    queryFn: () => {
      return blogService.getBlogBySpecificUserID({
        userId,
        pageNumber,
        pageSize,
      });
    },
    refetchOnWindowFocus: false,
    keepPreviousData: true,
  });
};

export const useAllBlogRecently = (index?: number, pageSize?: number) => {
  return useQuery({
    queryKey: ["/blogs-recently", index, pageSize],
    queryFn: () => {
      return blogService.getAllBlogRecently(index, pageSize);
    },
    enabled: index && pageSize ? true : false,
    refetchOnWindowFocus: false,
  });
};
