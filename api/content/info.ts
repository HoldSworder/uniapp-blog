import base from "../base";
import axios from "@/common/js/fly";

const info = base.info

interface info {
  id: number,
  content?: string,
  text?: string,
  title?: string
}

const infoObj: object = {
  get(data: info) {
    console.log(data)
    return axios.get(`${info}`, data);
  },
  update(data: info) {
    return axios.put(`${info}/${data.id}`, data);
  },
  create(data: info) {
    return axios.post(`${info}`, data);
  },
  delete(data: info) {
    return axios.delete(`${info}/${data.id}`)
  }
};

export default infoObj;