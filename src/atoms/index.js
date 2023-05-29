import { atom } from "recoil";

export const detailChartStatus = atom({
  key: "detailChartStatus",
  default: {
    detailChartShow: false,
    studentName: "",
  },
});
