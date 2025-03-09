import { useColorMode } from "@chakra-ui/react";
import { Message } from "@/types";
  
export const useChatMessageStyles = (message: Message) => {
  const { colorMode } = useColorMode();
  const isUser = message.role === "user";

  return {
    maxW: "80%",
    bg: isUser
      ? colorMode === "light"
        ? "blue.500"
        : "blue.200"
      : colorMode === "light"
      ? "gray.200"
      : "gray.600",
    color: isUser
      ? colorMode === "light"
        ? "white"
        : "gray.800"
      : colorMode === "light"
      ? "gray.800"
      : "white",
    p: 3,
    borderRadius: "lg",
  };
};