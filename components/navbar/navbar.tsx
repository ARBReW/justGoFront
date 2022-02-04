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
          boxShadow="outline"
          //outlineColor="brand.lgrn"
          borderWidth="2px"
          rounded="full"
          w="15"
          h="12"
        >
          <Stack spacing="0">
            <Text fontSize="lg">📍</Text>
            <Text fontSize="1.2vh">Refresh <br></br>location</Text>
            </Stack>
        </Button>
        <Link href="/selection">
          <Button
            //boxShadow="outline"
            borderColor="brand.lgrn"
            borderWidth="2px"
            rounded="full"
            w="15"
            h="12"
            onClick={addToViewedStops}
          >
            <Stack spacing="0">
            <Text fontSize="lg">🏠 </Text>
            <Text fontSize="1.2vh">Route <br></br> selection</Text>
            </Stack>
          </Button>
        </Link>
        <Link href="/otsukare">
          <Button
            boxShadow="outline"
            rounded="full"
            w="15"
            h="12"
          >
            <Stack spacing="0">
            <Text fontSize="lg">🏁</Text>
            <Text fontSize="1.2vh">Done for<br></br>the day</Text>
            </Stack>
          </Button>
        </Link>
      </HStack>
    </>
  );
};

export default Navbar;