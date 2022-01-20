import Link from "next/link";
import { Container, Button, Stack, ButtonGroup, Box } from '@chakra-ui/react'
import { atom, selector, useRecoilState } from 'recoil'

export default function place() {
  // const [ place, setPlace ] = useRecoilState()
  // const [ businessHours, setBusinessHours ] = useRecoilState()
  const backgroundPhoto = "url(https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.theworlds50best.com%2Fdiscovery%2FEstablishments%2FJapan%2FTokyo%2FStar-Bar.html&psig=AOvVaw21dFIFNLitlf2EonvIzjj5&ust=1642749951263000&source=images&cd=vfe&ved=0CAsQjRxqFwoTCKjKgdPmv_UCFQAAAAAdAAAAABAD"

  return (
    <>
      <Container maxW='sm' borderWidth='1px' borderRadius='lg' align='center'>
      <div>WELCOME TO PLACE</div>
        <Stack direction='column' spacing={4} align='center' mt={70} mb={200}>
          <Box bg='grey.300' borderWidth='1px' w='50%' p={4} color='grey.700' align='center' bgImage={backgroundPhoto}>
            Place name
          </Box>
          <Box bg='green.100' w='30%' p={4} color='grey.700' align='center'>
            Business hours
          </Box>
        </Stack>
        <ButtonGroup direction='row' spacing={4} align='center' mb={50}>
          <Link href='/selection'>
            <Button>
              Go to Selection
            </Button>
          </Link>
          <Link href='/navigation'>
            <Button>
              Go to Navigation
            </Button>
          </Link>
        </ButtonGroup>
      </Container>
    </>
  );
}
