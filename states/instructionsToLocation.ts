import { atom } from "recoil";

interface instructions {
  instructions: string []; 
}

const instructionsToLocation = atom<instructions>({
  key: "instructionsToLocation ",
  default: {
    instructions: [],
  },
});

export default instructionsToLocation;