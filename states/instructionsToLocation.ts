import { atom } from "recoil";

interface instructions {
  instructions: [{
    directions: string,
    distance: string
  }]; 
}

const instructionsToLocation = atom<instructions>({
  key: "instructionsToLocation ",
  default: {
    instructions: [{
      directions: "",
      distance: "" }],
  },
});

export default instructionsToLocation;