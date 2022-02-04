import Link from "next/link";
import { Button, Text, Stack, HStack } from "@chakra-ui/react";
import userGeoLocation from "../../states/userGeoLocation";
import { useRecoilState } from "recoil";
import placeDetail from "../../states/placeDetail";
import viewedStops from "../../states/viewedStops";
  
const Navbar = () => {
const [userLocation, setUserLocation] = useRecoilState(userGeoLocation);
const [placeInfo, setPlaceInfo] = useRecoilState(placeDetail)
const [vStop, setVStop] = useRecoilState(viewedStops);


const handleUserLocation = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      setUserLocation({
        coordinates: {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        },
      });
    });
  }

const addToViewedStops = () => {
     setVStop({
       ...vStop,
       viewedStops: [...vStop.viewedStops, placeInfo],
     });
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
            <Text fontSize="1.2vh">Refresh<br></br>location</Text>
            </Stack>
        </Button>
        <Link href="/selection">
          <Button
            borderColor="brand.dgrn"
            borderWidth="2px"
            rounded="full"
            w="15"
            h="12"
            onClick={addToViewedStops}
          >
            <Stack spacing="0">
            <Text fontSize="lg">🏠</Text>
            <Text fontSize="1.2vh">Choose<br></br>route</Text>
            </Stack>
          </Button>
        </Link>
        <Link href="/otsukare">
          <Button
            borderColor="brand.dgrn"
            borderWidth="2px"
            rounded="full"
            w="16"
            h="12"
          >
            <Stack spacing="0">
            <Text fontSize="lg">🏁</Text>
            <Text fontSize="1.2vh">End<br></br>route</Text>
            </Stack>
          </Button>
        </Link>
      </HStack>
    </>
  );
};

export default Navbar;