import { useQuery } from "@tanstack/react-query";
import { productService } from "services/axios";

export const useItem = (id?: string) => {
  return useQuery({
    queryKey: ["/item-details", id],
    queryFn: () => {
      if (!id) {
        throw new Error("[useItem] Invalid item_id parameter");
      }
      return productService.getProductById(id);
    },
    enabled: id ? true : false,
    refetchOnWindowFocus: false,
    retry: 3,
  });
};
export const useItemDynamicFilter = (data) => {
  return useQuery({
    queryKey: ["/item-details-dynamic", data],
    queryFn: () => {
      if (!data) {
        throw new Error("[useItem] Invalid item_id parameter");
      }
      let value = {};
      Object.keys(data).forEach((key) => {
        if (data[key]) value[key] = data[key];
      });
      return productService.getItemDynamicFilters(value);
    },
    enabled: data ? true : false,
    refetchOnWindowFocus: false,
    retry: 3,
  });
};
export const useItemForSEO = (id?: string) => {
  return useQuery({
    queryKey: ["/item-details-seo", id],
    queryFn: () => {
      if (!id) {
        throw new Error("[useItem] Invalid item_id parameter");
      }
      return productService.getProductForSEOByID({ id });
    },
    enabled: id ? true : false,
    refetchOnWindowFocus: false,
    retry: 3,
  });
};

export const useItemsByUserId = (userId?: string, share?: boolean) => {
  return useQuery({
    queryKey: ["/items-by-user-id", userId, share],
    queryFn: () => {
      if (!userId) {
        throw new Error("[useItemsByUserId] Invalid id parameter");
      }
      return productService.getProductByUserID(userId, share);
    },
    enabled: userId !== undefined,
    refetchOnWindowFocus: false,
  });
};
export const useShareItemRecently = (index?: number, pageSize?: number) => {
  return useQuery({
    queryKey: ["/share-items-recently", index, pageSize],
    queryFn: () => {
      return productService.getAllShareProductRecently(index, pageSize);
    },
    enabled: index && pageSize ? true : false,
    refetchOnWindowFocus: false,
  });
};
export const useShareItemFree = (index?: number, pageSize?: number) => {
  return useQuery({
    queryKey: ["/share-items-free", index, pageSize],
    queryFn: () => {
      return productService.getAllShareProductFree(index, pageSize);
    },
    enabled: index && pageSize ? true : false,
    refetchOnWindowFocus: false,
  });
};
export const useShareItemNearYou = (
  index?: number,
  pageSize?: number,
  location?: string
) => {
  return useQuery({
    queryKey: ["/share-items-free", index, pageSize, location],
    queryFn: () => {
      return productService.getAllShareProductNearYou(
        index,
        pageSize,
        location
      );
    },
    enabled: index && pageSize && location ? true : false,
    refetchOnWindowFocus: false,
  });
};

export const useItemRecommend = (index?: number, pageSize?: number) => {
  return useQuery({
    queryKey: ["/item-recommend", index, pageSize],
    queryFn: () => {
      return productService.getAllItemRecommend(index, pageSize);
    },
    enabled: index && pageSize ? true : false,
    refetchOnWindowFocus: false,
  });
};
export const useItemRecommendByBaby = (
  index?: number,
  pageSize?: number,
  babyID?: number
) => {
  return useQuery({
    queryKey: ["/item-recommend-baby", index, pageSize, babyID],
    queryFn: () => {
      return productService.getAllItemRecommendByBaby(index, pageSize, babyID);
    },
    enabled: index && pageSize && babyID ? true : false,
    refetchOnWindowFocus: false,
  });
};
export const useCreateRecord = ({
  userId,
  categoryId,
  subCategoryId,
  titleName,
}: {
  userId: number;
  categoryId?: number;
  subCategoryId?: number;
  titleName?: string;
}) => {
  return useQuery({
    queryKey: [
      "/item-recommend-create-record",
      userId,
      categoryId,
      subCategoryId,
      titleName,
    ],
    queryFn: () => {
      return productService.createRecordUSerSearch({
        userId,
        categoryId,
        subCategoryId,
        titleName,
      });
    },
    enabled:
      userId && (categoryId || subCategoryId || titleName) ? true : false,
    refetchOnWindowFocus: false,
  });
};
