import base from "../base";
import axios from "@/common/js/fly";

const overview = base.overview;
const archives = base.archives;

const basic: object = {
  getOverview() {
		console.log(axios.get)
    return axios.get(`${overview}`);
  },
  getArchives() {
    return axios.get(archives)
  }
};

export default basic;

