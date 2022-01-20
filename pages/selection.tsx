import { Box, Button, Center, HStack, Stack } from "@chakra-ui/react";
import Link from "next/link";
import { useState } from "react";

export default function selection() {
  const images: string[] = [
    "https://parks.pflugervilletx.gov/home/showpublishedimage/15033/637641079093830000",
    "noimage",
    "noimage",
    "noimage",
    "https://media-cdn.tripadvisor.com/media/photo-s/12/92/53/4a/1f.jpg",
  ];

  const names: string[] = [
    "Richard Park",
    "Brian Bar",
    "Ana's Place",
    "Wesley Store",
    "Roman Mall",
  ];

  const placeData = names.map((name: string, i) => [name, images[i]]);

  const [bg, setBg] = useState(placeData[0][1]);

  function changeRoute(event: any) {
    const direction: string = event.target.attributes.direction.value;
    console.log(direction);
  }

  function handleSelection() {
    console.log("selectedPlace");
  }

  function handleEnd() {
    console.log("We are done");
  }

  function changeBg(event: any) {
    setBg(event.target.attributes.img.value);
  }

  return (
    <>
      <Center>
        <Box backgroundImage={bg} backgroundRepeat="no-repeat">
          <HStack>
            <Button direction="left" onClick={changeRoute}>
              Left
            </Button>
            <Center>
              <Stack>
                <div>WELCOME TO SELECTION</div>
                {placeData.reverse().map((place, i) => {
                  return (
                    <Button key={i * 3.14} img={place[1]} onClick={changeBg}>
                      {place[0]}
                    </Button>
                  );
                })}
                <Link href="/place" passHref>
                  <Button onClick={handleSelection}>JUST GO</Button>
                </Link>
                <Link href="/otsukare" passHref>
                  <Button onClick={handleEnd}>Go To Otsukare</Button>
                </Link>
              </Stack>
            </Center>
            <Button direction="right" onClick={changeRoute}>
              Right
            </Button>
          </HStack>
        </Box>
      </Center>
    </>
  );
}
