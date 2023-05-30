import qs from "query-string";
import { mobyAxios } from "./axios";

class CommentMethod {
  async getCommentById(id: string, type: "ItemId" | "BlogId") {
    const res = await mobyAxios.get(
      `comment?${qs.stringify({
        [type]: id,
      })}`
    );
    return res.data;
  }

  async createComment(id: string, type: "item" | "blog", content: string) {
    const res = await mobyAxios.post("comment/create", {
      [type === "item" ? "itemId" : "blogId"]: id,
      commentContent: content,
    });
    return res.data;
  }

  async updateComment(id: string, content: string) {
    const res = await mobyAxios.put("comment", {
      commentId: id,
      commentContent: content,
    });
    return res.data;
  }

  async deleteComment(id) {
    const res = await mobyAxios.delete("comment/delete?CommentId=" + id);
    return res.data;
  }

  async createReply(id: string, content: string) {
    const res = await mobyAxios.post("reply/create", {
      commentId: id,
      replyContent: content,
    });
    return res.data;
  }
  async updateReply(id: string, content: string) {
    const res = await mobyAxios.put("reply", {
      replyId: id,
      replyContent: content,
    });
    return res.data;
  }
  async deleteReply(id) {
    const res = await mobyAxios.delete("reply/delete?ReplyId=" + id);
    return res.data;
  }
  async getCommentByCmtId(id: string) {
    const res = await mobyAxios.get("comment?CommentId=" + id);
    return res.data;
  }
  async getReplyById(id: string) {
    const res = await mobyAxios.get("reply?ReplyId=" + id);
    return res.data;
  }
}

export const commentService = new CommentMethod();
