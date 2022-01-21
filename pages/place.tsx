import Link from "next/link";

import { Center, Stack, Button, ButtonGroup, Box } from '@chakra-ui/react';
import { useRecoilValue } from "recoil";
import placeDetail from "../states/placeDetail";

export default function place({}) {
  const places = useRecoilValue(placeDetail);
  

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
              <Button bg='green.100'>
                Go to Navigation
              </Button>
            </Link>
          </ButtonGroup>
        </Stack>
      </Center>
    </>
  );
}
