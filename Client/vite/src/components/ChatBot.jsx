import { useState } from "react";

const ChatBot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hi! I’m CineBot 🎬 How can I help you?", sender: "bot" },
  ]);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMsg = { text: input, sender: "user" };
    const botReply = {
      text: "Thanks for your question! Our support team will assist you soon.",
      sender: "bot",
    };

    setMessages([...messages, userMsg, botReply]);
    setInput("");
  };

  return (
    <div className="chatbot">
      {open && (
        <div className="chat-window">
          <div className="chat-header">CineBot Help</div>
          <div className="chat-messages">
            {messages.map((msg, i) => (
              <div key={i} className={msg.sender === "bot" ? "bot-msg" : "user-msg"}>
                {msg.text}
              </div>
            ))}
          </div>
          <div className="chat-input">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask something..."
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      )}
      <button className="chat-toggle" onClick={() => setOpen(!open)}>
        🤖
      </button>
    </div>
  );
};

export default ChatBot;
