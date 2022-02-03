import { Button, Center, Stack, Text, IconButton, Image } from "@chakra-ui/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import currentRoute from "../states/currentRoute";
import locationStates, { routes } from "../states/locationStates";
import placeDetail from "../states/placeDetail";
import { ArrowLeftIcon, ArrowRightIcon, ArrowUpIcon } from "@chakra-ui/icons";
import userRoute, { userRouteInterface } from "../states/userRoute";
import viewedStops from "../states/viewedStops";
import userGeoLocation from "../states/userGeoLocation";
import Router from "next/router";

export default function selection() {
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
      Router.push("/");
      //window.alert("Thank you for traveling with us. Your journey is starting over. Redirecting you to welcome page...")
    }; 
    setCurrRoute(routesList[selectRoute]);
    if (traveledRoute.completedRoute.length > 0) {
      checkIfVisited()
    };
    setPlaceInfo(routesList[selectRoute].stops[selectPlace]);
    setBg(checkPlaceInfo(placeInfo));
  }, [selectRoute, selectPlace, placeInfo, userLocation]);
  

  function checkPlaceInfo(place: any) :any {
    if (traveledRoute.completedRoute.includes(place)) {
      return;
    } else return `data:image/jpeg;base64,${placeInfo?.img}`;
  }

  function checkIfVisited() {
    let indexNumber = 0;
    function recurse(index: number) {
      //break case
      if (!traveledRoute.completedRoute.map((e)=>(e.name)).includes(currRoute.stops[indexNumber].name)
      ) {
        setSelectPlace(indexNumber);
        return;
      } else {
        recurse((indexNumber += 1));
      }
    }
    recurse(indexNumber);
  }

  function changeToRightRoute() {
    if (selectRoute === routesList.length - 1) {
      setSelectRoute(0);
      setSelectPlace(0);
    } else {
      setSelectRoute(selectRoute + 1);
      setSelectPlace(0);
    }
  }

  function changeToLeftRoute() {
    if (selectRoute === 0) {
      setSelectRoute(routesList.length - 1);
      setSelectPlace(0);
    } else {
      setSelectRoute(selectRoute - 1);
      setSelectPlace(0);
    }
  }

  function handleRouteSelect() {
    setCurrRoute(routesList[selectRoute]);
    setVStop({
      ...vStop,
      viewedStops: [...vStop.viewedStops, placeInfo],
    });
  }

  function handlePlaceClick(event: any) {
    const placeId = event.target.attributes._id.value;
    const place = places.find((place: any) => place._id === placeId);
    setBg(`data:image/jpeg;base64,${place!.img}`);
  }

  // We can use the below chunk of code for skipping places (changing selectPlace)
  // setSelectPlace(
  //   routesList[selectRoute].stops
  //     .map((place) => place?.placeId)
  //     .indexOf(placeId)
  // );
  //setPlaceInfo(place);

  function truncateName(name: string) {
    if (name.length >= 15) {
      return name.slice(0, 15) + "...";
    } else return name;
  }

  return (
    <>
      <Center
        h="95vh"
        backgroundImage={bg ? bg : ""}
        backgroundRepeat="no-repeat"
        backgroundPosition="center"
        backgroundSize="cover"
        direction="row"
      >
        <IconButton
          aria-label="right button"
          icon={<ArrowLeftIcon />}
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
          maxH="80vh"
        >
          <Text
            colorScheme={"whiteAlpha"}
            bgColor="gray.500"
            fontSize={20}
            textColor="whitesmoke"
            textTransform={"uppercase"}
            p="2"
            marginBottom={20}
            fontWeight="bold"
          >
            Select a route
          </Text>

          {routesList[selectRoute].stops
            .slice()
            .reverse()
            .map((place) => {
              return (
                <Button
                  p="1vh"
                  fontSize={["2.2vh", "2.2vh", "2.2vh", "2.2vh"]}
                  key={place?._id + "3.1425"}
                  _id={place?._id}
                  onClick={handlePlaceClick}
                  {...(traveledRoute.completedRoute.map((e)=>(e.name)).includes(place.name)
                    ? { bg: "gray", color: "gray.400" }
                    : { bg: "white", color: "black" })}
                >
                  <Image h="2vh" src={place?.type} pr="3px"></Image>
                  {truncateName(place?.name)}
                </Button>
              );
            })}
          <ArrowUpIcon w="20" h="20" color="black" />
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
                colorScheme="orange"
                onClick={handleRouteSelect}
              >
                JUST GO
              </Button>
            </Link>
          )}
        </Stack>
        <IconButton
          aria-label="right button"
          icon={<ArrowRightIcon />}
          pl="5"
          variant="link"
          direction="right"
          onClick={changeToRightRoute}
          fontSize="40"
        ></IconButton>
      </Center>
    </>
  );
}
