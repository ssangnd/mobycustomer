import { useQuery } from "@tanstack/react-query";
import { categoryService } from "services/axios";

export const useCategory = () => {
  return useQuery({
    queryKey: ["/get-category"],
    queryFn: () => {
      return categoryService.getCategoryList();
    },
    keepPreviousData: true,
    refetchOnWindowFocus: false,
  });
};
export const useBlogCategory = () => {
  return useQuery({
    queryKey: ["/get-blog-category"],
    queryFn: () => {
      return categoryService.getBlogCategoryList();
    },
    keepPreviousData: true,
    refetchOnWindowFocus: false,
  });
};
