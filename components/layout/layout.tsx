import Navbar from "../navbar/navbar";
import React from "react";
import { Center, Container, Stack } from "@chakra-ui/react";
import { useState, useEffect } from "react";


export default function Layout(props: any) {
  return (
    <Stack bg="teal.500" h="100vh" w="100vw" overflow="hidden" spacing='0px'>
      <Stack
        p={0}
        m={0}
        h="91%"
      >
        <div>{props.children}</div>
      </Stack>
      <Navbar/>
    </Stack>
  );
}
