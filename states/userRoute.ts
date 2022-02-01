import { atom } from "recoil";

interface place {
    _id: string,
    name: string,
    coord: number[],
    img: string,
    hours: string[],
    type: string,
    __v: number
}

export interface userRouteInterface {
    completedRoute: place[],
    isCurrentRoute: boolean,
}

const userRoute = atom<userRouteInterface>({
    key: "userRoute",
    default: {
        completedRoute: [],
        isCurrentRoute: false,
    }
});

export default userRoute;