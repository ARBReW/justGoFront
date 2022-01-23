import {
  Button,
  Center,
  Heading,
  HStack,
  Stack,
  Divider,
  Text,
} from "@chakra-ui/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import currentRoute from "../states/currentRoute";
import locationStates, { routes } from "../states/locationStates";
import placeDetail from "../states/placeDetail";
import { ArrowLeftIcon, ArrowRightIcon } from "@chakra-ui/icons";

export default function selection() {
  const routesList = useRecoilValue(routes);
  const { places } = useRecoilValue(locationStates);
  const [selectRoute, setSelectRoute] = useState(0);
  const [selectPlace, setSelectPlace] = useState(0);
  const [bg, setBg] = useState(routesList[selectRoute].stops[selectPlace]?.img);
  const [placeInfo, setPlaceInfo] = useRecoilState<any>(placeDetail);
  const [currRoute, setCurrRoute] = useRecoilState<any>(currentRoute);

  useEffect(() => {
    setCurrRoute(routesList[selectRoute]);
    setPlaceInfo(routesList[selectRoute].stops[selectPlace]);
    setCurrRoute(routesList[selectRoute]);
    setBg(placeInfo.img);
  }, [selectRoute, placeInfo]);

  function changeRoute(event: any) {
    const direction: string = event.target.attributes.direction.value;
    if (direction === "left") {
      if (selectRoute === 0) {
        setSelectRoute(routesList.length - 1);
      } else {
        setSelectRoute(selectRoute - 1);
      }
    }

    if (direction === "right") {
      if (selectRoute === routesList.length - 1) {
        setSelectRoute(0);
      } else {
        setSelectRoute(selectRoute + 1);
      }
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
        <HStack
          boxShadow="md"
          pt="5"
          pb="5"
          pr="10"
          pl="10"
          rounded="md"
          h="90vh"
          minW="40vw"
          maxW={["60vw", "90vw", "90vw", "70vw"]}
          backgroundImage={bg}
          backgroundRepeat="no-repeat"
          backgroundPosition="center"
          backgroundSize="cover"
        >
          <Button
            colorScheme="blackAlpha"
            direction="left"
            onClick={changeRoute}
          >
            <ArrowLeftIcon color="white" boxSize={8}></ArrowLeftIcon>
          </Button>
          <Stack
            pt="20px"
            spacing={19}
            direction="column"
            align="center"
            marginTop="20px"
          >
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
            <Divider orientation="horizontal" />
            <Link href="/place" passHref>
              <Button colorScheme="orange" onClick={handleRouteSelect}>
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
          <Button colorScheme="blackAlpha" direction="right">
            <ArrowRightIcon
              color="white"
              boxSize={8}
              direction="right"
              onClick={changeRoute}
            ></ArrowRightIcon>
          </Button>
        </HStack>
      </Center>
    </>
  );
}
