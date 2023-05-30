import { useQuery } from "@tanstack/react-query";
import { commentService } from "services/axios/comment";

export const useComment = (id: string, type: "blog" | "item") => {
  return useQuery({
    queryKey: ["/comment-details", id, type],
    queryFn: () => {
      if (!id) {
        throw new Error("[useItem] Invalid user_id parameter");
      }
      return commentService.getCommentById(
        id,
        type === "blog" ? "BlogId" : "ItemId"
      );
    },
    enabled: id ? true : false,
    refetchOnWindowFocus: false,
    retry: 3,
  });
};

export const useGetCommentById = (id?: string) => {
  return useQuery({
    queryKey: ["/comment-detail", id],
    queryFn: () => {
      if (!id) {
        throw new Error("[useItem] Invalid item_id parameter");
      }
      return commentService.getCommentByCmtId(id);
    },
    enabled: id ? true : false,
    refetchOnWindowFocus: false,
    retry: 3,
  });
};
export const useGetReplyById = (id?: string) => {
  return useQuery({
    queryKey: ["/reply-detail", id],
    queryFn: () => {
      if (!id) {
        throw new Error("[useItem] Invalid item_id parameter");
      }
      return commentService.getReplyById(id);
    },
    enabled: id ? true : false,
    refetchOnWindowFocus: false,
    retry: 3,
  });
};
