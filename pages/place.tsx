import Link from "next/link";
import { Center, Stack, Button, ButtonGroup, Box, Divider, Text } from '@chakra-ui/react';
import { useRecoilValue, useRecoilState } from "recoil";
import placeDetail from "../states/placeDetail";
import { useState } from "react";
import userGeoLocation from "../states/userGeoLocation"
import axios from "axios";
import viewedStops from "../states/viewedStops";

export default function place() {
  const places = useRecoilValue(placeDetail);
  const [userLocation, setUserLocation] = useRecoilState(userGeoLocation);
  const [placeInfo, setPlaceInfo] = useRecoilState<any>(placeDetail);
  const [vStop, setVStop] = useRecoilState(viewedStops);

  async function handleOnClick() {
    
    //get the users location from the front end and pass the coordinates to the backend
    //the server will use the coordinates to make a request to the google directions api
    //then, server will send the front end an object with the returned google directions api data
    await navigator.geolocation.getCurrentPosition((position) => {
      setUserLocation({
        coordinates: {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }
      }) 
    })
    console.log(userLocation);
    
    const coordinateString = `${userLocation.coordinates.lat},${userLocation.coordinates.lng}`;
    try{
      const response = await axios.get<any>(`http://localhost:3000/directions/coordinates`, {
      params : { origin: coordinateString, destination: places.coord.toString() }, 
    });
    console.log("response:", response);
    }catch(error){
      console.error(error)
    }
   
  };
  
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
              colorScheme={"whiteAlpha"}
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
          <Link href="/navigation">
            <Button bg="blackAlpha.600" textColor="white" onClick={handleOnClick}>
              Go to {places.name}
            </Button>
          </Link>
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
