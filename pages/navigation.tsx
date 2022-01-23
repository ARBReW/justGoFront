import Link from "next/link";
import { Center, Stack, Button, ButtonGroup, Box } from '@chakra-ui/react';
import { useRecoilState, useRecoilValue } from "recoil";
import placeDetail from "../states/placeDetail";
import currentRoute from "../states/currentRoute";

export default function navigation() {
  const places = useRecoilValue(placeDetail);
  const currRoute = useRecoilValue(currentRoute);
  const [placeInfo, setPlaceInfo] = useRecoilState<any>(placeDetail)


  const nextPlace = () => {
    setPlaceInfo(currRoute.stops[currRoute.stops.indexOf(places) + 1])
  }

  return (
    <>
      <Center h="100vh" bg="teal.500">
        <Stack
          h="95vh"
          boxShadow="md"
          bg="whiteAlpha.900"
          p="20"
          rounded="md"
          backgroundImage={`url(${places.img})`}
          backgroundRepeat="no-repeat"
          backgroundPosition="center"
          backgroundSize="cover"
        >
          <Stack direction="column" spacing={4} align="center">
            <Box bg="green.100" borderWidth="1px" w="50%" p={4} align="center">
              {places.name}
            </Box>
            <Box
              bg="whiteAlpha.900"
              w="100%"
              h="100%"
              p={140}
              color="grey.700"
              align="center"
            >
              Directions
            </Box>
          </Stack>
          <ButtonGroup direction="row" spacing={4} align="center" pb={50}>
            <Link href="/place">
              <Button bg="green.100">Go back to Place</Button>
            </Link>
            {currRoute.stops.indexOf(places) === currRoute.stops.length - 1 ?
              (<Link href="/otsukare">
                <Button bg="green.100">
                  Done for the day
                </Button>
              </Link>)
              :
              (<Link href="/place">
                <Button bg="green.100" onClick={nextPlace}>
                  Go to Next Place
                </Button>
              </Link>)}
            )
          </ButtonGroup>
        </Stack>
      </Center>
    </>
  );
}