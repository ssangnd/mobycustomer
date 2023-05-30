import qs from "query-string";
import { mobyAxios } from "./axios";

class BlogMethod {
  async getBlogByIds({
    id,
    type,
    pageNumber,
    pageSize,
  }: {
    id: string;
    type: "BlogId" | "userId" | "categoryId";
    pageNumber?: number;
    pageSize?: number;
  }) {
    const res = await mobyAxios.get(
      `blog?${qs.stringify({
        [type]: id,
        pageNumber,
        pageSize,
      })}`
    );
    return res.data;
  }
  async getBlogsForSearch(data: any) {
    const res = await mobyAxios.get(`blog?${qs.stringify(data)}`);
    return res.data;
  }

  async getBlogForSEOByID({ id }: { id: string }) {
    const res = await this.getBlogByIds({ id, type: "BlogId" });
    const { blogTitle, blogStatus, image } = res;
    return { blogTitle, blogStatus, image };
  }

  async getBlogByUserID({
    pageNumber,
    pageSize,
  }: {
    pageNumber?: number;
    pageSize?: number;
  }) {
    const res = await mobyAxios.get(
      `useraccount/blog?${qs.stringify({
        pageNumber,
        pageSize,
      })}`
    );
    return res.data;
  }

  async getBlogBySpecificUserID({
    userId,
    pageNumber,
    pageSize,
  }: {
    userId?: number;
    pageNumber?: number;
    pageSize?: number;
  }) {
    const res = await mobyAxios.get(
      `/blog?${qs.stringify({
        userId,
        pageNumber,
        pageSize,
      })}`
    );
    return res.data;
  }

  async saveBlog(data) {
    const operator = {
      operate: data.blogId === undefined ? mobyAxios.post : mobyAxios.put,
      params: data.blogId ?? "",
    };
    const res = await operator.operate(
      operator.params ? "blog" : "blog/create",
      data
    );
    return res.data;
  }

  async deleteBlog(blogId) {
    const res = await mobyAxios.patch(`blog/delete`, { blogId });
    return res.data;
  }
  async getAllBlogRecently(index: number, pageSize: number) {
    const res = await mobyAxios.get(
      `blog/all?pageNumber=${index}&pageSize=${pageSize}`
    );
    return res.data;
  }
}

export const blogService = new BlogMethod();
