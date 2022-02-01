import { atom } from "recoil";

const placeDetail = atom({
  key: "placeDetail",
  default: {
    _id: "",
    google_Id: "",
    name: "",
    coord: [0, 0],
    img: "",
    hours: [
      "Monday: Open 24 hours",
      "Tuesday: Open 24 hours",
      "Wednesday: Open 24 hours",
      "Thursday: Open 24 hours",
      "Friday: Open 24 hours",
      "Saturday: Open 24 hours",
      "Sunday: Open 24 hours",
    ],
    type: "",
    __v: 0,
  },
});

export default placeDetail;
