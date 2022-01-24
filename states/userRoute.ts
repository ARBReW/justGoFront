import { atom } from "recoil";

interface place {
    placeId: number,
    name: string,
    coord: number[],
    img: string,
    hours: {
        open: number,
        close: number
    }
    type: string
}

export interface userRouteInterface {
    completedRoute: place[],
    isCurrentRoute: boolean,
    // isUniquePlace: boolean,
}

const userRoute = atom<userRouteInterface>({
    key: "userRoute",
    default: {
        completedRoute: [],
        isCurrentRoute: false,
        // isUniquePlace: false,
    }
});

export default userRoute;