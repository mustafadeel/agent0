import { useColorMode } from "@chakra-ui/react";

export const useChatInputStyles = () => {
  const { colorMode } = useColorMode();

  return {
    input: {
      pr: "4.5rem",
      bg: colorMode === "light" ? "white" : "gray.700",
      borderColor: colorMode === "light" ? "gray.300" : "gray.600",
      _hover: {
        borderColor: colorMode === "light" ? "blue.500" : "blue.300",
      },
      _focus: {
        borderColor: colorMode === "light" ? "blue.500" : "blue.300",
        boxShadow: `0 0 0 1px ${
          colorMode === "light" ? "blue.500" : "blue.300"
        }`,
      },
    },
    button: {
      h: "1.75rem",
      size: "sm",
      type: "submit",
      colorScheme: "blue",
    },
  };
};
