import {
  Center,
  Stack,
  Image,
  Heading,
  Text,
  FormControl,
  FormLabel,
  FormHelperText,
  Input,
  Button,
  Divider,
} from "@chakra-ui/react";
import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import userGeoLocation from "../states/userGeoLocation";
import { useRecoilState } from "recoil";
import { useEffect, useState } from "react";
import locationStates from "../states/locationStates";
import axios from "axios";

const Home: NextPage = () => {
  const [userLocation, setUserLocation] = useRecoilState(userGeoLocation);
  const [places, setPlaces] = useRecoilState(locationStates);
  const [load, setLoad] = useState(false);

  useEffect(() => {
    (async () => {
      handleUserLocation();
      await getData();
      setLoad(true);
    })()
  }, []);


  // get user location on login (to be updated on selection page)
  function handleUserLocation() {
    //Save current geolocation to recoil state
    navigator.geolocation.getCurrentPosition((position) => {
      setUserLocation({
        coordinates: {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        },
      });

      //Save current geolocation to sessionStorage
      sessionStorage.setItem('userGeoLocation', JSON.stringify({
        coordinates: {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        },
      }));
    });
  }

  async function getData() {
    try {
      if (sessionStorage.getItem("locationStates") === null) {
        const routeResponse = await axios.get(
          'https://88tf8ip678.execute-api.ap-northeast-1.amazonaws.com/prod/routes');
        const placeResponse = await axios.get<any>(
          'https://cc24-seniorprojectbackend.herokuapp.com/places');
        const routeData = await routeResponse.data.slice();
        const placeData = await placeResponse.data.slice();
        sessionStorage.setItem("locationStates", JSON.stringify({ routes: routeData, places: placeData }));
        setPlaces({ routes: routeData, places: placeData });
      }
      else {
        const { routes, places } = JSON.parse(sessionStorage.getItem("locationStates") || "");
        setPlaces({
          routes: JSON.parse(routes),
          places: JSON.parse(places)
        });
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <Head>
        <title>Just GO</title>
      </Head>
      <Stack
        justify="center"
        h="100vh"
        boxShadow="md"
        bg="whiteAlpha.900"
        rounded="md"
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
        {true ? (
          <Text textAlign="center" fontWeight="bold">
            "You only make the fun when you just GO"
          </Text>
        ) : (
          <div>
            <Heading as="h1" fontSize={["2vh", "2vh", "3vh", "4vh"]}>
              Log in and Just GO.{" "}
            </Heading>
            <Text
              fontSize={["1.9vh", "1.9vh", "1.9vh", "2vh"]}
              color="gray.600"
            >
              Enter your username and password.
            </Text>

            <FormControl pt="15px">
              <FormLabel
                htmlFor="email"
                fontSize={["2vh", "2vh", "2vh", "2vh"]}
              >
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
          </div>
        )}

        <Divider orientation="horizontal" paddingTop="15px" />
        {/* If coordinates are 0 OR axios is not done  
            IF TRUE
                show loading
            IF FALSE
                show go
        */}
        {userLocation.coordinates.lat === 0 || !load ? (
          <Center paddingTop="15px">
            <Button
              colorScheme="orange"
              variant="solid"
              fontSize={["2.5vh", "2.5vh", "2.5vh", "2.5vh"]}
            >
              Loading locations...
            </Button>
          </Center>
        ) : (
          <Center paddingTop="15px">
            <Link href="/selection" passHref>
              <Button
                colorScheme="green"
                variant="solid"
                fontSize={["2.5vh", "2.5vh", "2.5vh", "2.5vh"]}
              >
                I'm ready to GO
              </Button>
            </Link>
          </Center>
        )}
      </Stack>
    </>
  );
};

export default Home;
