import { Button, Center, HStack, Stack } from "@chakra-ui/react";
import Link from "next/link";

export default function selection() {
  return (
    <>
      <HStack>
        <Button>Left</Button>
        <Center>
          <Stack>
            <div>WELCOME TO SELECTION</div>
            <Link href="/place">
              <Button>Go To Place</Button>
            </Link>
            <Link href="/otsukare">
              <Button>Go To Otsukare</Button>
            </Link>
          </Stack>
        </Center>
        <Button>Right</Button>
      </HStack>
    </>
  );
}
