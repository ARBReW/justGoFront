import { atom } from "recoil";

interface place {
  placeId: number;
  name: string;
  coord: number[];
  img: string;
  hours: {
    open: number;
    close: number;
  };
  type: string;
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