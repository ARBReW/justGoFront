import Link from "next/link";

import { Center, Stack, Button, ButtonGroup, Box } from '@chakra-ui/react';
import { useRecoilValue, useRecoilState } from "recoil";
import placeDetail from "../states/placeDetail";
import { useState } from "react";
import userGeoLocation from "../states/userGeoLocation"

export default function place({}) {
  const places = useRecoilValue(placeDetail);
  const [userLocation, setUserLocation] = useRecoilState(userGeoLocation);

  async function handleOnClick() {
    navigator.geolocation.getCurrentPosition((position) => {
      setUserLocation({
        coordinates: {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }
      }) 
    })

    //api call to google directions use coordinates
    //response data will have to update a some recoil directions state
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
