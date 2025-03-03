import type React from "react";

import { useState } from "react";
import {
  Button,
  Flex,
  Input,
  InputGroup,
  InputRightElement,
  useColorMode,
  Icon,
} from "@chakra-ui/react";
import { SendIcon } from "lucide-react";

import { useAuth0 } from "@auth0/auth0-react";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

export default function ChatInput({
  onSendMessage,
  isLoading,
}: ChatInputProps) {
  const [message, setMessage] = useState("");
  const { colorMode } = useColorMode();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message);
      setMessage("");
    }
  };

  const { isAuthenticated } = useAuth0();

  return (
    <form onSubmit={handleSubmit} style={{ width: "100%" }}>
      <Flex>
        <InputGroup size="md">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={
              isAuthenticated
                ? "Type your message..."
                : "Login required to interact with Agent0"
            }
            pr="4.5rem"
            bg={colorMode === "light" ? "white" : "gray.700"}
            borderColor={colorMode === "light" ? "gray.300" : "gray.600"}
            _hover={{
              borderColor: colorMode === "light" ? "blue.500" : "blue.300",
            }}
            _focus={{
              borderColor: colorMode === "light" ? "blue.500" : "blue.300",
              boxShadow: `0 0 0 1px ${
                colorMode === "light" ? "blue.500" : "blue.300"
              }`,
            }}
            disabled={isLoading}
          />
          <InputRightElement width="4.5rem">
            <Button
              h="1.75rem"
              size="sm"
              type="submit"
              colorScheme="blue"
              isLoading={isLoading}
              disabled={!message.trim() || isLoading}
              aria-label="Send message"
            >
              <Icon as={SendIcon} boxSize={4} />
            </Button>
          </InputRightElement>
        </InputGroup>
      </Flex>
    </form>
  );
}
