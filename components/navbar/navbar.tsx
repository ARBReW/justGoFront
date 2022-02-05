import Link from "next/link";
import { Button, Text, Stack, HStack } from "@chakra-ui/react";
import userGeoLocation from "../../states/userGeoLocation";
import { useRecoilState } from "recoil";
import placeDetail from "../../states/placeDetail";
import viewedStops from "../../states/viewedStops";
import { useRouter}  from "next/router";
  
const Navbar = () => {
const [userLocation, setUserLocation] = useRecoilState(userGeoLocation);
const [placeInfo, setPlaceInfo ]= useRecoilState(placeDetail);
const [vStop, setVStop] = useRecoilState(viewedStops);
const router = useRouter();


const handleUserLocation = () => {
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
          w="15"
          h="12"
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
            w="17"
            h="12"
            onClick={addToViewedStops}
          >
            <Stack spacing="0">
            <Text fontSize="lg">🏠</Text>
            <Text fontSize="1.5vh">Choose<br></br>route</Text>
            </Stack>
          </Button>
        </Link>
        {[`/otsukare`].includes(router.pathname) ? ( <Link href="/">
          <Button
            borderColor="brand.dgrn"
            borderWidth="2px"
            rounded="full"
            w="20"
            h="12"
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
            w="20"
            h="12"
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