import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  Button,
  Avatar,
  Flex,
  useColorMode,
} from "@chakra-ui/react";


export default function Profile() {
  const { user, isAuthenticated, isLoading, logout } =
    useAuth0();
  const navigate = useNavigate();
  const { colorMode } = useColorMode();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/");
    }
  }, [isLoading, isAuthenticated, navigate]);
  
  if (isLoading) {
    return (
      <Container maxW="container.md" h="100vh" p={4}>
        <Text>Loading...</Text>
      </Container>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <Container maxW="container.md" h="100vh" p={4}>
      <VStack spacing={8} align="stretch">
        <Flex justify="space-between" align="center">
          <Heading size="lg">Profile</Heading>
          <Button variant="ghost" onClick={() => navigate("/")}>
            Back to Chat
          </Button>
        </Flex>

        <Box
          p={6}
          borderRadius="lg"
          bg={colorMode === "light" ? "white" : "gray.700"}
          boxShadow="sm"
        >
          <VStack spacing={6} align="center">
            <Avatar size="xl" src={user.picture} name={user.name} />
            <VStack spacing={1} align="center">
              <Heading size="md">{user.name}</Heading>
              <Text color="gray.500">{user.email}</Text>
            </VStack>
            <Button
              colorScheme="red"
              variant="outline"
              onClick={() =>
                logout({ logoutParams: { returnTo: window.location.origin } })
              }
            >
              Log Out
            </Button>
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
}
