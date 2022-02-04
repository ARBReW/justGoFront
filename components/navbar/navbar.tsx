import Link from "next/link";
import { IconButton, Button } from "@chakra-ui/react";
import { HStack } from "@chakra-ui/react";
import { RepeatIcon } from "@chakra-ui/icons";
import userGeoLocation from "../../states/userGeoLocation";
import { useRecoilState, useRecoilValue } from "recoil";
import placeDetail from "../../states/placeDetail";
import viewedStops from "../../states/viewedStops";

  
const Navbar = () => {
const [userLocation, setUserLocation] = useRecoilState(userGeoLocation);
const [placeInfo, setPlaceInfo ]= useRecoilState(placeDetail);
const [vStop, setVStop] = useRecoilState(viewedStops);

  
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
        spacing="20"
        bgColor="gray.700"
        w="100%"
        h="100%"
      > 
        <IconButton
          aria-label="refresh location"
          icon={<RepeatIcon />}
          onClick={handleUserLocation}
          size="lg"
          boxShadow="outline"
          rounded="full"
          borderRadius="100%"
        ></IconButton>
        <Link href="/selection">
          <Button
            boxShadow="outline"
            rounded="full"
            borderRadius="100%"
            w={12}
            h={12}
            onClick={addToViewedStops}
          >
            🏠
          </Button>
        </Link>
        <Link href="/otsukare">
          <Button
            boxShadow="outline"
            rounded="full"
            borderRadius="100%"
            w={12}
            h={12}
          >
            🏁
          </Button>
        </Link>
      </HStack>
    </>
  );
};

export default Navbar;