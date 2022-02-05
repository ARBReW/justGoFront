import Navbar from "../navbar/navbar";
import React from "react";
import { Stack } from "@chakra-ui/react";

 const Layout = (props: any) => {
  return (
    <Stack 
    h="100vh" 
    w="100vw" 
    overflow="hidden" 
    spacing='0px'
    >
      <Stack
        p="0"
        m="0"
        h="90%"
        //bgGradient="radial(#D2D8B3, #D4AA7D)"
        bg="#D2D8B3"
      >
        <div>{props.children}</div>
      </Stack>
      <Navbar/>
    </Stack>
  );
}

export default Layout;
