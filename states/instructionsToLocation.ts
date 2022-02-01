import { atom } from "recoil";

interface instructions {
  instructions: [
    {
      directions: string,
      distance: string,
      startCoord: number[],
      endCoord: number[],
      heading: number,
    }
  ];
}

const instructionsToLocation = atom<instructions>({
  key: "instructionsToLocation ",
  default: {
    instructions: [
      {
        directions: "",
        distance: "",
        startCoord: [0, 0],
        endCoord: [0, 0],
        heading: 0
      }
    ],
  },
});

export default instructionsToLocation;