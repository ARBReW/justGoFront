// export default function otsukare() {
//   return (
//     <div>WELCOME TO OTSUKARE</div>
//   )
// }

import {
  Box,
  Center,
  useColorModeValue,
  Heading,
  Text,
  Stack,
  Image,
  AspectRatio
} from '@chakra-ui/react';


const IMAGE =
  'https://images.unsplash.com/photo-1518051870910-a46e30d9db16?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1350&q=80';

export default function ProductSimple() {
  return (
    <Center h="100vh" bg="teal.500">
      <Stack boxShadow="md" bg="whiteAlpha.900" p="20" rounded="md">

        <AspectRatio minW='100px' ratio={1 / 3}>
          <Image
            src={IMAGE}
            rounded='lg'
            objectFit='cover'
            objectPosition="50%"
          />
        </AspectRatio>

        <Stack pt={10} align={'center'}>
          <Text color={'gray.500'} fontSize={'sm'} textTransform={'uppercase'}>
            Brand
          </Text>
          <Heading fontSize={'2xl'} fontFamily={'body'} fontWeight={500}>
            Nice Chair, pink
          </Heading>
          <Stack direction={'row'} align={'center'}>
            <Text fontWeight={800} fontSize={'xl'}>
              $57
            </Text>
            <Text textDecoration={'line-through'} color={'gray.600'}>
              $199
            </Text>
          </Stack>
        </Stack>
      </Stack>
    </Center>
  );
}