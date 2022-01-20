import { Box, Button, Center, HStack, Stack } from "@chakra-ui/react";
import Link from "next/link";
import { useState } from "react";
import { useRecoilValue } from "recoil";
import locationStates, { routes } from "../states/locationStates";

export default function selection() {
  const routesList = useRecoilValue(routes);
  const { places } = useRecoilValue(locationStates);

  const [selectRoute, setSelectRoute] = useState(0);
  const [bg, setBg] = useState("");

  function changeRoute(event: any) {
    const direction: string = event.target.attributes.direction.value;
    if (direction === "left") {
    }
  }

  function handleSelection() {
    console.log("selectedPlace");
  }

  function handleEnd() {
    console.log(routesList);
  }

  function changeBg(event: any) {
    const placeId = Number.parseInt(event.target.attributes.placeid.value);
    setBg(places.find(place => place.placeId === placeId)!.img)
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
                        onClick={changeBg}
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
