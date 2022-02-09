import { Button, Center, Stack, Text, IconButton, Image, HStack } from "@chakra-ui/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import currentRoute from "../states/currentRoute";
import locationStates, { routes } from "../states/locationStates";
import placeDetail from "../states/placeDetail";
import { ArrowLeftIcon, ArrowRightIcon } from "@chakra-ui/icons";
import userRoute, { userRouteInterface } from "../states/userRoute";
import viewedStops from "../states/viewedStops";
import userGeoLocation from "../states/userGeoLocation";

const selection = () => {
  const routesList = useRecoilValue(routes);
  const [places, setPlaces] = useRecoilState<any>(locationStates);
  const [selectRoute, setSelectRoute] = useState(0);
  const [selectPlace, setSelectPlace] = useState(0);
  const [bg, setBg] = useState("");
  const [placeInfo, setPlaceInfo] = useRecoilState<any>(placeDetail);
  const [currRoute, setCurrRoute] = useRecoilState<any>(currentRoute);
  const [traveledRoute, setTraveledRoute] = useRecoilState<userRouteInterface>(userRoute);
  const [vStop, setVStop] = useRecoilState(viewedStops);
  const [userLocation, setUserLocation] = useRecoilState(userGeoLocation);


  useEffect(() => {
    // Get user location from sessionStorage
    if (userLocation.coordinates.lat === 0) {
      if (sessionStorage.getItem('userGeoLocation') !== null) {
        setUserLocation(JSON.parse(sessionStorage.getItem('userGeoLocation') || ""));
      } else {
        console.error("No userGeoLocation in sessionStorage");
      }
    };

    //Setting the state called places with locationStates in sessionStorage when default
    if (routesList[0]._id === "") {
      if (sessionStorage.getItem('locationStates') !== null) {
        setPlaces(JSON.parse(sessionStorage.getItem('locationStates') || ""));
      } else {
        console.error("No locationStates in sessionStorage");
      }
    }
    // Save the current route to recoil state
    setCurrRoute(routesList[selectRoute]);

    if (traveledRoute.completedRoute.length > 0) {
      checkIfVisited();
    };

    // Save the current route to sessionStorage
    setPlaceInfo(routesList[selectRoute].stops[selectPlace]);
    sessionStorage.setItem('placeDetail', JSON.stringify(routesList[selectRoute].stops[selectPlace]));
    setBg(checkPlaceInfo(placeInfo));

  }, [selectRoute, selectPlace, placeInfo, userLocation]);


  function checkPlaceInfo(place: any): any {
    if (traveledRoute.completedRoute.includes(place)) {
      return;
    } else return `data:image/jpeg;base64,${placeInfo?.img}`;
  }

  const checkIfVisited = () => {
    let indexNumber = 0;

    function recurse(index: number) {
      //break case
      if (indexNumber === 4){
        setSelectPlace(4);
      } else if (!traveledRoute.completedRoute.map((e) => (e.name)).includes(currRoute.stops[indexNumber].name)
      ) {
        setSelectPlace(indexNumber);
        return;
      } else {
        recurse((indexNumber += 1));
      }
    }
    recurse(indexNumber);
  }

  const changeToRightRoute = () => {
    if (selectRoute === routesList.length - 1) {
      setSelectRoute(0);
      setSelectPlace(0);
    } else {
      setSelectRoute(selectRoute + 1);
      setSelectPlace(0);
    }
  }

  const changeToLeftRoute = () => {
    if (selectRoute === 0) {
      setSelectRoute(routesList.length - 1);
      setSelectPlace(0);
    } else {
      setSelectRoute(selectRoute - 1);
      setSelectPlace(0);
    }
  }

  function handleRouteSelect() {

    //Save the current route to recoil state
    setCurrRoute(routesList[selectRoute]);

    //Save the current route to sessionStorage
    sessionStorage.setItem('currentRoute', JSON.stringify(currRoute));

    //Save the current place to recoil state  
    setVStop({
      ...vStop,
      viewedStops: [...vStop.viewedStops, placeInfo],
    });

    //Save the current place to sessionStorage
    sessionStorage.setItem('viewedStops', JSON.stringify(vStop));
  }

  const handlePlaceClick = (event: any) => {
    const placeId = event.target.attributes._id.value;
    const place = places.places.find((place: any) => place._id === placeId);
    setBg(`data:image/jpeg;base64,${place!.img}`);
  }

  const truncateName = (name: string) => {
    if (name.length >= 17) {
      return name.slice(0, 17) + "...";
    } else return name;
  }

  return (
    <>
      <Center
        h="100vh"
        backgroundImage={bg ? bg : ""}
        backgroundRepeat="no-repeat"
        backgroundPosition="center"
        backgroundSize="cover"
        direction="row"
      >
        <Stack
          p="3px"
          spacing="5"
          direction="column"
          align="center"
          marginTop="2px"
          maxH="85vh"
        >
          <Text
            colorScheme={"whiteAlpha"}
            fontSize="25"
            textColor="whitesmoke"
            fontWeight="bold"
            textShadow='-1.1px -1.1px #52796F, -1px 1.1px #52796F, 1px -1.1px #52796F, 1px 1.1px #52796F'
          >
            Select a route
          </Text>
          <Stack
            border="2px solid"
            borderRadius="md"
            align="center"
            spacing="7"
            p="2vh"
            w="75vw"
            bg="#483D3F70"
          >
            {routesList[selectRoute].stops
              .slice()
              .reverse()
              .map((place) => {
                return (
                  <Button
                    p="3vh"
                    w="60vw"
                    //opacity="0.9"
                    fontSize={["2.3vh", "2.3vh", "2.3vh", "2.3vh"]}
                    borderColor="brand.dgrn"
                    borderWidth="2px"
                    key={place?._id + "3.1425"}
                    _id={place?._id}
                    onClick={handlePlaceClick}
                    {...(traveledRoute.completedRoute.map((e) => (e.name)).includes(place.name)
                      ? { bg: "gray.400", color: "black" }
                      : { bg: "white", color: "black" })}
                  >
                    <Image h="2vh" src={place?.type} pr="3px"></Image>
                    {truncateName(place?.name)}
                  </Button>
                );
              })}
          </Stack>
          <HStack>
            <IconButton
              aria-label="right button"
              icon={<ArrowLeftIcon color="brand.lbrn"
                borderColor="brand.lbrn"
                borderWidth="2px"
                bg="brand.dbrn"
                borderRadius="15%" 
                size="lg" />}
              pr="5"
              variant="link"
              direction="right"
              onClick={changeToLeftRoute}
              fontSize="40"
            ></IconButton>

            {userLocation.coordinates.lat === 0 ? (
              <Button borderRadius="50%" 
              w="5rem" 
              h="5rem" 
              bg="brand.lgrn">
                Loading...
              </Button>
            ) : (
              <Link href="/place" passHref>
                <Button
                  borderRadius="50%"
                  w="5rem"
                  h="5rem"
                  color="white"
                  bg="brand.dgrn"
                  onClick={handleRouteSelect}
                  borderColor="brand.lgrn"
                  borderWidth="2px"
                  _hover={{ bg: "brand.lgrn", color: "brand.dgrn"}}
                  _active={{ bg: "brand.lgrn", color: "brand.dgrn"}}
                  _focus={{ bg: "brand.lgrn", color: "brand.dgrn"}}
                >
                  JUST GO
                </Button>
              </Link>
            )}

            <IconButton
              aria-label="right button"
              icon={<ArrowRightIcon color="brand.lbrn"
                borderColor="brand.lbrn"
                borderWidth="2px"
                bg="brand.dbrn"
                borderRadius="15%" 
                size="lg"> </ArrowRightIcon>}
              pl="5"
              variant="link"
              direction="right"
              onClick={changeToRightRoute}
              fontSize="40"
            ></IconButton>
          </HStack>
        </Stack>
      </Center>
    </>
  );
};

export default selection;

