import Link from "next/link";
import Router from "next/router";
import { useState, useEffect } from "react";
import { Stack, HStack, Button, Box, Divider, Text } from "@chakra-ui/react";
import { useRecoilState, useRecoilValue } from "recoil";
import placeDetail from "../states/placeDetail";
import currentRoute from "../states/currentRoute";
import userRoute, { userRouteInterface } from "../states/userRoute";
import userGeoLocation from "../states/userGeoLocation";
import instructionsToLocation from "../states/instructionsToLocation";
import axios from "axios";

export default function navigation() {
  const places = useRecoilValue(placeDetail);
  const currRoute = useRecoilValue(currentRoute);
  const [placeInfo, setPlaceInfo] = useRecoilState<any>(placeDetail);
  const [userLocation, setUserLocation] = useRecoilState(userGeoLocation);
  const [traveledRoute, setTraveledRoute] = useRecoilState<userRouteInterface>(userRoute);
  const [currInstructions, setCurrInstructions] = useRecoilState<any>(instructionsToLocation);
  const [loadDirections, setLoadDirections] = useState(1);
  const [selectPlace, setSelectPlace] = useState(0);

  useEffect(() => {
    if (placeInfo.name === "") {
      Router.push("/");
    }
    handleRefreshButton();
  },[userLocation]);


  const handleRefreshButton = async () => {
  const coordinateString = `${userLocation.coordinates.lat},${userLocation.coordinates.lng}`;
  
    const response = await axios.get<any>(
      `https://9fmfffvvm0.execute-api.ap-northeast-1.amazonaws.com/prod/directions/data`,
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
    
   };
  

  // handle the next place btn
  function checkIfVisited() {
    let indexNumber = currRoute.stops.map((e)=> e.name).indexOf(places.name) + 1;
    function recurse(index: number) {
      //break case if place is already included in travelledRoute
      if (
        !traveledRoute.completedRoute.includes(currRoute.stops[indexNumber])
      ) {
        return;
      } else {
        recurse((indexNumber += 1));
      }
    }
    recurse(indexNumber);
    return currRoute.stops[indexNumber]; //return next unvisited place on currRoute
  }

  const nextPlace = () => {
    let nextPlaceIndex = currRoute.stops.map((e) => e.name).indexOf(places.name) + 1;

    // recurse to skip places already visited
    function recurse(index: number) {
      if (
        !traveledRoute.completedRoute.includes(currRoute.stops[nextPlaceIndex])
      ) {
        setPlaceInfo(currRoute.stops[nextPlaceIndex]);
        setSelectPlace(nextPlaceIndex);
        return;
      } else {
        recurse((nextPlaceIndex += 1));
      }
    }
    if (nextPlaceIndex > currRoute.stops.length - 1) {
      setPlaceInfo(currRoute.stops[nextPlaceIndex - 1]);
    } else {
      recurse(nextPlaceIndex);
    }
  };


  const updateUserRoute = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      setUserLocation({
        coordinates: {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        },
      });
    });

    if (!traveledRoute.completedRoute.includes(placeInfo)) {
      setTraveledRoute({
        ...traveledRoute,
        completedRoute: [...traveledRoute.completedRoute, placeInfo],
      });
    }
    nextPlace();
  };

  const lat = userLocation.coordinates.lat;
  const lng = userLocation.coordinates.lng;

  // instructions btns
  const handleBackBtn = () => {
    if (loadDirections > 1) setLoadDirections(loadDirections - 1);
  };
  const handleNextBtn = () => {
    setLoadDirections(loadDirections + 1);
  };

  return (
    <>
      <Stack
        h="95vh"
        backgroundImage={`data:image/jpeg;base64,${places.img}`}
        backgroundRepeat="no-repeat"
        backgroundPosition="center"
        backgroundSize="cover"
        overflow="scroll"
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
            {places.name} <br></br>
          </Box>
          <Box bg="whiteAlpha.900" w="50%" h="200px" align="center">
            {currInstructions.instructions
              .slice(loadDirections - 1, loadDirections)
              .map((step: any, index: number) => {
                return (
                  <Text 
                  key={index * 5.1245} 
                  color="grey.700"
                  textAlign="center">
                    {step.directions}
                    <br></br>
                    {step.distance}
                  </Text>
                );
              })}
          </Box>
          <HStack align="center" spacing={5}>
            <Button onClick={handleBackBtn}>Back</Button>
            <Button onClick={handleNextBtn}>Next</Button>
          </HStack>
        </Stack>

      <Box bg="white">{lat} {lng}</Box>
      {currInstructions.instructions.map((el: any, index: number) => {
        return ( <Text  key={index * 5.1245} bg="white">{el.directions}</Text>)
      })}
     
        <Divider orientation="horizontal" marginBottom="5vh" />

        <Stack>
          {currRoute.stops.indexOf(places) === currRoute.stops.length - 1 ? (
            <Link href="/otsukare">
              <Button
                bg="blackAlpha.600"
                textColor="white"
                onClick={updateUserRoute}
              >
                Done for the day
              </Button>
            </Link>
          ) : (
            <Link href="/place">
              <Button
                bg="blackAlpha.600"
                textColor="white"
                onClick={updateUserRoute}
              >
                I'm done here. <br></br> Take me to {checkIfVisited().name}
              </Button>
            </Link>
          )}
          <Link href="/place">
            <Button bg="gray.400" textColor="white">
              Go back to {places.name}
            </Button>
          </Link>
        </Stack>
      </Stack>
    </>
  );
}
