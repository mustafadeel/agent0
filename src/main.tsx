import React from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import { Auth0Provider } from "@auth0/auth0-react";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { theme } from "./theme";
import { Auth0ConfigError } from "./components/Auth0ConfigError";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

const auth0Domain = import.meta.env.AUTH0_DOMAIN;
const auth0ClientId = import.meta.env.AUTH0_CLIENT_ID;
const auth0Audience = import.meta.env.AUTH0_API_AUDIENCE;

root.render(
  <React.StrictMode>
    <BrowserRouter>
      {!auth0Domain || !auth0ClientId ? (
        <Auth0ConfigError />
      ) : (
        <Auth0Provider
          domain={auth0Domain}
          clientId={auth0ClientId}
          authorizationParams={{
            redirect_uri: window.location.origin,
            audience: auth0Audience,
          }}
          cacheLocation="localstorage"
        >
          <ChakraProvider theme={theme}>
            <ColorModeScript initialColorMode={theme.config.initialColorMode} />
            <App />
          </ChakraProvider>
        </Auth0Provider>
      )}
    </BrowserRouter>
  </React.StrictMode>
);
