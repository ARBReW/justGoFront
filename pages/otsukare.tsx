import {
  Button,
  Heading,
  Text,
  Stack,
  Image,
  AspectRatio,
  HStack,
  Box
} from "@chakra-ui/react";
import currentRoute from "../states/currentRoute";
import { useRecoilValue, useResetRecoilState } from "recoil";
import Link from "next/link";
import userRoute from "../states/userRoute";
import placeDetail from "../states/placeDetail";

export default function showRoute() {
  const { completedRoute } = useRecoilValue(userRoute);
  const route = useRecoilValue(currentRoute);
  const endImg = `data:image/jpeg;base64, ${completedRoute[completedRoute.length - 1]?.img}`;
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
        <Text
          pt="15"
          justifyContent="center"
          color="whitesmoke"
          fontFamily={"body"}
          m="5"
          fontSize={25}
          fontWeight={"bold"}
          textShadow={"-1.1px -1.1px #52796F, -1px 1.1px #52796F, 1px -1.1px #52796F, 1px 1.1px #52796F"}
        >
          Otsukare 
        </Text>

        <AspectRatio pt="1" minW="300px" maxW="70%" maxH="50vh" ratio={4 / 3}>
          <Image
            src={endImg}
            rounded="lg"
            objectFit="cover"
            objectPosition="50%"
            border="2px solid white"
            boxShadow="dark-lg"
            p="2"
            bg="whiteAlpha.400"
          />
        </AspectRatio>

        <Stack pt={3} spacing={2} align={"center"}>
          <Text
            fontSize={["2.5vh", "2.5vh", "2.5vh", "2.5vh"]}
            textTransform={"uppercase"}
            fontWeight="bold"
            color="whitesmoke"
            textShadow={"-1.1px -1.1px #52796F, -1px 1.1px #52796F, 1px -1.1px #52796F, 1px 1.1px #52796F"}
            m="5"
          >
            Your route:
          </Text>
        </Stack>

        <Box
        border="1px solid white"
        rounded="lg"
        boxShadow="dark-lg"
        p="2"
        bg="whiteAlpha.200">
          {completedRoute
            .slice()
            .reverse()
            .map((stop) => (
              <HStack bg="whiteAlpha.900" key={stop._id + "CC24 rocks"} w="100%" spacing="0.5" border="1px" rounded="sm">
               <Text> {"✅ "} </Text>  
               <Image h="2vh" src={stop?.type} pr="3px"></Image> 
               <Text>{stop?.name}</Text>
              </HStack>
            ))}
        </Box>

      </Stack>
    </>
  );
}
