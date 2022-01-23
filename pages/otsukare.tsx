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
    <Center h="100vh" bg="teal.500">
      <Stack boxShadow="md" bg="whiteAlpha.900" p="20" rounded="md">

        <Stack pt={10} align={'center'}>
          <Heading align={"centre"} fontSize={'2xl'} fontFamily={'body'} fontWeight={500}>
            Otsukare
          </Heading>
        </Stack>

        <AspectRatio minW='100px' ratio={4 / 3}>
          <Image
            src={endImg}
            rounded='lg'
            objectFit='cover'
            objectPosition="50%"
          />
        </AspectRatio>

        <Stack pt={10} align={'center'}>

          <Text fontSize={'sm'} textTransform={'uppercase'}>
            Your route:
          </Text>

        </Stack>

        <div>
          {completedRoute.slice()
            .reverse()
            .map((stop) => (
              <Box key={stop.placeId * 8.4216}>
                {"✅"} {stop.name} {stop.type}
              </Box>
            ))}
        </div>

        <Stack pt={10} align={'center'}>
          <Link href="/" passHref>
            <Button onClick={clearUser}>Return to login</Button>
          </Link>
        </Stack>
      </Stack>
    </Center>
  );
}