import Link from "next/link";
import { Center, Stack, Button, ButtonGroup, Box, Divider, Text} from "@chakra-ui/react";
import { useRecoilValue } from "recoil";
import placeDetail from "../states/placeDetail";

export default function place() {
  const places = useRecoilValue(placeDetail);

  return (
    <>
      <Center h="100vh" bg="teal.500" w="100vw">
        <Stack
          boxShadow="md"
          pt="5"
          pb="5"
          pr="5"
          pl="5"
          rounded="md"
          h="90vh"
          minW="90vw"
          maxW={["90vw", "90vw", "90vw", "70vw"]}
          backgroundImage={`url(${places.img})`}
          backgroundRepeat="no-repeat"
          backgroundPosition="center"
          backgroundSize="cover"
        >
          <Stack direction="column" spacing={4} align="center">
            <Box
              bg="green.100"
              borderWidth="1px"
              w="50%"
              p={4}
              align="center"
              colorScheme={"whiteAlpha"}
              bgColor="gray.500"
              fontSize={20}
              textColor="whitesmoke"
              fontWeight="bold"
            >
              {places.name}{" "}
              <Divider orientation="horizontal" pt="0.8rem"></Divider>
              <Text
                fontStyle="italic"
                fontWeight="normal"
                fontSize={15}
                pt="0.8rem"
              >
                Business Hours:
              </Text>
              <Text fontWeight="bold" fontSize={15}>
                Open {places.hours.open} to {places.hours.close}
              </Text>
            </Box>
          </Stack>
          <Divider orientation="horizontal" pt="47vh" marginBottom="5vh" />
          <Link href="/navigation">
            <Button bg="blackAlpha.600" textColor="white">
              Go to {places.name}
            </Button>
          </Link>
          <Link href="/selection">
            <Button bg="gray.400" textColor="white">
              Back to route selection
            </Button>
          </Link>
        </Stack>
      </Center>
    </>
  );
}
