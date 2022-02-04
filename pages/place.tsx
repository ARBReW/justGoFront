import Link from "next/link";
import { Stack, Button, Box, Divider, Text, Center } from "@chakra-ui/react";
import { useRecoilValue, useRecoilState } from "recoil";
import placeDetail from "../states/placeDetail";
import userGeoLocation from "../states/userGeoLocation";
import axios from "axios";
import instructionsToLocation from "../states/instructionsToLocation";
import { useEffect } from "react";
import Router from "next/router";

const place = () => {
  const places = useRecoilValue(placeDetail);
  const [userLocation, setUserLocation] = useRecoilState(userGeoLocation);
  const [placeInfo, setPlaceInfo] = useRecoilState<any>(placeDetail);
  const [currInstructions, setCurrInstructions] = useRecoilState<any>(instructionsToLocation);

  useEffect(() => {
    if (placeInfo.name === "") {
      Router.push("/");
    } else {
      getUserLocation()
    };
  }, [userLocation]);

  async function getUserLocation() {

    const coordinateString = `${userLocation.coordinates.lat},${userLocation.coordinates.lng}`;

    const response = await axios.get<any>(
      `https://88tf8ip678.execute-api.ap-northeast-1.amazonaws.com/prod/directions/data`,
      {
        params: {
          origin: coordinateString,
          destination: placeInfo.coord.toString(),
        },
      }
    );

    function getBearing(start: number[], end: number[]) {
      const startCopy: number[] = start.slice();
      const endCopy: number[] = end.slice();

      function radianToDegree(radian: number) {
        return radian * 180 / Math.PI
      }

      function degreeToRadian(degree: number) {
        return degree * Math.PI / 180
      }

      const difference = degreeToRadian(Math.abs(endCopy[1] - startCopy[1]));

      startCopy.forEach((degree, i) => startCopy[i] = degreeToRadian(degree));
      endCopy.forEach((degree, i) => endCopy[i] = degreeToRadian(degree));

      function x() {
        return Math.cos(endCopy[0]) * Math.sin(difference);
      }

      function y() {
        return Math.cos(startCopy[0]) * Math.sin(endCopy[0]) - Math.sin(startCopy[0]) * Math.cos(endCopy[0]) * Math.cos(difference)
      }

      return radianToDegree(Math.atan2(x(), y()));
    }

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

      const startCoord = [
        step.start_location.lat,
        step.start_location.lng
      ];

      const endCoord = [
        step.end_location.lat,
        step.end_location.lng
      ];

      // getBearing function needs to be implemented
      const heading = getBearing(startCoord, endCoord);

      const stepObj = {
        directions: "",
        distance: "",
        startCoord: [0, 0],
        endCoord: [0, 0],
        heading: 0
      };
      stepObj.directions = strippedStr;
      stepObj.distance = distanceStr;
      stepObj.startCoord = startCoord;
      stepObj.endCoord = endCoord;
      stepObj.heading = heading;
      instructionsList.push(stepObj);
    }

    setCurrInstructions({ instructions: instructionsList });
  }

  const checkDay = () => {
    const dayOfTheWeek = new Date().getDay() - 1 //0-6 
    if (dayOfTheWeek === - 1) {
      return 6;
    } else return dayOfTheWeek;
  }

  return (
    <>
      <Stack
        h="91vh"
        backgroundImage={`data:image/jpeg;base64,${places.img}`}
        backgroundRepeat="no-repeat"
        backgroundPosition="center"
        backgroundSize="cover"
      >
        <Stack
          direction="column"
          spacing="4"
          pt="5"
          pb="30"
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
            {places.name}{" "}
            <Divider orientation="horizontal" pt="0.8rem"></Divider>
            <Text
              fontStyle="italic"
              fontWeight="normal"
              fontSize="15"
              pt="0.8rem"
            >
              Business Hours:
            </Text>
            <Text fontWeight="bold" fontSize="15">
              {places.hours[checkDay()]}
            </Text>
          </Box>
        </Stack>
        <Divider
          orientation="horizontal"
          pt="30vh"
          pb="10vh"
          marginBottom="5vh" />
        {currInstructions.instructions.length === 0 ? (
          <Button
            bg="brand.brn"
            textColor="white"
            fontSize={["2.3vh", "2.3vh", "2.3vh", "2.3vh"]}>
            Loading instructions...
          </Button>
        ) : (
          <Center h="100%">
            <Link href="/navigation" passHref>
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
              >
                Directions to <br />{places.name}
              </Button>
            </Link>
          </Center>
        )}
      </Stack>
    </>
  );
}

export default place;
