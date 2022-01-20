import { atom } from "recoil"
import  locationsData from "../data/locationsData"
const allLocationsData = locationsData;

const locationStates = atom({
    key:'locationStates',
    default: allLocationsData
})

export default locationStates