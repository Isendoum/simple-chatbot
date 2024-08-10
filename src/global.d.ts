interface Window {
  injectChatbot: (options: { keypass: string }) => void;
}

interface Message {
  sender: "user" | "bot";
  text: string;
}
