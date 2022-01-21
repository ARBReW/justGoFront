import locations from "../data/locationsData";
import { useRecoilValue } from "recoil";
import locationStates from "../states/locationStates";
import { Box } from "@chakra-ui/react";

const allData = locationStates;

export default function showAllPlaces() {
    const { places } = useRecoilValue(allData);

    return (
        <div>
            {places.map((place) => (                
                    <Box key={place.name}>
                        ID: {place.placeId} Name: {place.name} Type: {place.type}
                    </Box>                
            ))}
        </div>
    )
}