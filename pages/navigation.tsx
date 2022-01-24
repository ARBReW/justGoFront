import Link from "next/link";
import { Center, Stack, Button, Box, Divider } from "@chakra-ui/react";
import { useRecoilState, useRecoilValue } from "recoil";
import placeDetail from "../states/placeDetail";
import currentRoute from "../states/currentRoute";
import userRoute, { userRouteInterface } from "../states/userRoute";
import place from "./place";
import currentStop from "../states/viewedStops";

export default function navigation() {
  const places = useRecoilValue(placeDetail);
  const currRoute = useRecoilValue(currentRoute);
  const [placeInfo, setPlaceInfo] = useRecoilState<any>(placeDetail);

  const [traveledRoute, setTraveledRoute] =
    useRecoilState<userRouteInterface>(userRoute);

  const nextPlace = () => {
    let placeIndex = currRoute.stops.indexOf(places) + 1;
    if (placeIndex > currRoute.stops.length - 1) {
      setPlaceInfo(currRoute.stops[placeIndex - 1]);
    } else {
      setPlaceInfo(currRoute.stops[placeIndex]);
    }
  };

  const updateUserRoute = () => {
    if (!traveledRoute.completedRoute.includes(places)) {
      setTraveledRoute({
        ...traveledRoute,
        completedRoute: [...traveledRoute.completedRoute, placeInfo],
      })};
    nextPlace();
  };

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
              colorScheme={"whiteAlpha"}
              bgColor="gray.500"
              fontSize={20}
              textColor="whitesmoke"
              fontWeight="bold"
            >
              {places.name} <br></br>
            </Box>
            <Box
              bg="whiteAlpha.900"
              w="100%"
              h="100%"
              p={100}
              color="grey.700"
              align="center"
            >
              Directions
            </Box>
          </Stack>
          <Divider orientation="horizontal" pt="20vh" marginBottom="5vh" />

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
                I'm done here. <br></br> Take me to {currRoute.stops[currRoute.stops.indexOf(places) + 1].name}
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
