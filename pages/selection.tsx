import {
  Button,
  Center,
  Stack,
  Text,
  IconButton,
} from "@chakra-ui/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import currentRoute from "../states/currentRoute";
import locationStates, { routes } from "../states/locationStates";
import placeDetail from "../states/placeDetail";
import { ArrowLeftIcon, ArrowRightIcon, ArrowUpIcon } from "@chakra-ui/icons";
import userRoute, { userRouteInterface } from "../states/userRoute";
import viewedStops from "../states/viewedStops";
import place from "./place";
import userGeoLocation from "../states/userGeoLocation";

export default function selection() {
  const routesList = useRecoilValue(routes);
  const { places } = useRecoilValue(locationStates);
  const [selectRoute, setSelectRoute] = useState(0);
  const [selectPlace, setSelectPlace] = useState(0);
  const [bg, setBg] = useState();
  const [placeInfo, setPlaceInfo] = useRecoilState<any>(placeDetail);
  const [currRoute, setCurrRoute] = useRecoilState<any>(currentRoute);
  const [traveledRoute, setTraveledRoute] =
    useRecoilState<userRouteInterface>(userRoute);
  const [vStop, setVStop] = useRecoilState(viewedStops);
  const [userLocation, setUserLocation] = useRecoilState(userGeoLocation);

  useEffect(() => {
    setCurrRoute(routesList[selectRoute]);
    checkIfVisited();
    setPlaceInfo(routesList[selectRoute].stops[selectPlace]);
    setBg(checkPlaceInfo(placeInfo));
  }, [selectRoute, selectPlace, placeInfo, userLocation]);
  
  function checkPlaceInfo(place: any): any { 
    if (
        traveledRoute.completedRoute.includes(place)
    ) {
      return;
    }
    else return placeInfo.img
  }

  function checkIfVisited() {
    let indexNumber = 0;
    function recurse(index: number) {
      //break case
      if (
        !traveledRoute.completedRoute.includes(currRoute.stops[indexNumber])
      ) {
        setSelectPlace(indexNumber);
        return;
      } else {
        recurse((indexNumber += 1));
      }
    }
    recurse(indexNumber);
  }

  function changeToRightRoute() {
    if (selectRoute === routesList.length - 1) {
      setSelectRoute(0);
      setSelectPlace(0);
    } else {
      setSelectRoute(selectRoute + 1);
      setSelectPlace(0);
    }
  }

  function changeToLeftRoute() {
    if (selectRoute === 0) {
      setSelectRoute(routesList.length - 1);
      setSelectPlace(0);
    } else {
      setSelectRoute(selectRoute - 1);
      setSelectPlace(0);
    }
  }

  function handleRouteSelect() {
    setCurrRoute(routesList[selectRoute]);
    setVStop({
      ...vStop,
      viewedStops: [...vStop.viewedStops, placeInfo],
    });
  }

  function handlePlaceClick(event: any) {
    const placeId = Number.parseInt(event.target.attributes.placeid.value);
    const place = places.find((place) => place.placeId === placeId);
    setBg(place!.img);
  }

  // We can use the below chunk of code for skipping places (changing selectPlace)
  // setSelectPlace(
  //   routesList[selectRoute].stops
  //     .map((place) => place?.placeId)
  //     .indexOf(placeId)
  // );
  //setPlaceInfo(place);

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
          maxW={["60vw", "90vw", "90vw", "70vw"]}
          backgroundImage={bg ? bg : ""}
          backgroundRepeat="no-repeat"
          backgroundPosition="center"
          backgroundSize="cover"
          direction="row"
        >
          <IconButton
            aria-label="right button"
            icon={<ArrowLeftIcon />}
            pr="5"
            variant="link"
            direction="right"
            onClick={changeToLeftRoute}
            fontSize="40"
          ></IconButton>

          <Stack
            p="3px"
            spacing={30}
            direction="column"
            align="center"
            marginTop="2px"
            maxH="80vh"
          >
            <Text
              colorScheme={"whiteAlpha"}
              bgColor="gray.500"
              fontSize={20}
              textColor="whitesmoke"
              textTransform={"uppercase"}
              p="2"
              marginBottom={20}
              fontWeight="bold"
            >
              Select a route
            </Text>

            {routesList[selectRoute].stops
              .slice()
              .reverse()
              .map((place) => {
                return (
                  <Button
                    key={place?.placeId * 3.1425}
                    placeid={place?.placeId}
                    onClick={handlePlaceClick}
                    {...(traveledRoute.completedRoute.includes(place)
                      ? { bg: "gray", color: "gray.400" }
                      : { bg: "white", color: "black" })}
                  >
                    {`${place?.type} ${place?.name} `}
                  </Button>
                );
              })}
            <ArrowUpIcon w="20" h="20" color="black" />
            {userLocation.coordinates.lat === 0 ? (
              <Button borderRadius="50%" w="5rem" h="5rem" colorScheme="gray">
                Loading...
              </Button>
            ) : (
              <Link href="/place" passHref>
                <Button
                  borderRadius="50%"
                  w="5rem"
                  h="5rem"
                  colorScheme="orange"
                  onClick={handleRouteSelect}
                >
                  JUST GO
                </Button>
              </Link>
            )}
            <Link href="/otsukare" passHref>
              <Button
                colorScheme="telegram"
                variant="solid"
              >
                Done for the day
              </Button>
            </Link>
          </Stack>
          <IconButton
            aria-label="right button"
            icon={<ArrowRightIcon />}
            pl="5"
            variant="link"
            direction="right"
            onClick={changeToRightRoute}
            fontSize="40"
          ></IconButton>
        </Stack>
      </Center>
    </>
  );
}
