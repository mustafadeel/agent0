import {
  extendTheme,
  type ThemeConfig,
  type StyleFunctionProps,
} from "@chakra-ui/react";

const config: ThemeConfig = {
  initialColorMode: "light",
  useSystemColorMode: false,
};

// Add more specific color mode styles
export const theme = extendTheme({
  config,
  styles: {
    global: (props: StyleFunctionProps) => ({
      body: {
        bg: props.colorMode === "light" ? "white" : "gray.800",
        color: props.colorMode === "light" ? "gray.800" : "white",
      },
    }),
  },
  // Add specific component styles
  components: {
    Button: {
      baseStyle: (props: StyleFunctionProps) => ({
        _hover: {
          bg: props.colorMode === "light" ? "gray.100" : "gray.700",
        },
      }),
    },
  },
});
