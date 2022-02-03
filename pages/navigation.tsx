import Link from "next/link";
import Router from "next/router";
import { useState, useEffect, Component } from "react";
import { Stack, HStack, Button, Box, Divider, Text, IconButton } from "@chakra-ui/react";
import { ArrowLeftIcon, ArrowRightIcon } from "@chakra-ui/icons";
import { useRecoilState, useRecoilValue } from "recoil";
import placeDetail from "../states/placeDetail";
import currentRoute from "../states/currentRoute";
import userRoute, { userRouteInterface } from "../states/userRoute";
import userGeoLocation from "../states/userGeoLocation";
import instructionsToLocation from "../states/instructionsToLocation";
import { GoogleMap, LoadScript, StreetViewPanorama } from '@react-google-maps/api';
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
  }, [userLocation]);


  const handleRefreshButton = async () => {
    const coordinateString = `${userLocation.coordinates.lat},${userLocation.coordinates.lng}`;

    const response = await axios.get<any>(
      `https://88tf8ip678.execute-api.ap-northeast-1.amazonaws.com/prod/directions/data`,
      {
        params: {
          origin: coordinateString,
          destination: placeInfo.coord.toString(),
        },
      });

    const instructionsList = [];
    for await (let step of response.data.routes[0]?.legs[0]?.steps) {
      //clean up HTML, add arrows
      const strippedStr = step.html_instructions
        .replace(/<[^>]+>/g, " ")
        .replace(/&nbsp;/g, " ")
        .replace("right", "right    ➡️ ")
        .replace("left", "left   ⬅️ ")

      // add distance for each step
      const distance = step.distance.text;
      const distanceStr = `🚶 walk ` + `${distance}`;
      const stepObj: any = { directions: "", distance: ""};
      stepObj.directions = strippedStr;
      stepObj.distance = distanceStr;
      stepObj.startCoord = [step.start_location.lat, step.start_location.lng]; 
      stepObj.endCoord = [step.end_location.lat, step.end_location.lng];
      instructionsList.push(stepObj);
    }

    setCurrInstructions({instructions: instructionsList });
    sessionStorage.setItem('instructionsToLocation', JSON.stringify(currInstructions));

  };


  // handle the next place btn
  function checkIfVisited() {
    let indexNumber = currRoute.stops.map((e) => e.name).indexOf(places.name) + 1;
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
        sessionStorage.setItem('placeDetail', JSON.stringify(placeInfo));
        setSelectPlace(nextPlaceIndex);
        return;
      } else {
        recurse((nextPlaceIndex += 1));
      }
    }
    if (nextPlaceIndex > currRoute.stops.length - 1) {
      setPlaceInfo(currRoute.stops[nextPlaceIndex - 1]);
      sessionStorage.setItem('placeDetail', JSON.stringify(placeInfo));
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

      sessionStorage.setItem('userGeoLocation', JSON.stringify({
        coordinates: {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }}));
    });

    if (!traveledRoute.completedRoute.includes(placeInfo)) {
      if (sessionStorage.getItem('userRoute') !== null) {
        const sessionUserRoute = sessionStorage.getItem('userRoute') || "";
        setTraveledRoute(JSON.parse(sessionUserRoute));
      } else {
        setTraveledRoute({
          ...traveledRoute,
          completedRoute: [...traveledRoute.completedRoute, placeInfo],
        });

        sessionStorage.setItem('userRoute', JSON.stringify(traveledRoute));
      }
      
    }
    nextPlace();
  };

  
  // instructions btns
  const handleBackBtn = () => {
    if (loadDirections > 1) setLoadDirections(loadDirections - 1);
  };
  const handleNextBtn = () => {
    if ((currInstructions.instructions.length - 1) > loadDirections) {
      setLoadDirections(loadDirections + 1);
    }
  };

  // street view settings
  const containerStyle = {
    width: '40vh',
    height: '35vh'
  };


  const details = {
    position: {
      lat: currInstructions.instructions[loadDirections - 1].startCoord[0],
      lng: currInstructions.instructions[loadDirections - 1].startCoord[1]
    },
    visible: true,
    pov: { heading: currInstructions.instructions[loadDirections - 1].heading, pitch: 0, zoom: 0},
    fullscreenControl: false,
    addressControl: false,
    enableCloseButton: false,
    zoomControl: false
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
          <Box
            bg="gray.100"
            w="70%"
            p="5"
            maxH="15vh"
            alignItems="center"
            justifyContent="center"
            overflow="scroll">
            {currInstructions.instructions
              .slice(loadDirections - 1, loadDirections)
              .map((step: any, index: number) => {
                return (
                  <Text
                    key={index * 5.1245}
                    fontSize={["2.5vh", "2.5vh", "2.5vh", "2.5vh"]}
                    color="grey.700"
                    textAlign="center">
                    {step.directions}
                    <br></br>
                    {step.distance}
                  </Text>
                );
              })}
          </Box>
          <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_STREET_VIEW_KEY || ""}>
            <GoogleMap mapContainerStyle={containerStyle}>
              <StreetViewPanorama options={details} />
            </GoogleMap>
          </LoadScript>
          <HStack align="center" spacing={5}>
            <IconButton bg="gray.400" aria-label="back-btn" onClick={handleBackBtn} icon={<ArrowLeftIcon />}></IconButton>
            <IconButton bg="gray.400" aria-label="next-btn" onClick={handleNextBtn} icon={<ArrowRightIcon />} ></IconButton>
          </HStack>
        </Stack>
        <Divider orientation="horizontal" marginBottom="5vh" pt="1vh" pb="1vh" />

        <Stack>
          {currRoute.stops.indexOf(places) === currRoute.stops.length - 1 ? (
            <Link href="/otsukare">
              <Button
                bg="blackAlpha.600"
                textColor="white"
                fontSize={["2.3vh", "2.3vh", "2.3vh", "2.3vh"]}
                onClick={updateUserRoute}
              >
                Done for the day
              </Button>
            </Link>
          ) : (
            <Link href="/place" passHref>
              <Button
                bg="blackAlpha.600"
                fontSize={["2.3vh", "2.3vh", "2.3vh", "2.3vh"]}
                textColor="white"
                pt="5"
                pb="5"
                onClick={updateUserRoute}
              >
                I'm done here. <br></br> Take me to {checkIfVisited().name}
              </Button>
            </Link>
          )}
          <Link href="/place" passHref>
            <Button bg="gray.400"
              textColor="white"
              pt="5"
              pb="5"
              fontSize={["2.5vh", "2.5vh", "2.5vh", "2.5vh"]}>
              Go back to <br></br> {places.name}
            </Button>
          </Link>
        </Stack>
      </Stack>
    </>
  );
}
