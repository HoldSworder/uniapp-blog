import base from "../base";
import axios from "@/common/js/fly";

const basic: object = {
  login(data: user) {
    return axios.post(base.login, data)
  },
  getUserInfo(data: getInfo) {
    return axios.post(base.getUserInfo, data)
  },
  getAllUser() {
    return axios.get(base.getAllUser)
  },
  signUp(data: user) {
    return axios.post(base.signUp, data)
  },
  delUser(data: any) {
    return axios.post(base.delUser, data)
  }
};

export default basic;

interface user {
  name: string,
  password: string,
  code?: string | number
}

interface getInfo {
  token: string
}
