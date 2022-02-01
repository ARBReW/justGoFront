import { atom } from "recoil";

interface place {
  _id: string,
  name: string,
  coord: number[],
  img: string,
  hours: string[],
  type: string,
  __v: number
}


export interface viewedStopsInterface {
  viewedStops: place[];
  isViewed: boolean;
}

const viewedStops = atom<viewedStopsInterface>({
  key: "viewedStops",
  default: {
    viewedStops: [],
    isViewed: false,
  },
});

export default viewedStops;