import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  IconButton,
} from "@chakra-ui/react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { MoonIcon, SunIcon, UserIcon } from "lucide-react";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import { Message } from "@/types";
import { useRef, useEffect } from "react";
import { useChatInterfaceStyles } from "../styles/ChatInterfaceStyles";

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
  // const { loginWithRedirect, isAuthenticated } = useAuth0();
  // const navigate = useNavigate();
  const chatInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const styles = useChatInterfaceStyles();

  const handleSendMessageWrapper = async (message: string) => {
    await handleSendMessage(message);
    chatInputRef.current?.focus();
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <Container {...styles.container}>
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
              _hover={styles.iconButtonHover}
            />
            {/* {isAuthenticated ? (
              <Button
                leftIcon={<UserIcon size={20} />}
                onClick={() => navigate("/profile")}
                variant="ghost"
              >
                Profile
              </Button>
            ) : (
              <Button onClick={() => loginWithRedirect()}>Log In</Button>
            )} */}
          </Flex>
        </Flex>
        <Box {...styles.box}>
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          <div ref={messagesEndRef} />
          {isLoading && (
            <Flex justifyContent="flex-start" mb={4}>
              <Box {...styles.thinkingBox}>
                <ReactMarkdown>Thinking...</ReactMarkdown>
              </Box>
            </Flex>
          )}
        </Box>

        <ChatInput
          ref={chatInputRef}
          onSendMessage={handleSendMessageWrapper}
          isLoading={isLoading}
        />
      </Flex>
    </Container>
  );
}

export default ChatInterface;
