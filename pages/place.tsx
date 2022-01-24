import Link from "next/link";
require('dotenv').config();
import { Center, Stack, Button, ButtonGroup, Box } from '@chakra-ui/react';
import { useRecoilValue, useRecoilState } from "recoil";
import placeDetail from "../states/placeDetail";
import { useState } from "react";
import userGeoLocation from "../states/userGeoLocation"
import axios from "axios";


export default function place({}) {
  const places = useRecoilValue(placeDetail);
  const [userLocation, setUserLocation] = useRecoilState(userGeoLocation);
  

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

    const response = await axios.get<any>(`${process.env.LOCAL_HOST}/directions/json`, {
      params : { origin: coordinateString, destination: places.coord.toString() }, 
    });
  
    console.log(response);
   
  };
  

  return (
    <>
      <Center h='100vh' bg='teal.500'>

        <Stack
          h='95vh'
          boxShadow='md'
          bg='whiteAlpha.900'
          p='20' rounded='md'
          backgroundImage={`url(${places.img})`}
          backgroundRepeat='no-repeat'
          backgroundPosition='center'
          backgroundSize='cover'>
          <Stack
            direction='column'
            spacing={4}
            align='center'>
            <Box
              bg='green.100'
              borderWidth='1px'
              w='50%'
              p={4}
              align='center'>
              {places.name}
            </Box>
            <Box
              bg='green.100'
              w='50%'
              p={4}
              color='grey.700'
              align='center'>
              Open {places.hours.open} to {places.hours.close}
            </Box>
          </Stack>
          <ButtonGroup
            direction='row'
            spacing={4}
            align='center'
            pt={250}
            pb={50}>

            <Link href='/selection'>
              <Button bg='green.100'>
                Go to Selection
              </Button>
            </Link>
            <Link href='/navigation'>
              <Button bg='green.100' onClick={handleOnClick}>
                Go to Navigation
              </Button>
            </Link>
          </ButtonGroup>
        </Stack>
      </Center>
    </>
  );
}
