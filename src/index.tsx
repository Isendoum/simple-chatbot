"use client";
import React, { ChangeEvent, useState, useEffect, useRef } from "react";
import styled from "styled-components";
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
  user-select: text;
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

const LoadingMessage = styled.div`
  width: 100%;
  padding: 10px;
  text-align: center;
`;

interface Message {
  sender: "user" | "bot";
  text: string;
}

interface ChatbotProps {
  botName?: string;
  messages: Message[];
  onSendMessage: (message: string) => void;
}

const Chatbot: React.FC<ChatbotProps> = ({
  botName = "Chatbot",
  messages,
  onSendMessage,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const chatHistoryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && chatHistoryRef.current) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
  }, [isOpen, messages]);

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
  };

  const handleSendMessage = () => {
    if (onSendMessage && inputValue.trim()) {
      onSendMessage(inputValue);
      setInputValue("");
    }
  };

  return (
    <>
      {!isOpen && (
        <ChatbotButton onClick={toggleChatbot}>{"Chat"}</ChatbotButton>
      )}
      <ChatbotWrapper isOpen={isOpen} ref={chatHistoryRef}>
        <CloseButton onClick={toggleChatbot}>
          <FaWindowClose />
        </CloseButton>
        <h2>{botName}</h2>
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
      </ChatbotWrapper>
    </>
  );
};

export default Chatbot;
