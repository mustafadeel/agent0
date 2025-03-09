import { Box, Flex } from "@chakra-ui/react";
import { useChatMessageStyles } from "../styles/ChatMessageStyles";
import ReactMarkdown from "react-markdown";
import ChakraUIRenderer from "chakra-ui-markdown-renderer";

type Message = {
  id: string;
  content: string;
  role: "user" | "assistant";
};

interface ChatMessageProps {
  message: Message;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <Flex justifyContent={isUser ? "flex-end" : "flex-start"} mb={4}>
      <Box {...useChatMessageStyles(message)}>
        <ReactMarkdown components={ChakraUIRenderer()}>{message.content}</ReactMarkdown>
      </Box>
    </Flex>
  );
}
