import { Box, Flex, Text, useColorMode } from "@chakra-ui/react";

type Message = {
  id: string;
  content: string;
  role: "user" | "assistant";
};

interface ChatMessageProps {
  message: Message;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const { colorMode } = useColorMode();
  const isUser = message.role === "user";

  return (
    <Flex justifyContent={isUser ? "flex-end" : "flex-start"} mb={4}>
      <Box
        maxW="80%"
        bg={
          isUser
            ? colorMode === "light"
              ? "blue.500"
              : "blue.200"
            : colorMode === "light"
            ? "gray.200"
            : "gray.600"
        }
        color={
          isUser
            ? colorMode === "light"
              ? "white"
              : "gray.800"
            : colorMode === "light"
            ? "gray.800"
            : "white"
        }
        p={3}
        borderRadius="lg"
      >
        <Text>{message.content}</Text>
      </Box>
    </Flex>
  );
}
