import { atom, selector } from "recoil";

const locationStates = atom({
  key: "locationStates",
  default: {
  routes: [
    {
      _id: "", //route id
      stops: [
        {
          placeId: "",
          coord: [0, 0],
          _id: "", //ignore this _id
        },
      ],
      __v: 0,
    },
  ],
  places: [
    {
      _id: "", // placeId in routes
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
  ],
},
});

export default locationStates;

export const routes = selector({
  key: "routes",
  get: ({ get }) => {
    const { places, routes } = get(locationStates);

    return routes.map((route) => {
      const routesObj: { _id: string; stops: any[] } = {
        _id: route._id,
        stops: [],
      };

      //stops: [{_id, coords}, {}] => [{_id, name, ...}, {_id,}]
      // Go through the stops and replace it with the object of the place
      routesObj.stops = route.stops.map((stop) => {
        return places.find((place: any) => stop.placeId === place._id);
      });

      return routesObj;
    });
  },
});
