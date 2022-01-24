import {
  Center,
  Stack,
  Image,
  Heading,
  Text,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
  Button,
  Divider,
} from "@chakra-ui/react";
import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Just GO</title>
      </Head>

      <Center h="100vh" bg="teal.500" w="100vw" overflow="scroll">
        <Stack
          boxShadow="md"
          bg="whiteAlpha.900"
          pt="5"
          pb="5"
          pr="5"
          pl="5"
          rounded="md"
          h="90vh"
          minW="40vw"
          maxW={["60vw", "90vw", "90vw"]}
        >
          <Image
            src="https://kanji-symbol.net/common/images/txt/num0008-gyo.gif"
            mb="6"
            mt="3"
            alt="JustGoLogo"
            mx="auto"
            maxW={["15vh", "15vh", "20vh", "25vh"]}
            width="10wh"
            height="auto"
          />
          <Heading as="h1" fontSize={["2vh", "2vh", "3vh", "4vh"]}>
            Log in and Just GO.{" "}
          </Heading>
          <Text fontSize={["1.9vh", "1.9vh", "1.9vh", "2vh"]} color="gray.600">
            Enter your username and password.
          </Text>

          <FormControl pt="15px">
            <FormLabel htmlFor="email" fontSize={["2vh", "2vh", "2vh", "2vh"]}>
              Email address:
            </FormLabel>
            <Input
              placeholder="Enter your email here"
              id="email"
              type="email"
              fontSize={["2vh", "2vh", "2vh", "2vh"]}
            />
            <FormLabel
              htmlFor="password"
              marginTop="5px"
              fontSize={["2vh", "2vh", "2vh", "2vh"]}
            >
              Password:
            </FormLabel>
            <Input
              placeholder="Enter your password here"
              id="password"
              type="password"
              fontSize={["2vh", "2vh", "2vh", "2vh"]}
            />
            <FormHelperText></FormHelperText>
            <Center pt="10px">
              <Button
                colorScheme="teal"
                variant="outline"
                fontSize={["2vh", "2vh", "2vh", "2vh"]}
              >
                Log in
              </Button>
            </Center>
          </FormControl>

          <Divider orientation="horizontal" paddingTop="15px" />

          <Center paddingTop="15px">
            <Link href="/selection" passHref>
              <Button
                colorScheme="orange"
                variant="solid"
                fontSize={["2vh", "2vh", "2vh", "2vh"]}
              >
                Guest Login
              </Button>
            </Link>
          </Center>
        </Stack>
      </Center>
    </div>
  );
};

export default Home;
