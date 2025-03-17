import {
  Button,
  Flex,
  Input,
  InputGroup,
  InputRightElement,
  Icon,
} from "@chakra-ui/react";
import { SendIcon } from "lucide-react";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { useChatInputStyles } from "../styles/ChatInputStyles";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const ChatInput = forwardRef<HTMLInputElement, ChatInputProps>(
  ({ onSendMessage, isLoading }, ref) => {
    const [message, setMessage] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);
    const isAuthenticated = false;
    const styles = useChatInputStyles();

    useImperativeHandle(ref, () => ({
      ...(inputRef.current as HTMLInputElement),
      focus: () => {
        inputRef.current?.focus();
      },
    }));

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (message.trim() && !isLoading) {
        onSendMessage(message);
        setMessage("");
      }
    };

    return (
      <form onSubmit={handleSubmit} style={{ width: "100%" }}>
        <Flex>
          <InputGroup size="md">
            <Input
              ref={inputRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={
                isAuthenticated
                  ? "Type your message..."
                  : "Login required to interact with Agent0"
              }
              {...styles.input}
              disabled={isLoading || !isAuthenticated}
            />
            <InputRightElement width="4.5rem">
              <Button
                {...styles.button}
                isLoading={isLoading}
                disabled={!isAuthenticated}
              >
                <Icon as={SendIcon} />
              </Button>
            </InputRightElement>
          </InputGroup>
        </Flex>
      </form>
    );
  }
);

export default ChatInput;
