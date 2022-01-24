import { atom, selector, useRecoilValue } from "recoil";


const userGeoLocation = atom({
    key: "userGeoLocation",
    default: {
        coordinates: {
            lat: 0,
            lng: 0
          }
    }
})

export default userGeoLocation;