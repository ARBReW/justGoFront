import Link from "next/link";
import { Center, Stack, Button, ButtonGroup, Box } from '@chakra-ui/react'
import { atom, selector, useRecoilState } from 'recoil'
import { URL } from "url";

export default function place() {
  // const [ place, setPlace ] = useRecoilState()
  // const [ businessHours, setBusinessHours ] = useRecoilState()
  const backgroundPhoto = 'https://www.theworlds50best.com/discovery/filestore/jpg/StarBar-Tokyo-Japan-01.jpg'

  return (
    <>
      <Center h='100vh' bg='teal.500'>
        <Stack h='95vh' boxShadow='md' bg='whiteAlpha.900' p='20' rounded='md' backgroundImage={`url(${backgroundPhoto})`}>
          <Stack direction='column' spacing={4} align='center' pb={250}>
            <Box bg='green.100' borderWidth='1px' w='50%' p={4} align='center'>
              Place name
            </Box>
            <Box bg='green.100' w='40%' p={4} color='grey.700' align='center'>
              Business hours
            </Box>
          </Stack>
          <ButtonGroup direction='row' spacing={4} align='center'>
            <Link href='/selection'>
              <Button bg='green.100'>
                Go to Selection
              </Button>
            </Link>
            <Link href='/navigation'>
              <Button bg='green.100'>
                Go to Navigation
              </Button>
            </Link>
          </ButtonGroup>
        </Stack>
      </Center>
    </>
  );
}
