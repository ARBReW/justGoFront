import {
  Box,
  Button,
  Center,
  Heading,
  Text,
  Stack,
  Image,
  AspectRatio,
} from "@chakra-ui/react";
import currentRoute from "../states/currentRoute";
import { useRecoilValue, useResetRecoilState } from "recoil";
import Link from "next/link";
import userRoute from "../states/userRoute";
import placeDetail from "../states/placeDetail";

export default function showRoute() {
  const { completedRoute } = useRecoilValue(userRoute);
  const route = useRecoilValue(currentRoute);
  const endImg = completedRoute[completedRoute.length - 1]?.img;
  const clearPlace = useResetRecoilState(placeDetail);
  const clearCurrentRoute = useResetRecoilState(currentRoute);
  const clearUserRoute = useResetRecoilState(userRoute);

  const clearUser = () => {
    clearPlace();
    clearCurrentRoute();
    clearUserRoute();
  };

  return (
    <>
      <Stack h="95vh" align="center"> 
        <Heading
          pt="20"
          justifyContent="center"
          fontSize={["5vh", "5vh", "5vh", "5vh"]}
          fontFamily={"body"}
          fontWeight="bold"
          color="tomato"
        >
          🎊Otsukare 🎊
        </Heading>

        <AspectRatio pt="5" minW="300px" maxW="70%" maxH="50vh" ratio={4 / 3}>
          <Image
            src={endImg}
            rounded="lg"
            objectFit="cover"
            objectPosition="50%"
          />
        </AspectRatio>

        <Stack pt={10} align={"center"}>
          <Text
            fontSize={["2.2vh", "2.2vh", "2.2vh", "2.2vh"]}
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
    </>
  );
}
