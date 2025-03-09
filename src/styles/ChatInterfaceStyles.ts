import { useColorMode } from "@chakra-ui/react";

export const useChatInterfaceStyles = () => {
  const { colorMode } = useColorMode();

  return {
    container: {
      maxW: "container.md",
      h: "100vh",
      p: 4,
    },
    flex: {
      direction: "column" as const,
      h: "full",
    },
    headerFlex: {
      justifyContent: "space-between",
      alignItems: "center",
      mb: 6,
    },
    iconButtonHover: {
      bg: colorMode === "light" ? "gray.100" : "gray.700",
    },
    box: {
      flex: "1",
      overflowY: "auto" as const,
      borderRadius: "md",
      bg: colorMode === "light" ? "gray.50" : "gray.700",
      p: 4,
      mb: 4,
      sx: {
        "&::-webkit-scrollbar": {
          width: "8px",
        },
        "&::-webkit-scrollbar-track": {
          width: "10px",
          background: colorMode === "light" ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.05)",
        },
        "&::-webkit-scrollbar-thumb": {
          background: colorMode === "light" ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.2)",
          borderRadius: "24px",
        },
      },
    },
    thinkingBox: {
      maxW: "80%",
      bg: colorMode === "light" ? "blue.500" : "blue.200",
      color: colorMode === "light" ? "white" : "gray.800",
      p: 3,
      borderRadius: "lg",
    },
  };
};