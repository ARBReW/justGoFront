import { atom } from "recoil";

const placeDetail = atom({
  key: "placeDetail",
  default: {
    placeId: 0,
    name: "",
    coord: [],
    hours: { open: -1, close: -1 },
    type: "",
  },
});

export default placeDetail;
