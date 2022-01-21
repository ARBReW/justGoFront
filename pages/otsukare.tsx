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
import { useRecoilValue} from "recoil";
import Link from "next/link";


export default function showRoute() {
  const { places } = useRecoilValue(locationStates);
  const route = useRecoilValue(currentRoute)
  //const endImg = places[route[route.length-1].placeId].img;
  const endImg = places[1].img;
  console.log("thisRoute",route[0])
 
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
          {route.slice()
            .reverse()
            .map((stop) => (
              <Box key={stop.placeId * 8.4216}>
                {"✅"} {route.indexOf(stop) + 1}: {stop.name} {stop.type}
              </Box>
            ))}
        </div>

        <Stack pt={10} align={'center'}>
          <Link href="/" passHref>
            <Button>{"Return to login"}</Button>
          </Link>
        </Stack>
      </Stack>
    </Center>
  );
}