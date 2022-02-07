import Link from "next/link";
import { useState, useEffect, Component } from "react";
import { Stack, HStack, Button, Box, Divider, Text, IconButton, Center } from "@chakra-ui/react";
import { ArrowLeftIcon, ArrowRightIcon } from "@chakra-ui/icons";
import { useRecoilState, useRecoilValue } from "recoil";
import placeDetail from "../states/placeDetail";
import currentRoute from "../states/currentRoute";
import userRoute, { userRouteInterface } from "../states/userRoute";
import userGeoLocation from "../states/userGeoLocation";
import instructionsToLocation from "../states/instructionsToLocation";
import { GoogleMap, LoadScript, StreetViewPanorama } from '@react-google-maps/api';
import axios from "axios";

const navigation = () => {
  const places = useRecoilValue(placeDetail);
  const [currRoute, setCurrRoute] = useRecoilState(currentRoute);
  const [placeInfo, setPlaceInfo] = useRecoilState<any>(placeDetail);
  const [userLocation, setUserLocation] = useRecoilState(userGeoLocation);
  const [traveledRoute, setTraveledRoute] = useRecoilState<userRouteInterface>(userRoute);
  const [currInstructions, setCurrInstructions] = useRecoilState<any>(instructionsToLocation);
  const [loadDirections, setLoadDirections] = useState(1);
  const [selectPlace, setSelectPlace] = useState(0);

  useEffect(() => {

    // Save current route to recoil state
    if (currRoute.routeId === "") {
      if (sessionStorage.getItem('currentRoute') !== null) {
        setCurrRoute(JSON.parse(sessionStorage.getItem('currentRoute') || ""));
      } else {
        console.error("No currentRoute in sessionStorage");
      }
    }

    if (traveledRoute.completedRoute.length === 0) {
      if (sessionStorage.getItem('userRoute') !== null) {
        setTraveledRoute(JSON.parse(sessionStorage.getItem('userRoute') || ""));
      } else {
        console.error("No userRoute in sessionStorage");
      }
    }

    if (placeInfo._id === "") {
      // Save current place details to sessionStorage 
      if (sessionStorage.getItem('placeDetail') !== null) {
        setPlaceInfo(JSON.parse(sessionStorage.getItem('placeDetail') || ""));
      } else {
        console.error("No placeDetail in sessionStorage");
      }
    }
    // Save current instructions to the sessionStorage
    if (currInstructions.instructions[0].directions === "") {
      if (sessionStorage.getItem('instructionsToLocation') !== null) {
        setCurrInstructions(JSON.parse(sessionStorage.getItem('instructionsToLocation') || ""));
      } else {
        console.error("No instructionsToLocation in sessionStorage");
      }
    }

    if (userLocation.coordinates.lat === 0) {
      if (sessionStorage.getItem('userGeoLocation') !== null) {
        setUserLocation(JSON.parse(sessionStorage.getItem('userGeoLocation') || ""));
      } else {
        console.error("No userGeoLocation in sessionStorage");
      }
    }

    handleRefreshButton();


  }, [userLocation]);


  const handleRefreshButton = async () => {
    const coordinateString = `${userLocation.coordinates.lat},${userLocation.coordinates.lng}`;

    if (coordinateString === "0,0") {
      return;
    }

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
      const stepObj: any = { directions: "", distance: "" };
      stepObj.directions = strippedStr;
      stepObj.distance = distanceStr;
      stepObj.startCoord = [step.start_location.lat, step.start_location.lng];
      stepObj.endCoord = [step.end_location.lat, step.end_location.lng];
      instructionsList.push(stepObj);
    }

    const lastStop = {
      directions: `You've arrived at ${placeInfo?.name}!`,
      distance: "",
      startCoord: instructionsList[instructionsList.length - 1].endCoord,
      endCoord: instructionsList[instructionsList.length - 1].endCoord,
      heading: instructionsList[instructionsList.length - 1].heading
    }

    setCurrInstructions({ instructions: [...instructionsList, lastStop] });
    sessionStorage.setItem('instructionsToLocation', JSON.stringify({ instructions: [...instructionsList, lastStop] }));
  };

  // handle the next place btn
  const checkIfVisited = () => {
    let indexNumber = currRoute.stops.map((e) => e.name).indexOf(places.name) + 1;
    
    //return early when at end of array
    if (indexNumber > currRoute.stops.length - 1) {
      return currRoute.stops[currRoute.stops.length - 1];
    }
    
    const recurse = (index: number) => {
      //break case if place is already included in travelledRoute
      if (!traveledRoute.completedRoute.includes(currRoute.stops[indexNumber])) {
        return;
      } else {
        //if you've been there it will add one to the index
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
      if (!traveledRoute.completedRoute.includes(currRoute.stops[nextPlaceIndex])) {
        setPlaceInfo(currRoute.stops[nextPlaceIndex]);
        sessionStorage.setItem('placeDetail', JSON.stringify(currRoute.stops[nextPlaceIndex]));
        setSelectPlace(nextPlaceIndex);
        return;
      } else {
        recurse((nextPlaceIndex += 1));
      }
    }
    if (nextPlaceIndex > currRoute.stops.length - 1) {
      setPlaceInfo(currRoute.stops[nextPlaceIndex - 1]);
      sessionStorage.setItem('placeDetail', JSON.stringify(currRoute.stops[nextPlaceIndex - 1]));
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
        }
      }));
    });

    // Update route on click
    if (!traveledRoute.completedRoute.map(place => place._id).includes(placeInfo._id)) {
      if (sessionStorage.getItem('userRoute') !== null && traveledRoute.completedRoute.length === 0) {
        const sessionUserRoute = sessionStorage.getItem('userRoute') || "";
        setTraveledRoute(JSON.parse(sessionUserRoute));
      } else {
        setTraveledRoute({
          ...traveledRoute,
          completedRoute: [...traveledRoute.completedRoute, placeInfo],
        });
        sessionStorage.setItem('userRoute', JSON.stringify({
          ...traveledRoute,
          completedRoute: [...traveledRoute.completedRoute, placeInfo],
        }));
      }

    }
    nextPlace();
  };


  // instructions btns
  const handleBackBtn = () => {
    if (loadDirections > 1) {
      setLoadDirections(loadDirections - 1);
    } else {
      setLoadDirections(currInstructions.instructions.length - 1)
    }
  };

  const handleNextBtn = () => {
    if ((currInstructions.instructions.length - 1) >= loadDirections) {
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
    pov: { heading: currInstructions.instructions[loadDirections - 1].heading, pitch: 0, zoom: 0 },
    fullscreenControl: false,
    addressControl: false,
    enableCloseButton: false,
    zoomControl: false,
    source: "OUTDOOR",
  }

  return (
    <>
      <Stack
        h="95vh"
        backgroundImage={`linear-gradient(rgba(128,128,128, 0.7), rgba(128,128,128, 0.7)), url(data:image/jpeg;base64,${places.img})`}
        backgroundRepeat="no-repeat"
        backgroundPosition="center"
        backgroundSize="cover"
      >
        <Stack
          direction="column"
          spacing="4"
          pt="5"
          align="center">
          <Box
            borderWidth="2px"
            borderColor="brand.dbrn"
            w="75vw"
            p="4"
            align="center"
            borderRadius="md"
            bg="#52796F97"
            fontSize="18"
            textColor="white"
            fontWeight="bold"
          >
            {places.name} <br></br>
          </Box>
          <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_STREET_VIEW_KEY || ""}>
            <GoogleMap mapContainerStyle={containerStyle}>
              <StreetViewPanorama options={details} />
            </GoogleMap>
          </LoadScript>

          <HStack
            justify="center"
            spacing="0"
            w="90vw">
            <IconButton
              onClick={handleBackBtn}
              aria-label="back-btn"
              pr="5"
              variant="link"
              direction="right"
              fontSize="40"
              icon={<ArrowLeftIcon color="brand.lbrn"
                borderColor="brand.lbrn"
                borderWidth="2px"
                bg="brand.dbrn"
                borderRadius="15%" size="lg"></ArrowLeftIcon>}>
            </IconButton>
            <Box
              borderRadius="md"
              bg="gray.100"
              w="70%"
              p="5"
              h="15vh"
              alignItems="center"
              justifyContent="center"
              overflow="scroll">
              {currInstructions.instructions
                .slice(loadDirections - 1, loadDirections)
                .map((step: any, index: number) => {
                  return (
                    <Text
                      key={index * 5.1245}
                      fontSize="16"
                      color="grey.800"
                      textAlign="center"
                      p="5px">
                      {step.directions}
                      <br></br>
                      {step.distance}
                    </Text>
                  );
                })}
            </Box>
            <IconButton
              onClick={handleNextBtn}
              aria-label="next-btn"
              pl="5"
              variant="link"
              direction="right"
              fontSize="40"
              icon={<ArrowRightIcon color="brand.lbrn"
                borderColor="brand.lbrn"
                borderWidth="2px"
                bg="brand.dbrn"
                borderRadius="15%" size="lg"></ArrowRightIcon>} ></IconButton>
          </HStack>
        </Stack>
        <Divider orientation="horizontal" marginBottom="5vh" pt="1vh" pb="1vh" />
        <Stack>
          {currRoute.stops.map(stop => stop._id).indexOf(places._id) === currRoute.stops.length - 1 ? (
            <Center h="100%">
              <Link href="/otsukare">
                <Button
                  alignItems="center"
                  justifyContent="center"
                  whiteSpace="normal"
                  wordwrap="break-word"
                  bg="#D4AA7D95"
                  w="75vw"
                  textColor="white"
                  fontSize="2.3vh"
                  borderColor="brand.lgrn"
                  borderWidth="1.5px"
                  p="0"
                  m="0"
                  h="10vh"
                  _hover={{ bg: "brand.lbrn", color: "brand.dbrn"}}
                  _active={{ color: "brand.dbrn"}}
                  onClick={updateUserRoute}
                >
                  Done for the day
                </Button>
              </Link>
            </Center>
          ) : (
            <Center h="100%">
              <Link href="/place" passHref>
                <Button
                  alignItems="center"
                  justifyContent="center"
                  whiteSpace="normal"
                  wordwrap="break-word"
                  bg="#D4AA7D97"
                  w="75vw"
                  textColor="white"
                  fontSize="2.3vh"
                  borderColor="brand.lgrn"
                  borderWidth="1.5px"
                  p="0"
                  m="0"
                  h="10vh"
                  _hover={{ bg: "brand.lbrn", color: "brand.dbrn"}}
                  _active={{ bg: "brand.lbrn", color: "brand.dbrn"}}
                  _focus={{ bg: "brand.lbrn", color: "brand.dbrn"}}
                  onClick={updateUserRoute}
                >
                  I'm done here. <br></br> Take me to {checkIfVisited()?.name}
                </Button>
              </Link>
            </Center>
          )}
        </Stack>
      </Stack>
    </>
  );
}

export default navigation;
