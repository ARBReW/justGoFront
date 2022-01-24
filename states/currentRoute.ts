import { atom } from "recoil";

const currentRoute = atom({
  key: "currentRoute",
  default: {
    routeId: -1,
    stops: [
      {
        placeId: 0,
        name: "",
        coord: [0, 0],
        img: "",
        hours: { open: -1, close: -1 },
        type: "",
      },
      {
        placeId: 0,
        name: "",
        coord: [0, 0],
        img: "",
        hours: { open: -1, close: -1 },
        type: "",
      },
      {
        placeId: 0,
        name: "",
        coord: [0, 0],
        img: "",
        hours: { open: -1, close: -1 },
        type: "",
      },
      {
        placeId: 0,
        name: "",
        coord: [0, 0],
        img: "",
        hours: { open: -1, close: -1 },
        type: "",
      },
      {
        placeId: 0,
        name: "",
        coord: [0, 0],
        img: "",
        hours: { open: -1, close: -1 },
        type: "",
      },
    ],
  },
});

export default currentRoute;
