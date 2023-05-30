import { useUser } from "@/hooks/account";
import {
  useVNDistrictAddress,
  useVNProvinceAddress,
  useVNWardAddress,
} from "@/hooks/address";
import { useCart } from "@/hooks/cart";
import { useBlogCategory, useCategory } from "@/hooks/category";
import { useDisclosure } from "@mantine/hooks";
import { message } from "antd";
import type { AxiosError } from "axios";
import { onValue, ref } from "firebase/database";
import { createContext, useContext, useEffect, useState } from "react";
import { auth, database } from "services/firebase";
export const MainContext = createContext({
  userToken: undefined,
  setUserToken: undefined,
  user: undefined,
  cart: undefined,
  category: undefined,
  blogCategory: undefined,
  loading: undefined,
  vnAddress: {
    provinces: undefined,
    districts: undefined,
    wards: undefined,
  },
});

export const MainProvider = ({ children }) => {
  let V = {
    /* whatever you want */
  };
  const category = useCategory();
  const blogCategory = useBlogCategory();
  const user = useUser();
  const cart = useCart();
  const vnProvinceAddrs = useVNProvinceAddress();
  const vnDistrictAddrs = useVNDistrictAddress();
  const vnWardAddrs = useVNWardAddress();
  const authx = () => auth.currentUser;
  const [userToken, setUserToken] = useState<string>("");

  const [messageApi, contextHolder] = message.useMessage();

  const [countGetToken, setCount] = useDisclosure(false);
  useEffect(() => {
    if (!userToken) return;
    if (!authx()) {
      setCount.toggle();
      return;
    }
    authx()
      ?.getIdToken(true)
      .then(async (result) => {
        await localStorage.setItem("userToken", result);
      });
  }, [countGetToken, userToken]);

  useEffect(() => {
    const chatRef = ref(database, "post");
    onValue(chatRef, (snapshot) => {
      const data = snapshot.val();
    });
    setUserToken(localStorage.getItem("userToken"));
  }, []);

  useEffect(() => {
    if (user.error) {
      messageApi.info("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!");
    }
  }, [(user.error as AxiosError)?.response?.status]);

  return (
    <MainContext.Provider
      value={{
        userToken,
        cart,
        setUserToken,
        user: (user?.data?.userStatus ? user?.data : null) || null,
        category: category?.data || [],
        blogCategory: blogCategory?.data || [],
        loading: user.isFetching || category.isFetching,
        vnAddress: {
          provinces: vnProvinceAddrs.data || [],
          districts: vnDistrictAddrs.data || [],
          wards: vnWardAddrs.data || [],
        },
      }}>
      {contextHolder}
      {children}
    </MainContext.Provider>
  );
};

export const useMainContext = () => useContext(MainContext);
