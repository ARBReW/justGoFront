import { atom } from "recoil";

const currentRoute = atom({
  key: "currentRoute",
  default: [
    {
      placeId: 0,
      name: "",
      coord: [],
      hours: { open: -1, close: -1 },
      type: "",
    },
    {
      placeId: 0,
      name: "",
      coord: [],
      hours: { open: -1, close: -1 },
      type: "",
    },
    {
      placeId: 0,
      name: "",
      coord: [],
      hours: { open: -1, close: -1 },
      type: "",
    },
    {
      placeId: 0,
      name: "",
      coord: [],
      hours: { open: -1, close: -1 },
      type: "",
    },
    {
      placeId: 0,
      name: "",
      coord: [],
      hours: { open: -1, close: -1 },
      type: "",
    },
  ],
});

export default currentRoute;
