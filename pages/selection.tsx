import { Button, Center, Stack, Text, IconButton, Image } from "@chakra-ui/react";
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
import Router from "next/router";

const selection = () => {
  const routesList = useRecoilValue(routes);
  const { places } = useRecoilValue(locationStates);
  const [selectRoute, setSelectRoute] = useState(0);
  const [selectPlace, setSelectPlace] = useState(0);
  const [bg, setBg] = useState("");
  const [placeInfo, setPlaceInfo] = useRecoilState<any>(placeDetail);
  const [currRoute, setCurrRoute] = useRecoilState<any>(currentRoute);
  const [traveledRoute, setTraveledRoute] = useRecoilState<userRouteInterface>(userRoute);
  const [vStop, setVStop] = useRecoilState(viewedStops);
  const [userLocation, setUserLocation] = useRecoilState(userGeoLocation);


  useEffect(() => {
    if (userLocation.coordinates.lat === 0) {
      Router.push("/")
    };
    setCurrRoute(routesList[selectRoute]);
    if (traveledRoute.completedRoute.length > 0) {
      checkIfVisited()
    };
    setPlaceInfo(routesList[selectRoute].stops[selectPlace]);
    setBg(checkPlaceInfo(placeInfo));
  }, [selectRoute, selectPlace, placeInfo, userLocation]);


  const checkPlaceInfo = (place: any): any => {
    if (traveledRoute.completedRoute.includes(place)) {
      return;
    } else return `data:image/jpeg;base64,${placeInfo?.img}`;
  }

  const checkIfVisited = () => {
    let indexNumber = 0;
    function recurse(index: number) {
      //break case
      if (!traveledRoute.completedRoute.map((e) => (e.name)).includes(currRoute.stops[indexNumber].name)
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

  const handleRouteSelect = () => {
    setCurrRoute(routesList[selectRoute]);
    setVStop({
      ...vStop,
      viewedStops: [...vStop.viewedStops, placeInfo],
    });
  }

  const handlePlaceClick = (event: any) => {
    const placeId = event.target.attributes._id.value;
    const place = places.find((place: any) => place._id === placeId);
    setBg(`data:image/jpeg;base64,${place!.img}`);
  }

  const truncateName = (name: string) => {
    if (name.length >= 12) {
      return name.slice(0, 12) + "...";
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
        <IconButton
          aria-label="right button"
          icon={<ArrowLeftIcon color="brand.lbrn"
          borderColor="brand.lbrn"
          borderWidth="2px"
          bg="brand.dbrn"  
          borderRadius="15%" size="lg"/>}
          pr="5"
          variant="link"
          direction="right"
          onClick={changeToLeftRoute}
          fontSize="40"
        ></IconButton>

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
              fontSize={25}
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
          spacing="8"
          p="2vh"
          bg="brand.dbrn"
          opacity="0.9"
          >
          {routesList[selectRoute].stops
            .slice()
            .reverse()
            .map((place) => {
              return (
                <Button
                  p="2vh"
                  w="50vw"
                  fontSize={["2.3vh", "2.3vh", "2.3vh", "2.3vh"]}
                  outlineColor="brand.dgrn"
                  borderWidth="2px"
                  key={place?._id + "3.1425"}
                  _id={place?._id}
                  onClick={handlePlaceClick}
                  {...(traveledRoute.completedRoute.map((e) => (e.name)).includes(place.name)
                    ? { bg: "gray", color: "gray.400" }
                    : { bg: "white", color: "black" })}
                >
                  <Image h="2vh" src={place?.type} pr="3px"></Image>
                  {truncateName(place?.name)}
                </Button>
              );
            })}
          </Stack>
          {userLocation.coordinates.lat === 0 ? (
            <Button borderRadius="50%" w="5rem" h="5rem" colorScheme="gray">
              Loading...
            </Button>
          ) : (
            <Link href="/place" passHref>
              <Button
                borderRadius="50%"
                w="5rem"
                h="5rem"
                color="whiteAlpha.900"
                bg="brand.dgrn"
                onClick={handleRouteSelect}
                boxShadow="outline"
                outlineColor="brand.dgrn"
                borderWidth="2px"
              >
                JUST GO
              </Button>
            </Link>
          )}
        </Stack>
        <IconButton
          aria-label="right button"
          icon={<ArrowRightIcon color="brand.lbrn"
          borderColor="brand.lbrn"
          borderWidth="2px"
          bg="brand.dbrn"  
          borderRadius="15%" size="lg"> </ArrowRightIcon>}
          pl="5"
          variant="link"
          direction="right"
          onClick={changeToRightRoute}
          fontSize="40"
        ></IconButton>
      </Center>
    </>
  );
};

export default selection;

