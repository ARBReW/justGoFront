import Link from "next/link";
import { Center, Stack, Button, Box, Divider, Text } from "@chakra-ui/react";
import { useRecoilValue, useRecoilState } from "recoil";
import placeDetail from "../states/placeDetail";
import userGeoLocation from "../states/userGeoLocation";
import axios from "axios";
import viewedStops from "../states/viewedStops";
import instructionsToLocation from "../states/instructionsToLocation";
import { useEffect } from "react";


export default function place() {
  const places = useRecoilValue(placeDetail);
  const [userLocation, setUserLocation] = useRecoilState(userGeoLocation);
  const [placeInfo, setPlaceInfo] = useRecoilState<any>(placeDetail);
  const [vStop, setVStop] = useRecoilState(viewedStops);
  const [currInstructions, setCurrInstructions] = useRecoilState<any>(
    instructionsToLocation
  );
  useEffect(() => {
    handleOnClick()
  },
    [currInstructions.instructions.length]
  );

  async function handleOnClick() {

    const coordinateString = `${userLocation.coordinates.lat},${userLocation.coordinates.lng}`;

    const response = await axios.get<any>(
      `https://cc24-seniorprojectbackend.herokuapp.com/directions/json`,
      {
        params: {
          origin: coordinateString,
          destination: places.coord.toString(),
        },
      }
    );
    const instructionsList = [];
<<<<<<< HEAD
    for await (let step of response.data.routes[0].legs[0].steps) {
      //cleanup HTML for direction instruction text
      const strippedStrings = step.html_instructions.replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ");
      
      // add distance for each step
      const distance = step.distance.text;
      
      const text = `${strippedStrings}` + `\n 🚶 walk ` + `${distance}`;
      instructionsList.push(text);
    }

    setCurrInstructions({ ...currInstructions, instructions: instructionsList });
=======
    if (userLocation.coordinates.lat !== 0) {
      for await (let step of response.data.routes[0].legs[0].steps) {
        instructionsList.push(step.html_instructions.replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " "));
        //cleanup HTML for direction instruction text
      }
    }
    setCurrInstructions({ ...currInstructions, instructions: instructionsList });
    ;
>>>>>>> 738ecd5cbfec336293649e277d8daf0ddf6535f9
  }

  function addToViewedStops() {
    setVStop({
      ...vStop,
      viewedStops: [...vStop.viewedStops, placeInfo],
    });
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
              {places.name}{" "}
              <Divider orientation="horizontal" pt="0.8rem"></Divider>
              <Text
                fontStyle="italic"
                fontWeight="normal"
                fontSize={15}
                pt="0.8rem"
              >
                Business Hours:
              </Text>
              <Text fontWeight="bold" fontSize={15}>
                Open {places.hours.open} to {places.hours.close}
              </Text>
            </Box>
          </Stack>
          <Divider orientation="horizontal" pt="47vh" marginBottom="5vh" />
          {(currInstructions.instructions.length === 0) ?
            (<Button
              bg="blackAlpha.600"
              textColor="white"
            >
              Loading instructions...
            </Button> ): ( <Link href="/navigation">
            <Button
              bg="blackAlpha.600"
              textColor="white"
              onClick={handleOnClick}
            >
              Go to {places.name}
            </Button>
          </Link>)}
          <Link href="/selection">
            <Button bg="gray.400" textColor="white" onClick={addToViewedStops}>
              Back to route selection
            </Button>
          </Link>
        </Stack>
      </Center>
    </>
  );
}
