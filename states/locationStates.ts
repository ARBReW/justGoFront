import { atom, selector, useRecoilValue } from "recoil";
import locationsData from "../data/locationsData";
const allLocationsData = locationsData;

const locationStates = atom({
  key: "locationStates",
  default: allLocationsData,
});

export default locationStates;

export const routes = selector({
  key: "routes",
  get: ({ get }) => {
    const { places, routes } = get(locationStates);

    return routes.map((route) => {
      const routesObj: { routeId: number; stops: any[] } = {
        routeId: route.routeId,
        stops: [],
      };

      routesObj.stops = route.stops.map((placeId) => {
        return places.find((place) => placeId === place.placeId);
      });

      return routesObj;
    });
  },
});
