import Link from "next/link";
import { Center, Stack, Button, Box, Divider, Text } from "@chakra-ui/react";
import { useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import placeDetail from "../states/placeDetail";
import currentRoute from "../states/currentRoute";
import userRoute, { userRouteInterface } from "../states/userRoute";
import userGeoLocation from "../states/userGeoLocation";
import instructionsToLocation from "../states/instructionsToLocation";


export default function navigation() {
  const places = useRecoilValue(placeDetail);
  const currRoute = useRecoilValue(currentRoute);
  const [placeInfo, setPlaceInfo] = useRecoilState<any>(placeDetail);
  const [userLocation, setUserLocation] = useRecoilState(userGeoLocation);
  const [traveledRoute, setTraveledRoute] = useRecoilState<userRouteInterface>(userRoute);
  const [currInstructions, setCurrInstructions] = useRecoilState(instructionsToLocation);
  const [loadDirections, setLoadDirections] = useState(1);
  const [selectPlace, setSelectPlace] = useState(0);
  
  // to handle the next place btn
  function checkIfVisited() {
    let indexNumber = currRoute.stops.indexOf(places) + 1;
    function recurse(index: number) {
      //break case
      if (
        !traveledRoute.completedRoute.includes(currRoute.stops[indexNumber])
      ) {
        return;
      } else {
        recurse((indexNumber += 1));
      }
    }
    recurse(indexNumber);
    return currRoute.stops[indexNumber] //return next unvisited place on currRoute
  }

  const nextPlace = () => {
    let nextPlaceIndex = currRoute.stops.indexOf(places) + 1;

    // recurse to skip places already visited
     function recurse(index: number) {
        if (
          !traveledRoute.completedRoute.includes(currRoute.stops[nextPlaceIndex])
        ) {
          setPlaceInfo(currRoute.stops[nextPlaceIndex]);
          setSelectPlace(nextPlaceIndex)
          return;
        } else {
          recurse((nextPlaceIndex += 1));
        }
      }
    if (nextPlaceIndex > currRoute.stops.length - 1) {
      setPlaceInfo(currRoute.stops[nextPlaceIndex - 1]);
    } else {
      recurse(nextPlaceIndex)
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
    if (!traveledRoute.completedRoute.includes(places)) {
      setTraveledRoute({
        ...traveledRoute,
        completedRoute: [...traveledRoute.completedRoute, placeInfo],
      })
    };
    nextPlace();
  };

  // instructions btns 
  const handleBackBtn = () => {
    if(loadDirections > 1) setLoadDirections(loadDirections - 1);
  }
  const handleNextBtn = () => {
    setLoadDirections(loadDirections + 1);
  }

  return (
    <>
      <Center h="100vh" bg="teal.500" w="100vw">
        <Stack
          boxShadow="md"
          pt="5"
          pb="5"
          pr="5"
          pl="5"
          rounded="md"
          h="90vh"
          minW="90vw"
          maxW={["90vw", "90vw", "90vw", "70vw"]}
          backgroundImage={`url(${places.img})`}
          backgroundRepeat="no-repeat"
          backgroundPosition="center"
          backgroundSize="cover"
          overflow="scroll"
        >
          <Stack direction="column" spacing={4} align="center">
            <Box
              bg="green.100"
              borderWidth="1px"
              w="50%"
              p={4}
              align="center"
              bgColor="gray.500"
              fontSize={20}
              textColor="whitesmoke"
              fontWeight="bold"
            >
              {places.name} <br></br>
            </Box>
            {currInstructions.instructions.slice(loadDirections - 1, loadDirections).map((step:string, index: number) => {
              return (
                <Text
                key={index * 5.1245}
                bg="whiteAlpha.900"
                w="auto"
                h="auto"
                color="grey.700"
                align="center">
                 {step}
              </Text>
              )
            })}
          <Button onClick={handleBackBtn}>Back</Button>
          <Button onClick={handleNextBtn}>Next</Button>
          </Stack>
          <Divider orientation="horizontal" pt="5vh" marginBottom="5vh" />

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
                I'm done here. <br></br> Take me to{" "}
                {checkIfVisited().name}
              </Button>
            </Link>
          )}
          <Link href="/place">
            <Button bg="gray.400" textColor="white">
              Go back to {places.name}
            </Button>
          </Link>
        </Stack>
      </Center>
    </>
  );
}
