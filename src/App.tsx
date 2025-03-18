import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { useColorMode } from "@chakra-ui/react";
import { useAuth0 } from "@auth0/auth0-react";
import ChatInterface from "./components/ChatInterface";
import Profile from "./components/Profile";

// Define message type
type Message = {
  id: string;
  content: string;
  role: "user" | "assistant";
};

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const { colorMode, toggleColorMode } = useColorMode();
  
  // TODO: Add getAccessTokenSilently function
  const { loginWithRedirect, isAuthenticated } = useAuth0();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello! I am an AI assistant, designed to demonstrate First Party API calls for AI agents with Auth0. Ask me about yourself.",
      role: "assistant",
    },
  ]);

  const handleSendMessage = async (message: string) => {
    if (!isAuthenticated) {
      loginWithRedirect();
      return;
    }

    if (!message.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: message,
      role: "user",
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    // TODO: Add API call to /agent endpoint with an Access Token

  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          <ChatInterface
            messages={messages}
            isLoading={isLoading}
            colorMode={colorMode}
            toggleColorMode={toggleColorMode}
            handleSendMessage={handleSendMessage}
          />
        }
      />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  );
}

export default App;
