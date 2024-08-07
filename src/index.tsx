import React, { ChangeEvent, useState, useEffect, useRef } from "react";
import styled from "styled-components";
import ReactDOM from "react-dom";
import { FaPaperPlane, FaWindowClose } from "react-icons/fa";

const ChatbotWrapper = styled.div<{ isOpen: boolean }>`
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 300px;
  height: 430px;
  border: 1px solid #ccc;
  border-radius: 10px;
  background-color: white;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  display: ${({ isOpen }) => (isOpen ? "flex" : "none")};
  z-index: 1000;
  padding: 10px;
  flex-direction: column;
`;

const ChatbotButton = styled.button`
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
  z-index: 1001;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: transparent;
  font-size: 20px;
  color: #007bff;
  border: none;
  cursor: pointer;

  &:hover {
    color: blue;
  }
`;

const ChatHistory = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 10px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  border: 1px solid #ccc;
  user-select: text; /* Ensure text selection is allowed */
`;

const MessageContainer = styled.div`
  display: flex;
  flex-direction: row;
  word-wrap: break-word;
  width: 100%;
  margin-bottom: 10px;
`;

const MessageSender = styled.strong`
  display: block;
  margin-bottom: 5px;
  margin-right: 2px;
`;

const MessageText = styled.span`
  display: block;
  text-align: left;
  max-width: 100%;
  word-wrap: break-word;
`;

const ChatInputContainer = styled.div`
  display: flex;
  padding-top: 5px;
  padding-bottom: 5px;
  align-items: center;
`;

const ChatInput = styled.textarea`
  flex: 1;
  border: 1px solid #ccc;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
  margin: 0px;
  box-sizing: border-box;
  max-height: 50px;
  min-height: 50px;
  height: 50px;
`;

const ChatSendButton = styled.button`
  background-color: transparent;
  color: #007bff;
  font-size: 16px;
  border: none;
  cursor: pointer;
  &:hover {
    color: blue;
  }
`;

const ErrorMessage = styled.div`
  width: 100%;
  border: 1px solid red;
  background-color: #f8d7da;
  color: #721c24;
  border-radius: 5px;
  text-align: center;
`;

const LoadingMessage = styled.div`
  width: 100%;
  padding: 10px;
  text-align: center;
`;

const Chatbot: React.FC<{ keypass?: string }> = ({ keypass }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>(
    []
  );
  const [name, setName] = useState<string>("Chatbot");
  const [inputValue, setInputValue] = useState("Type your question");
  const [isValidKeypass, setIsValidKeypass] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const chatbotRef = useRef<HTMLDivElement>(null);
  const chatHistoryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && isValidKeypass === null) {
      setIsLoading(true);
      // Simulate server call to validate keypass
      setTimeout(() => {
        setIsLoading(false);
        if (keypass === "valid-key") {
          setName("Client bot name");
          setIsValidKeypass(true);
        } else {
          setIsValidKeypass(false);
        }
      }, 400); // Simulate a 400 millisecond delay for the server call
    }
  }, [isOpen, keypass, isValidKeypass]);

  useEffect(() => {
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
  }, [messages]);

  const toggleChatbot = () => {
    if (isValidKeypass === false) {
      setIsValidKeypass(null); // Reset validation state for revalidation
    }
    setIsOpen(!isOpen);
  };

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
  };

  const chatCompletion = async (
    userMessage: string,
    onMessage: (message: string) => void
  ) => {
    try {
      const response = await fetch(
        `http://localhost:${process.env.REACT_APP_CHATBOT_PORT}/api/chat-completion`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messages: [{ role: "user", content: userMessage }],
          }),
        }
      );

      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let done = false;
      let botMessage = "";

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunkValue = decoder.decode(value);

        // Extract message content from the stream data
        const dataArray = chunkValue.split("\n").filter(Boolean);
        dataArray.forEach((data) => {
          if (data.startsWith("data: ")) {
            const jsonString = data.slice(6).trim();
            if (jsonString !== "[DONE]") {
              try {
                const json = JSON.parse(jsonString);
                const content = json.choices[0].delta.content;
                if (content) {
                  botMessage += content;
                  onMessage(botMessage);
                }
              } catch (e) {
                console.error("Error parsing JSON from stream:", e);
              }
            }
          }
        });
      }
    } catch (error) {
      console.error("Error fetching chat completion:", error);
      onMessage("Sorry, I encountered an error while processing your request.");
    }
  };

  const handleSendMessage = async () => {
    if (inputValue.trim()) {
      const userMessage = inputValue;
      setMessages([...messages, { sender: "user", text: userMessage }]);
      setInputValue("");

      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "bot", text: "..." },
      ]);

      chatCompletion(userMessage, (botMessage) => {
        setMessages((prevMessages) => {
          const updatedMessages = [...prevMessages];
          updatedMessages[updatedMessages.length - 1] = {
            sender: "bot",
            text: botMessage,
          };
          return updatedMessages;
        });
      });
    }
  };

  return (
    <>
      {!isOpen && (
        <ChatbotButton onClick={toggleChatbot}>{"Chat"}</ChatbotButton>
      )}
      <ChatbotWrapper isOpen={isOpen} ref={chatbotRef}>
        <CloseButton onClick={toggleChatbot}>
          <FaWindowClose />
        </CloseButton>
        <h2>{name}</h2>
        {isLoading ? (
          <LoadingMessage>Loading...</LoadingMessage>
        ) : isValidKeypass === false ? (
          <ErrorMessage>
            Error: Chatbot is not registered. Please provide a valid keypass.
          </ErrorMessage>
        ) : (
          <>
            <ChatHistory ref={chatHistoryRef}>
              {messages.map((message, index) => (
                <MessageContainer key={index}>
                  <MessageSender>
                    {message.sender === "user" ? "You: " : "Bot: "}
                  </MessageSender>
                  <MessageText>{message.text}</MessageText>
                </MessageContainer>
              ))}
            </ChatHistory>

            <ChatInputContainer>
              <ChatInput
                rows={2}
                ref={inputRef}
                value={inputValue}
                onChange={handleInputChange}
                placeholder="Type a message..."
              />
              <ChatSendButton onClick={handleSendMessage}>
                <FaPaperPlane />
              </ChatSendButton>
            </ChatInputContainer>
          </>
        )}
      </ChatbotWrapper>
    </>
  );
};

(window as any).injectChatbot = function (options: { keypass: string }) {
  const { keypass } = options;
  const container = document.createElement("div");
  document.body.appendChild(container);
  ReactDOM.render(<Chatbot keypass={keypass} />, container);
};

export default Chatbot;
