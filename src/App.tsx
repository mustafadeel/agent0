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
  const { loginWithRedirect, isAuthenticated, getAccessTokenSilently } = useAuth0();
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

    // Add user message to chat
    const userMessage: Message = {
      id: Date.now().toString(),
      content: message,
      role: "user",
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const token = await getAccessTokenSilently({
      });

      const response = await fetch(
        `${import.meta.env.AUTH0_API_HOST}/chat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify({
            messages: [...messages, userMessage].map(({ content, role }) => ({
              content,
              role,
            })),
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      const data = await response.json();

      // Add AI response to chat
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response,
        role: "assistant",
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error sending message:", error);

      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Sorry, I encountered an error. Please try again.",
        role: "assistant",
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
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
