import Link from "next/link";
import { Center, Stack, Button, ButtonGroup, Box } from '@chakra-ui/react';
import { useRecoilValue } from "recoil";
import locationStates from "../states/locationStates";

export default function navigation() {
  const { places } = useRecoilValue(locationStates);

  console.log(places);

  return (
    <>
      <Center h='100vh' bg='teal.500'>
        <Stack
          h='95vh'
          boxShadow='md'
          bg='whiteAlpha.900'
          p='20' rounded='md'
          backgroundImage={`url(${places[0].img})`}
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
              {places[0].name}
            </Box>
            <Box
              bg='whiteAlpha.900'
              w='100%'
              h='100%'
              p={140}
              color='grey.700'
              align='center'>
              Directions
            </Box>
          </Stack>
          <ButtonGroup
            direction='row'
            spacing={4}
            align='center'
            pb={50}>
            <Link href='/place'>
              <Button bg='green.100'>
                Go back to Place
              </Button>
            </Link>
            <Link href='/place'>
              <Button bg='green.100'>
                Go to Next Place
              </Button>
            </Link>
          </ButtonGroup>
        </Stack>
      </Center>
    </>
  );
}


/* original code: changed first link to Place, as per mockup (?)

export default function navigation() {
  return (
    <>
      <div>WELCOME TO NAVIGATION</div>
      <Link href="/selection">Go to Selection</Link>
      <Link href="/selection"> Go to Selection</Link>
    </>
  );
}
*/