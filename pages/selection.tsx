import {
  Button,
  Center,
  Heading,
  HStack,
  Stack,
  Divider,
  Text,
  VStack,
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


export default function selection() {
  const routesList = useRecoilValue(routes);
  const { places } = useRecoilValue(locationStates);
  const [selectRoute, setSelectRoute] = useState(0);
  const [selectPlace, setSelectPlace] = useState(0);
  const [bg, setBg] = useState(routesList[selectRoute].stops[selectPlace]?.img);
  const [placeInfo, setPlaceInfo] = useRecoilState<any>(placeDetail);
  const [currRoute, setCurrRoute] = useRecoilState<any>(currentRoute);
  const [traveledRoute, setTraveledRoute] =
   useRecoilState<userRouteInterface>(userRoute);

  useEffect(() => {
    setCurrRoute(routesList[selectRoute]);
    setPlaceInfo(routesList[selectRoute].stops[selectPlace]);
    setCurrRoute(routesList[selectRoute]);
    setBg(placeInfo.img);
  }, [selectRoute, placeInfo]);

  function changeToRightRoute() {
    if (selectRoute === routesList.length - 1) {
      setSelectRoute(0);
    } else {
      setSelectRoute(selectRoute + 1);
    }
  }

  function changeToLeftRoute() {
    if (selectRoute === 0) {
      setSelectRoute(routesList.length - 1);
    } else {
      setSelectRoute(selectRoute - 1);
    }
  }

  function handleRouteSelect() {
    setCurrRoute(routesList[selectRoute]);
  }

  function handleEnd() {
    console.log(routesList);
  }

  function handlePlaceClick(event: any) {
    const placeId = Number.parseInt(event.target.attributes.placeid.value);
    const place = places.find((place) => place.placeId === placeId);
    setSelectPlace(
      routesList[selectRoute].stops
        .map((place) => place?.placeId)
        .indexOf(placeId)
    );
    setBg(place!.img);
    //setPlaceInfo(place);
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
          maxW={["60vw", "90vw", "90vw", "70vw"]}
          backgroundImage={bg}
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
                  >
                    {`${place?.type} ${place?.name} `}
                  </Button>
                );
              })}
            <ArrowUpIcon w="20" h="20" color="black"/>
            <Link href="/place" passHref>
              <Button borderRadius="50%" w="5rem" h="5rem" colorScheme="orange" onClick={handleRouteSelect}>
                JUST GO
              </Button>
            </Link>
            <Link href="/otsukare" passHref>
              <Button
                onClick={handleEnd}
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
