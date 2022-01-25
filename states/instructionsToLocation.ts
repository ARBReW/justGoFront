import { atom } from "recoil";

interface instructions {
  instructions: []; 
}

const instructionsToLocation = atom<instructions>({
  key: "instructionsToLocation ",
  default: {
    instructions: [],
  },
});

export default instructionsToLocation;