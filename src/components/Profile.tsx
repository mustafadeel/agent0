"use client";

import { useEffect, useState } from "react";
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
  SimpleGrid,
  Icon,
  useToast,
  Divider,
} from "@chakra-ui/react";
import {
  ChromeIcon as GoogleIcon,
  ComputerIcon as MicrosoftIcon,
  SlackIcon,
  PodcastIcon as SpotifyIcon,
  GithubIcon,
  TwitterIcon,
  FacebookIcon,
  LinkIcon,
  UnlinkIcon,
} from "lucide-react";

// Define available social connections
const socialConnections = [
  { id: "google-oauth2", name: "Google", icon: GoogleIcon, color: "#DB4437" },
  { id: "microsoft", name: "Microsoft", icon: MicrosoftIcon, color: "#00A4EF" },
  { id: "slack", name: "Slack", icon: SlackIcon, color: "#4A154B" },
  { id: "spotify", name: "Spotify", icon: SpotifyIcon, color: "#1DB954" },
  { id: "github", name: "GitHub", icon: GithubIcon, color: "#333" },
  { id: "twitter", name: "Twitter", icon: TwitterIcon, color: "#1DA1F2" },
  { id: "facebook", name: "Facebook", icon: FacebookIcon, color: "#4267B2" },
];

interface Identity {
  connection: string;
  provider: string;
  isSocial: boolean;
}

export default function Profile() {
  const { user, isAuthenticated, isLoading, logout, getAccessTokenSilently } =
    useAuth0();
  const navigate = useNavigate();
  const { colorMode } = useColorMode();
  const toast = useToast();
  const [linkedAccounts, setLinkedAccounts] = useState<string[]>([]);
  const [isLinking, setIsLinking] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/");
    }
  }, [isLoading, isAuthenticated, navigate]);

  useEffect(() => {
    if (user?.sub) {
      // Extract linked accounts from user identities
      const linked = (user.identities || []).map(
        (identity: Identity) => identity.connection
      );
      setLinkedAccounts(linked);
    }
  }, [user]);

  const handleLink = async (connection: string) => {
    try {
      setIsLinking(connection);
      const token = await getAccessTokenSilently();

      // Redirect to Auth0's universal login for account linking
      window.location.href =
        `https://${import.meta.env.VITE_AUTH0_DOMAIN}/authorize?` +
        `response_type=code&` +
        `client_id=${import.meta.env.VITE_AUTH0_CLIENT_ID}&` +
        `connection=${connection}&` +
        `prompt=consent&` +
        `access_token=${token}&` +
        `redirect_uri=${window.location.origin}/profile`;
    } catch (error) {
      console.error("Error linking account:", error);
      toast({
        title: "Error linking account",
        description: "Please try again later",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLinking(null);
    }
  };

  const handleUnlink = async (connection: string) => {
    try {
      setIsLinking(connection);
      const token = await getAccessTokenSilently();

      // Call Auth0's Management API to unlink the connection
      const response = await fetch(
        `https://${import.meta.env.VITE_AUTH0_DOMAIN}/api/v2/users/${
          user?.sub
        }/identities/${connection}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to unlink account");

      // Update local state
      setLinkedAccounts((prev) => prev.filter((acc) => acc !== connection));

      toast({
        title: "Account unlinked",
        description: "Successfully unlinked your account",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error unlinking account:", error);
      toast({
        title: "Error unlinking account",
        description: "Please try again later",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLinking(null);
    }
  };

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

        <Divider />

        <Box>
          <Heading size="md" mb={4}>
            Linked Accounts
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
            {socialConnections.map((connection) => {
              const isLinked = linkedAccounts.includes(connection.id);
              return (
                <Flex
                  key={connection.id}
                  p={4}
                  borderRadius="md"
                  border="1px solid"
                  borderColor={colorMode === "light" ? "gray.200" : "gray.600"}
                  align="center"
                  justify="space-between"
                  bg={colorMode === "light" ? "white" : "gray.700"}
                >
                  <Flex align="center" gap={3}>
                    <Icon
                      as={connection.icon}
                      color={connection.color}
                      boxSize={6}
                    />
                    <Text fontWeight="medium">{connection.name}</Text>
                  </Flex>
                  <Button
                    size="sm"
                    leftIcon={
                      isLinked ? (
                        <UnlinkIcon size={16} />
                      ) : (
                        <LinkIcon size={16} />
                      )
                    }
                    colorScheme={isLinked ? "red" : "green"}
                    variant={isLinked ? "outline" : "solid"}
                    onClick={() =>
                      isLinked
                        ? handleUnlink(connection.id)
                        : handleLink(connection.id)
                    }
                    isLoading={isLinking === connection.id}
                  >
                    {isLinked ? "Unlink" : "Link"}
                  </Button>
                </Flex>
              );
            })}
          </SimpleGrid>
        </Box>
      </VStack>
    </Container>
  );
}
