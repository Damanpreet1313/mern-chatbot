import React, { useState, useRef, useEffect } from "react";
import "./App.css";

function App() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hello! I'm your AI assistant. How can I help?" }
  ]);
  const [typing, setTyping] = useState(false);
  const chatRef = useRef(null);

  useEffect(() => {
    chatRef.current?.scrollTo(0, chatRef.current.scrollHeight);
  }, [messages, typing]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { sender: "user", text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");

    setTyping(true); // show "typing..."
    try {
      const res = await fetch("http://localhost:5000/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();
      const botMsg = {
        sender: "bot",
        text: data.reply || "⚠️ Error: No response"
      };

      setTyping(false);
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      setTyping(false);
      setMessages(prev => [
        ...prev,
        { sender: "bot", text: "⚠️ Server error" },
      ]);
    }
  };

  return (
    <div className="chat-container">
      <header className="chat-header">AI Chatbot</header>

      <div className="chat-box" ref={chatRef}>
        {messages.map((msg, i) => (
          <div key={i} className={`message ${msg.sender}`}>
            {msg.text}
          </div>
        ))}

        {typing && <div className="typing-dot">AI is typing...</div>}
      </div>

      <div className="input-area">
        <input
          className="chat-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Send a message..."
        />
        <button className="send-btn" onClick={sendMessage}>➤</button>
      </div>
    </div>
  );
}

export default App;

