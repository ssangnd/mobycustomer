import { useComment } from "@/hooks/comment";
import commentSticker from "@/sticker/comment.json";
import { Player } from "@lottiefiles/react-lottie-player";
import { useMutation } from "@tanstack/react-query";
import { commentService } from "services/axios/comment";
import { useMainContext } from "../context";
import { CommentItem } from "./comment";
import { CommentInput } from "./comment-input";
export const CommentTee = ({
  id,
  type,
}: {
  id: string;
  type: "blog" | "item";
}) => {
  const comment = useComment(id, type);
  const mainCtx = useMainContext();

  const createCommentMutation = useMutation(
    (value: string) => commentService.createComment(id, type, value),
    {
      onSuccess: async (data) => {
        comment.refetch();
      },
    }
  );

  const createCommentReplyMutation = useMutation(
    (value: any) => commentService.createReply(value.id, value.content),
    {
      onSuccess: async (data) => {
        comment.refetch();
      },
    }
  );

  const updateCommentMutation = useMutation(
    (value: any) => commentService.updateComment(value.id, value.content),
    {
      onSuccess: async (data) => {
        comment.refetch();
      },
    }
  );

  const updateReplyMutation = useMutation(
    (value: any) => commentService.updateReply(value.id, value.content),
    {
      onSuccess: async (data) => {
        comment.refetch();
      },
    }
  );

  const deleteCommentMutation = useMutation(
    (value: any) => commentService.deleteComment(value),
    {
      onSuccess: async (data) => {
        comment.refetch();
      },
    }
  );
  const deleteReplyMutation = useMutation(
    (value: any) => commentService.deleteReply(value),
    {
      onSuccess: async (data) => {
        comment.refetch();
      },
    }
  );

  return (
    <>
      {/* <List
        dataSource={comment.data || []}
        renderItem={(item: any) => <CommentItem data={item} />}></List> */}
      {(comment.data || []).map((item: any) => (
        <CommentItem
          key={`comment-${item.commentId}`}
          data={item}
          isLoading={
            createCommentReplyMutation.isLoading ||
            updateCommentMutation.isLoading ||
            updateReplyMutation.isLoading
          }
          onSubmit={({ id, content }) => {
            createCommentReplyMutation.mutate({ id, content });
          }}
          onEditSubmit={({ id, content, type }) => {
            type === "comment"
              ? updateCommentMutation.mutate({ id, content })
              : updateReplyMutation.mutate({ id, content });
          }}
          onDelete={({ id, type }) =>
            type === "comment"
              ? deleteCommentMutation.mutate(id)
              : deleteReplyMutation.mutate(id)
          }
        />
      ))}
      {!comment.data?.length ? (
        <div className="flex flex-col items-center justify-center">
          <Player className="w-[170px]" src={commentSticker} loop autoplay />
          <div className="text-gray-400 mb-5">
            Hãy là người đầu tiên bình luận nhé!!!
          </div>
        </div>
      ) : null}
      <CommentInput
        type="comment"
        isLoading={createCommentMutation.isLoading}
        onSubmit={(value) => {
          createCommentMutation.mutate(value);
        }}
      />
    </>
  );
};
