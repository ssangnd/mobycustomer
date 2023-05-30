import axios from "axios";

class AddressMethod {
  async getVietNamCityData() {
    const res = await axios.get(
      "https://raw.githubusercontent.com/madnh/hanhchinhvn/master/dist/tinh_tp.json"
    );
    return Object.keys(res.data).map((key) => ({
      ...res.data[key],
      label: res.data[key].name_with_type,
      value: res.data[key].code,
    }));
  }
  async getVietNamDistrictData() {
    const res = await axios.get(
      "https://raw.githubusercontent.com/madnh/hanhchinhvn/master/dist/quan_huyen.json"
    );
    return Object.keys(res.data).map((key) => ({
      ...res.data[key],
      label: res.data[key].name_with_type,
      value: res.data[key].code,
    }));
  }
  async getVietNamWardData() {
    const res = await axios.get(
      "https://raw.githubusercontent.com/madnh/hanhchinhvn/master/dist/xa_phuong.json"
    );
    return Object.keys(res.data).map((key) => ({
      ...res.data[key],
      label: res.data[key].name_with_type,
      value: res.data[key].code,
    }));
  }
}

export const addressService = new AddressMethod();
