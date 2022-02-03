import { useRecoilValue } from "recoil";
import locationStates from "../states/locationStates"
import { Box } from "@chakra-ui/react";
import Streetview from '../components/street-view/street-view'

const allData = locationStates;

export default function showAllRoutes() {
    const { routes } = useRecoilValue(allData);

    return (
        <div>
            <Streetview API_KEY={process.env.STREET_VIEW_KEY} />
                               
        </div>
    )
}