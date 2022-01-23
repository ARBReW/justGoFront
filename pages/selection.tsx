import { Button, Center, Heading, HStack, Stack } from "@chakra-ui/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import currentRoute from "../states/currentRoute";
import locationStates, { routes } from "../states/locationStates";
import placeDetail from "../states/placeDetail";

export default function selection() {
  const routesList = useRecoilValue(routes);
  const { places } = useRecoilValue(locationStates);
  const [selectRoute, setSelectRoute] = useState(0);
  const [selectPlace, setSelectPlace] = useState(0);
  const [bg, setBg] = useState(routesList[selectRoute].stops[selectPlace]?.img);
  const [placeInfo, setPlaceInfo] = useRecoilState<any>(placeDetail);
  const [currRoute, setCurrRoute] = useRecoilState<any>(currentRoute);

  useEffect(() => {
    setPlaceInfo(routesList[selectRoute].stops[selectPlace]);
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
    setPlaceInfo(place);
  }

  return (
    <>
      <Center
        h="100vh"
        bg="teal.500"
        backgroundImage={bg}
        backgroundRepeat="no-repeat"
        backgroundPosition="center"
      >
        <HStack>
          <Button direction="left" onClick={changeRoute}>
            {"<"}
          </Button>
          <Center>
            <Stack>
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
                      {`${place?.name} [${place?.type}]`}
                    </Button>
                  );
                })}
              <Link href="/place" passHref>
                <Button onClick={handleRouteSelect}>JUST GO</Button>
              </Link>
              <Link href="/otsukare" passHref>
            <Button onClick={handleEnd}>Done for the day</Button>
          </Link>
            </Stack>
          </Center>
          <Button direction="right" onClick={changeRoute}>
            {">"}
          </Button>
        </HStack>
      </Center>
    </>
  );
}
