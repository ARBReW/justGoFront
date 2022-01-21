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
import { useRecoilValue } from "recoil";
import Link from "next/link";

const allData = locationStates;

export default function ProductSimple() {
  const { places } = useRecoilValue(allData);
  const img = places[places.length-1].img;

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
            src={img}
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
          {places.slice()
            .reverse()
            .map((place) => (
              <Box key={place.placeId * 8.4216}>
                {"✅"} {places.indexOf(place) + 1}: {place.name}
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