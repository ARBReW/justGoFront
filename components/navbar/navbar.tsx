import Link from "next/link";
import { Button, Text, Stack, HStack, useToast, Progress, ToastId } from "@chakra-ui/react";
import userGeoLocation from "../../states/userGeoLocation";
import { useRecoilState } from "recoil";
import placeDetail from "../../states/placeDetail";
import viewedStops from "../../states/viewedStops";
import { useRouter } from "next/router";
import React from "react";

const Navbar = () => {
  const [userLocation, setUserLocation] = useRecoilState(userGeoLocation);
  const [placeInfo, setPlaceInfo] = useRecoilState(placeDetail);
  const [vStop, setVStop] = useRecoilState(viewedStops);
  const router = useRouter();
  const locationToast = useToast();
  let locationToastRef: ToastId;

  const handleUserLocation = () => {
    locationToast.closeAll();
    locationToastRef = locationToast({
      position: 'top',
      duration: null,
      render: () => (
        <Progress size='lg' colorScheme='twitter' isIndeterminate />
      )
    }) || "";

    navigator.geolocation.getCurrentPosition((position) => {
      setTimeout(() => {
        locationToast.update(locationToastRef, {
          duration: 2000,
          render: () => (
            <Progress size='lg' colorScheme='green' value={100} />
          )
        });
      }, 1500);

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

  function addToViewedStops() {

    if (placeInfo._id === "") {
      if (sessionStorage.getItem('placeDetail') !== null) {
        setPlaceInfo(JSON.parse(sessionStorage.getItem('placeDetail') || ""));
      } else {
        console.error("No placeDetail in sessionStorage");
      }
    }

    // Save the current place to the viewedStops 
    setVStop({
      ...vStop, //default value
      viewedStops: [...vStop.viewedStops, placeInfo],
    });

    // Save the current place to sessionStorage
    sessionStorage.setItem('viewedStops', JSON.stringify(vStop));
  }

  return (
    <>
      <HStack
        justify="center"
        spacing="10"
        bgColor="brand.dbrn"
        w="100%"
        h="100%"
      >
        <Button
          onClick={handleUserLocation}
          borderColor="brand.dgrn"
          borderWidth="2px"
          rounded="full"
          w={["10vh", "10vh", "11vh"]}
          h={["8vh", "8vh", "9vh"]}
        >
          <Stack spacing="0">
            <Text fontSize="lg">📍</Text>
            <Text fontSize="1.5vh">Refresh<br></br>location</Text>
          </Stack>
        </Button>
        <Link href="/selection">
          <Button
            borderColor="brand.dgrn"
            borderWidth="2px"
            rounded="full"
            w={["10vh", "10vh", "11vh"]}
            h={["8vh", "8vh", "9vh"]}
            onClick={addToViewedStops}
          >
            <Stack spacing="0">
              <Text fontSize="lg">🏠</Text>
              <Text fontSize="1.5vh">Choose<br></br>route</Text>
            </Stack>
          </Button>
        </Link>
        {[`/otsukare`].includes(router.pathname) ? (<Link href="/">
          <Button
            borderColor="brand.dgrn"
            borderWidth="2px"
            rounded="full"
            w={["10vh", "10vh", "11vh"]}
            h={["8vh", "8vh", "9vh"]}
          >
            <Stack spacing="0">
              <Text fontSize="md">↩️</Text>
              <Text fontSize="1.5vh">Back to<br></br>Login</Text>
            </Stack>
          </Button>
        </Link>) : (<Link href="/otsukare">
          <Button
            borderColor="brand.dgrn"
            borderWidth="2px"
            rounded="full"
            w={["10vh", "10vh", "11vh"]}
            h={["8vh", "8vh", "9vh"]}
          >
            <Stack spacing="0">
              <Text fontSize="lg">🏁</Text>
              <Text fontSize="1.5vh">End<br></br>route</Text>
            </Stack>
          </Button>
        </Link>
        )}
      </HStack>
    </>
  );
};

export default Navbar;