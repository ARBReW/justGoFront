import { Box, Button, Center, HStack, Stack } from "@chakra-ui/react";
import Link from "next/link";
import { useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import locationStates, { routes } from "../states/locationStates";
import placeDetail from "../states/placeDetail";

export default function selection() {
  const routesList = useRecoilValue(routes);
  const { places } = useRecoilValue(locationStates);
  const [selectRoute, setSelectRoute] = useState(0);
  const [selectPlace, setSelectPlace] = useState(0);
  const [bg, setBg] = useState(routesList[selectRoute][selectPlace]?.img);
  const [placeInfo, setPlaceInfo] = useRecoilState(placeDetail)

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
  
    setBg(routesList[selectRoute][selectPlace]?.img)
  }

  function handleSelection() {
    console.log("selectedPlace");
  }

  function handleEnd() {
    console.log(routesList);
  }

  function handlePlaceClick(event: any) {
    const placeId = Number.parseInt(event.target.attributes.placeid.value);
    const place = places.find((place) => place.placeId === placeId);
    setSelectPlace(routesList[selectRoute].map(place => place?.placeId).indexOf(placeId))
    setBg(place!.img);
    setPlaceInfo(place || {});
  }

  return (
    <>
      <Center>
        <Box backgroundImage={bg} backgroundRepeat="no-repeat">
          <HStack>
            <Button direction="left" onClick={changeRoute}>
              Left
            </Button>
            <Center>
              <Stack>
                {routesList[selectRoute]
                  .slice()
                  .reverse()
                  .map((place) => {
                    return (
                      <Button
                        key={place?.placeId}
                        placeid={place?.placeId}
                        onClick={handlePlaceClick}
                      >
                        {place?.name}
                      </Button>
                    );
                  })}
                <Link href="/place" passHref>
                  <Button onClick={handleSelection}>JUST GO</Button>
                </Link>
                <Link href="/otsukare" passHref>
                  <Button onClick={handleEnd}>Go To Otsukare</Button>
                </Link>
              </Stack>
            </Center>
            <Button direction="right" onClick={changeRoute}>
              Right
            </Button>
          </HStack>
        </Box>
      </Center>
    </>
  );
}
