import { mobyAxios } from "./axios";

class CategoryMethod {
  async getCategoryList() {
    // const res = await mobyAxios.get("category-sub");
    const res = await mobyAxios.get("Category/GetAllCategory");

    return res.data
      ?.filter((item) => item.categoryStatus)
      .map((item) => ({
        key: item.categoryId,
        label: item.categoryName,
        value: item.categoryId,
        image: item.categoryImage,
        children: item.subCategoryVMs.map((subitem) => ({
          key: subitem.subCategoryId,
          label: subitem.subCategoryName,
          value: subitem.subCategoryId,
        })),
      }));
  }
  async getBlogCategoryList() {
    const res = await mobyAxios.get("blogcategory/all");
    return res.data?.map((item) => ({
      label: item.blogCategoryName,
      value: item.blogCategoryId,
    }));
  }
}

export const categoryService = new CategoryMethod();
