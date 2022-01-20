import { Box, Button, Center, HStack, Stack } from "@chakra-ui/react";
import { map } from "lodash";
import Link from "next/link";

export default function selection() {
  const images: string[] = [
    "https://images.squarespace-cdn.com/content/v1/58fd82dbbf629ab224f81b68/1530854536400-U501LPJSRZ0W57S9SH4V/Shirahige-Shinto-Shrine.jpg?format=1000w",
  ];

  const names: string[] = [
    "Richard Park",
    "Brian Bar",
    "Ana's Place",
    "Wesley Store",
    "Roman Mall",
  ];

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

  return (
    <>
      <Center>
        <Box backgroundImage={images[0]} backgroundRepeat="no-repeat">
          <HStack>
            <Button direction="left" onClick={changeRoute}>
              Left
            </Button>
            <Center>
              <Stack>
                <div>WELCOME TO SELECTION</div>
                {names.map((name: string) => {
                  return <div>{name}</div>;
                })}
                <Link href="/place">
                  <Button onClick={handleSelection}>JUST GO</Button>
                </Link>
                <Link href="/otsukare">
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
