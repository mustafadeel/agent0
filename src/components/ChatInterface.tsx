import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  IconButton,
  Text,
} from "@chakra-ui/react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import { MoonIcon, SunIcon, UserIcon } from "lucide-react";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import { Message } from "@/types";

type ChatInterfaceProps = {
  messages: Message[];
  isLoading: boolean;
  colorMode: string;
  toggleColorMode: () => void;
  handleSendMessage: (message: string) => Promise<void>;
};

function ChatInterface({
  messages,
  isLoading,
  colorMode,
  toggleColorMode,
  handleSendMessage,
}: ChatInterfaceProps) {
  const { loginWithRedirect, isAuthenticated } = useAuth0();
  const navigate = useNavigate();

  return (
    <Container maxW="container.md" h="100vh" p={4}>
      <Flex direction="column" h="full">
        <Flex justifyContent="space-between" alignItems="center" mb={6}>
          <Heading size="lg">Agent0</Heading>
          <Flex gap={2}>
            <IconButton
              aria-label="Toggle color mode"
              icon={
                colorMode === "light" ? (
                  <MoonIcon size={20} />
                ) : (
                  <SunIcon size={20} />
                )
              }
              onClick={toggleColorMode}
              variant="ghost"
              _hover={{ bg: colorMode === "light" ? "gray.100" : "gray.700" }}
            />
            {isAuthenticated ? (
              <Button
                leftIcon={<UserIcon size={20} />}
                onClick={() => navigate("/profile")}
                variant="ghost"
              >
                Profile
              </Button>
            ) : (
              <Button onClick={() => loginWithRedirect()}>Log In</Button>
            )}
          </Flex>
        </Flex>

        <Box
          flex="1"
          overflowY="auto"
          borderRadius="md"
          bg={colorMode === "light" ? "gray.50" : "gray.700"}
          p={4}
          mb={4}
          sx={{
            "&::-webkit-scrollbar": {
              width: "8px",
            },
            "&::-webkit-scrollbar-track": {
              width: "10px",
              background:
                colorMode === "light"
                  ? "rgba(0,0,0,0.05)"
                  : "rgba(255,255,255,0.05)",
            },
            "&::-webkit-scrollbar-thumb": {
              background:
                colorMode === "light"
                  ? "rgba(0,0,0,0.2)"
                  : "rgba(255,255,255,0.2)",
              borderRadius: "24px",
            },
          }}
        >
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}

          {isLoading && (
            <Flex justifyContent="flex-start" mb={4}>
              <Box
                maxW="80%"
                bg={colorMode === "light" ? "blue.500" : "blue.200"}
                color={colorMode === "light" ? "white" : "gray.800"}
                p={3}
                borderRadius="lg"
              >
                <Text>Thinking...</Text>
              </Box>
            </Flex>
          )}
        </Box>

        <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
      </Flex>
    </Container>
  );
}

export default ChatInterface;
