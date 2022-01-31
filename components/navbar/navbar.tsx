import Link from "next/link";
import { IconButton, Button } from "@chakra-ui/react";
import { HStack } from "@chakra-ui/react";
import { RepeatIcon } from "@chakra-ui/icons";
import axios from "axios";
import userGeoLocation from "../../states/userGeoLocation";
import instructionsToLocation from "../../states/instructionsToLocation";
import { useRecoilState, useRecoilValue } from "recoil";
import locationStates from "../../states/locationStates";
import placeDetail from "../../states/placeDetail";
import viewedStops from "../../states/viewedStops";

  
const Navbar = () => {
const [userLocation, setUserLocation] = useRecoilState(userGeoLocation);
const [currInstructions, setCurrInstructions] = useRecoilState<any>(instructionsToLocation);
const [placeInfo, setPlaceInfo] = useRecoilState(placeDetail)
const [vStop, setVStop] = useRecoilState(viewedStops);


  const handleRefreshLocation = async () => {
  const coordinateString = `${userLocation.coordinates.lat},${userLocation.coordinates.lng}`;
  
  console.log(placeInfo, "placeInfo")
    const response = await axios.get<any>(
      `https://k76g4ometf.execute-api.ap-northeast-1.amazonaws.com/prod/directions/data `,
      {
        params: {
          origin: coordinateString,
          destination: placeInfo.coord.toString(),
        },
      })

    const instructionsList = [];
    for await (let step of response.data.routes[0].legs[0].steps) {
      //clean up HTML, add arrows
      const strippedStr = step.html_instructions
        .replace(/<[^>]+>/g, " ")
        .replace(/&nbsp;/g, " ")
        .replace("right", "right    ➡️ ")
        .replace("left", "left   ⬅️ ")

      // add distance for each step
      const distance = step.distance.text;
      const distanceStr = `🚶 walk ` + `${distance}`;

      const stepObj = {directions: "", distance: ""};
      stepObj.directions = strippedStr;
      stepObj.distance = distanceStr;

      instructionsList.push(stepObj);
    }

    setCurrInstructions({ ...currInstructions, instructions: instructionsList });

    console.log('user location in refresh location', userLocation);
    
  };

  function addToViewedStops() {
     setVStop({
       ...vStop,
       viewedStops: [...vStop.viewedStops, placeInfo],
     });
  }
  
  return (
    <>
      <HStack
        justify="center"
        spacing="20"
        bgColor="gray.700"
        w="100%"
        h="100%"
      > 
        <IconButton
          aria-label="refresh location"
          icon={<RepeatIcon />}
          onClick={handleRefreshLocation}
          size="lg"
          boxShadow="outline"
          rounded="full"
          borderRadius="100%"
        ></IconButton>
        <Link href="/selection">
          <Button
            boxShadow="outline"
            rounded="full"
            borderRadius="100%"
            w={12}
            h={12}
            onClick={addToViewedStops}
          >
            🏠
          </Button>
        </Link>
        <Link href="/otsukare">
          <Button
            boxShadow="outline"
            rounded="full"
            borderRadius="100%"
            w={12}
            h={12}
          >
            🏁
          </Button>
        </Link>
      </HStack>
    </>
  );
};

export default Navbar;