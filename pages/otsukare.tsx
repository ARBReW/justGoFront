import {
  Box,
  Button,
  Center,
  useColorModeValue,
  Heading,
  Text,
  Stack,
  Image,
  AspectRatio
} from '@chakra-ui/react';
import locationStates from "../states/locationStates";
import currentRoute from "../states/currentRoute";
import { useRecoilValue, useResetRecoilState} from "recoil";
import Link from "next/link";
import userRoute from '../states/userRoute';
import placeDetail from '../states/placeDetail';

export default function showRoute() {
  const { completedRoute } = useRecoilValue(userRoute);
  const route = useRecoilValue(currentRoute);   
  const endImg = completedRoute[completedRoute.length -1]?.img;
  const clearPlace = useResetRecoilState(placeDetail);
  const clearCurrentRoute = useResetRecoilState(currentRoute);
  const clearUserRoute = useResetRecoilState(userRoute);
  
  const clearUser = () => {
    clearPlace();
    clearCurrentRoute();
    clearUserRoute();
  }
   
  return (
    <Center h="100vh" bg="teal.500" w="100vw" overflow="scroll">
      <Stack
        boxShadow="md"
        bg="whiteAlpha.900"
        pt="5"
        pb="5"
        pr="10"
        pl="10"
        rounded="md"
        h="90vh"
        minW="90vw"
        maxW={["60vw", "90vw", "90vw"]}
      >
        <Stack pt={10} align={"center"}>
          <Heading
            align={"centre"}
            fontSize={["2vh", "2vh", "3vh", "4vh"]}
            fontFamily={"body"}
            fontWeight="bold"
            color="tomato"
          >
            🎊 Otsukare 🎊
          </Heading>
        </Stack>

        <AspectRatio minW="100px" ratio={4 / 3}>
          <Image
            src={endImg}
            rounded="lg"
            objectFit="cover"
            objectPosition="50%"
          />
        </AspectRatio>

        <Stack pt={10} align={"center"}>
          <Text
            fontSize={["1.9vh", "1.9vh", "1.9vh", "2vh"]}
            textTransform={"uppercase"}
          >
            Your route:
          </Text>
        </Stack>

        <div>
          {completedRoute
            .slice()
            .reverse()
            .map((stop) => (
              <Box key={stop.placeId * 8.4216}>
                {"✅"} {stop.name} {stop.type}
              </Box>
            ))}
        </div>

        <Stack pt={10} align={"center"}>
          <Link href="/" passHref>
            <Button
              colorScheme="blackAlpha"
              variant="solid"
              onClick={clearUser}
              fontSize={["2vh", "2vh", "2vh", "2vh"]}
            >
              Return to login
            </Button>
          </Link>
        </Stack>
      </Stack>
    </Center>
  );
}