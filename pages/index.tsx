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
import { useRecoilState, useResetRecoilState } from "recoil";
import { useEffect, useState } from "react";
import locationStates from "../states/locationStates";
import axios from "axios";
import placeDetail from "../states/placeDetail";
import currentRoute from "../states/currentRoute";
import userRoute from "../states/userRoute";


const Home: NextPage = () => {
  const [userLocation, setUserLocation] = useRecoilState(userGeoLocation);
  const [places, setPlaces] = useRecoilState(locationStates);
  const [load, setLoad] = useState(false);
  const clearPlace = useResetRecoilState(placeDetail);
  const clearCurrentRoute = useResetRecoilState(currentRoute);
  const clearUserRoute = useResetRecoilState(userRoute);

  
  useEffect(() => {
    (async () => {
      clearUser();
      handleUserLocation();
      await getData();
      setLoad(true);
    })()
  }, []);

  const clearUser = () => {
    sessionStorage.removeItem('userRoute');
    sessionStorage.removeItem('currentRoute');
    sessionStorage.removeItem('instructionsToLocation');
    sessionStorage.removeItem('viewedStops');
    sessionStorage.removeItem('userGeoLocation');
    sessionStorage.removeItem('placeDetail');
    clearPlace();
    clearCurrentRoute();
    clearUserRoute();
  };
  
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
          routes: routes,
          places: places
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
        bg="#D2D8B370"
        rounded="md"
      >
        <Image
          src="/logo.png"
          //src="https://kanji-symbol.net/common/images/txt/num0008-gyo.gif"
          mb="6"
          mt="3"
          alt="JustGoLogo"
          mx="auto"
          maxW={["15vw", "15vw", "45vw", "35vw"]}
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
              bg="brand.lbrn"
              color="brand.dbrn"
              variant="solid"
              fontSize={["2.5vh", "2.5vh", "2.5vh", "2.5vh"]}
              outlineColor="brand.dbrn"
              borderWidth="2px"
              _active={{ opacity: "0.8"}}
            >
              Loading locations...
            </Button>
          </Center>
        ) : (
          <Center paddingTop="15px">
            <Link href="/selection" passHref>
              <Button
                bg="brand.dgrn"
                color="white"
                variant="solid"
                fontSize={["2.5vh", "2.5vh", "2.5vh", "2.5vh"]}
                outlineColor="brand.dgrn"
                borderWidth="2px"
                _hover={{ bg: "brand.lgrn", color: "brand.dgrn" }}
                //_active={{ bg: "brand.lgrn", color: "brand.dgrn" }}
                _focus={{ bg: "brand.lgrn", color: "brand.dgrn" }}
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
