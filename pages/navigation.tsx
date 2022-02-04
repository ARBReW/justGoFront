import Link from "next/link";
import Router from "next/router";
import { useState, useEffect } from "react";
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
      const stepObj: any = { directions: "", distance: "" };
      stepObj.directions = strippedStr;
      stepObj.distance = distanceStr;
      stepObj.startCoord = [step.start_location.lat, step.start_location.lng];
      stepObj.endCoord = [step.end_location.lat, step.end_location.lng];
      instructionsList.push(stepObj);
    }

    setCurrInstructions({ instructions: instructionsList });
  };

  // handle the next place btn
  const checkIfVisited = () => {
    let indexNumber = currRoute.stops.map((e) => e.name).indexOf(places.name) + 1;
    const recurse = (index: number) => {
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
    const recurse = (index: number) => {
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
    pov: { heading: currInstructions.instructions[loadDirections - 1].heading, pitch: 0, zoom: 0 },
    fullscreenControl: false,
    addressControl: false,
    enableCloseButton: false,
    zoomControl: false
  }

  return (
    <>
      <Stack
        h="95vh"
        backgroundImage={`linear-gradient(rgba(192,192,192, 0.8), rgba(192,192,192, 0.8)), url(data:image/jpeg;base64,${places.img})`}
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
            bgColor="brand.dgrn"
            fontSize="18"
            textColor="whitesmoke"
            fontWeight="bold"
            textShadow='-0.5px -0.5px #D4AA7D, -0.5px 0.5px #D4AA7D, 0.5px -0.5px #D4AA7D, 0.5px 0.5px #D4AA7D'
            opacity="0.9"
          >
            {places.name} <br></br>
          </Box>
          <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_STREET_VIEW_KEY || ""}>
            <GoogleMap mapContainerStyle={containerStyle}>
              <StreetViewPanorama options={details} />
            </GoogleMap>
          </LoadScript>

          <HStack
            align="center"
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
              bg="gray"
              opacity="0.9"
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
                      color="grey.700"
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
          {currRoute.stops.indexOf(places) === currRoute.stops.length - 1 ? (
            <Center h="100%">
              <Link href="/otsukare">
                <Button
                  alignItems="center"
                  justifyContent="center"
                  whiteSpace="normal"
                  wordwrap="break-word"
                  bg="brand.brn"
                  w="75vw"
                  textColor="white"
                  fontSize="2.3vh"
                  borderColor="brand.lgrn"
                  borderWidth="1.5px"
                  p="0"
                  m="0"
                  h="10vh"
                  opacity="0.9"
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
                  bg="brand.brn"
                  w="75vw"
                  textColor="white"
                  fontSize="2.3vh"
                  borderColor="brand.lgrn"
                  borderWidth="1.5px"
                  p="0"
                  m="0"
                  h="10vh"
                  opacity="0.9"
                  onClick={updateUserRoute}
                >
                  I'm done here. <br></br> Take me to {checkIfVisited().name}
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
