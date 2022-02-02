import Link from "next/link";
import { Stack, Button, Box, Divider, Text } from "@chakra-ui/react";
import { useRecoilValue, useRecoilState } from "recoil";
import placeDetail from "../states/placeDetail";
import userGeoLocation from "../states/userGeoLocation";
import axios from "axios";
import viewedStops from "../states/viewedStops";
import instructionsToLocation from "../states/instructionsToLocation";
import { useEffect } from "react";
import Router from "next/router";

export default function place() {
  const places = useRecoilValue(placeDetail);
  const [userLocation, setUserLocation] = useRecoilState(userGeoLocation);
  const [placeInfo, setPlaceInfo] = useRecoilState<any>(placeDetail);
  const [vStop, setVStop] = useRecoilState(viewedStops);
  const [currInstructions, setCurrInstructions] = useRecoilState<any>(instructionsToLocation);
  
  useEffect(() => {
    if (placeInfo.name === "") {
      Router.push("/");
    } else {
      getUserLocation()
    };
  },[currInstructions.instructions.length, userLocation]);
  
  async function getUserLocation() {

    const coordinateString = `${userLocation.coordinates.lat},${userLocation.coordinates.lng}`;

    const response = await axios.get<any>(
      `https://88tf8ip678.execute-api.ap-northeast-1.amazonaws.com/prod/directions/data`,
      {
        params: {
          origin: coordinateString,
          destination: placeInfo.coord.toString(),
        },
      }
    );

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
  }

  function checkDay() {
    const dayOfTheWeek = new Date().getDay() - 1 //0-6 
    if (dayOfTheWeek === - 1) {
      return 6;
    } else return dayOfTheWeek;
  }

  return (
    <>
      <Stack
        h="95vh"
        backgroundImage={`data:image/jpeg;base64,${places.img}`}
        backgroundRepeat="no-repeat"
        backgroundPosition="center"
        backgroundSize="cover"
      >
        <Stack direction="column" spacing={4} pt={5} align="center">
          <Box
            bg="green.100"
            borderWidth="1px"
            w="70%"
            p={4}
            align="center"
            bgColor="gray.500"
            fontSize={20}
            textColor="whitesmoke"
            fontWeight="bold"
          >
            {places.name}{" "}
            <Divider orientation="horizontal" pt="0.8rem"></Divider>
            <Text
              fontStyle="italic"
              fontWeight="normal"
              fontSize={15}
              pt="0.8rem"
            >
              Business Hours:
            </Text>
            <Text fontWeight="bold" fontSize={15}>
              {places.hours[checkDay()]}
            </Text>
          </Box>
        </Stack>
        <Divider 
        orientation="horizontal" 
        pt="35vh" 
        pb="10vh" 
        marginBottom="5vh" />
        {currInstructions.instructions.length === 0 ? (
          <Button 
          bg="blackAlpha.600" 
          textColor="white" 
          fontSize={["2.3vh", "2.3vh", "2.3vh", "2.3vh"]}>
            Loading instructions...
          </Button>
        ) : (
          <Link href="/navigation" passHref>
            <Button
              whiteSpace="normal"
              wordwrap="break-word"
              bg="blackAlpha.600"
              textColor="white"
              fontSize={["2.3vh", "2.3vh", "2.3vh", "2.3vh"]}
            >
              Go to {places.name}
            </Button>
          </Link>
        )}
      </Stack>
    </>
  );
}
