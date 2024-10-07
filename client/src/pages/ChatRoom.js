import React, { useState, useEffect, useRef } from "react";
import "./ChatRoom.css";
import { useAuth } from "../context/AuthContext";
import { useSearchParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";


const ChatRoom = () => {
  const [messages, setMessages] = useState([]);

  const [showOptions, setShowOptions] = useState(null);
  const [showReactions, setShowReactions] = useState(null);
  const optionsRef = useRef(null); // Ref for detecting clicks outside

  const emojis = ["👍", "❤️", "😂", "😮", "😢", "🔥"];

  // Toggle message options (React/Delete)
  const toggleOptions = (index) => {
    setShowOptions(showOptions === index ? null : index);
    setShowReactions(null); // Close reactions if options are toggled
  };

  // Toggle the reaction emojis popup
  const toggleReactions = (index) => {
    setShowReactions(showReactions === index ? null : index);
    setShowOptions(null); // Close options after selecting react
  };

  // Handle reaction logic: add or remove reaction if clicked again
  const handleReact = (msgIndex, emoji) => {
    const updatedMessages = [...messages];
    if (updatedMessages[msgIndex].reaction === emoji) {
      // If the same emoji is clicked again, remove the reaction
      updatedMessages[msgIndex].reaction = null;
    } else {
      // Otherwise, set the reaction
      updatedMessages[msgIndex].reaction = emoji;
    }
    setMessages(updatedMessages); // Update the state with the new reaction (or removed reaction)
    setShowReactions(null); // Close reaction popup
  };

  // Handle delete logic, remove the message from the list
  const handleDelete = (msgIndex) => {
    const updatedMessages = messages.filter((_, index) => index !== msgIndex);
    setMessages(updatedMessages); // Update the state without the deleted message
    setShowOptions(null); // Close options popup
  };

  // Detect clicks outside the popups and close them
  const handleClickOutside = (event) => {
    if (optionsRef.current && !optionsRef.current.contains(event.target)) {
      setShowOptions(null);
      setShowReactions(null);
    }
  };

  // Attach event listener for clicks outside of the popups
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const { currentUser } = useAuth();

  const [inputValue, setInputValue] = useState("");
  const [username, setUsername] = useState(currentUser.name);
  const ws = useRef(null);

  // Get the username from the URL query string
  const [searchParams] = useSearchParams();
  const queryMessage = searchParams.get("message");

  // Connect to WebSocket server when the component mounts
  useEffect(() => {
    if (queryMessage) {
      setInputValue(queryMessage);
    }

    ws.current = new WebSocket("ws://localhost:5000"); // Adjust the URL if necessary

    ws.current.onopen = () => {
      console.log("Connected to WebSocket server");
      ws.current.send(JSON.stringify({ type: "sync" }));
    };

    // Listen for messages from the server
    ws.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === "sync") {
        setMessages(message.messages);
      } else {
        setMessages((prevMessages) => [...prevMessages, message]);
      }
    };

    ws.current.onclose = () => {
      console.log("Disconnected from WebSocket server");
    };

    // Clean up WebSocket connection on component unmount
    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  // Send a message to the WebSocket server
  const sendMessage = (e) => {
    e.preventDefault();
    if (!inputValue || !username) {
      console.log(inputValue, username);
      return;
    }

    if (inputValue.trim() && username.trim()) {
      const message = {
        content: inputValue,
        sender: username,
        color: currentUser.color,
        timestamp: new Date(),
      };
      ws.current.send(JSON.stringify(message));
      setInputValue("");
    }
  };

  return (
    <div className="chat-room">
      <h2 style={{ textAlign: "center" }}>Chat Room</h2>
      <div className="chat-box">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`chat-message ${
              msg.sender === username ? "self" : "other"
            }`}
            style={{
              textAlign: msg.sender === username ? "right" : "left",
              display: "flex",
              justifyContent:
                msg.sender === username ? "flex-end" : "flex-start",
              position: "relative",
              marginBottom: "10px",
            }}
          >
            {msg.sender !== username && (
              <img
                src={msg.profileImage || "https://via.placeholder.com/30"}
                alt="avatar"
                style={{ borderRadius: "50%", marginRight: "10px" }}
              />
            )}

            <div style={{ position: "relative" }}>
              {/* Replace with Down Arrow Icon, hidden by default */}
              <div
                className="message-options"
                style={{
                  position: "absolute",
                  top: "-13px",
                  cursor: "pointer",
                  fontSize: "15px",
                  color: "black",
                  left: msg.sender === username ? "0" : "auto",
                  right: msg.sender !== username ? "0" : "0",
                }}
                onClick={() => toggleOptions(index)}
              >
                {/* Use Font Awesome Down Arrow Icon */}
                <FontAwesomeIcon icon={faChevronDown} />
              </div>

              {/* Message Content */}
              <div className="message-content">
                {msg.sender !== username && (
                  <strong style={{ color: msg.color }}>{msg.sender}: </strong>
                )}
                {msg.content}
                <span className="timestamp">
                  {" "}
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </span>

                {/* Display the reaction if exists */}
                {msg.reaction && (
                  <span style={{ marginLeft: "10px" }}>{msg.reaction}</span>
                )}
              </div>

              {/* Options for React/Delete */}
              {showOptions === index && (
                <div
                  ref={optionsRef} // Reference to detect clicks outside
                  style={{
                    position: "absolute",
                    top: "-40px",
                    right: msg.sender === username ? "0" : "auto",
                    left: msg.sender !== username ? "0" : "auto",
                    backgroundColor: "#fff",
                    borderRadius: "5px",
                    padding: "5px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                    zIndex: "1",
                  }}
                >
                  <button
                    onClick={() => toggleReactions(index)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#007bff",
                      cursor: "pointer",
                      padding: "5px 10px",
                      fontSize: "14px",
                    }}
                  >
                    React
                  </button>
                  <button
                    onClick={() => handleDelete(index)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#dc3545",
                      cursor: "pointer",
                      padding: "5px 10px",
                      fontSize: "14px",
                    }}
                  >
                    Delete
                  </button>
                </div>
              )}

              {/* Reaction Emojis */}
              {showReactions === index && (
                <div
                  style={{
                    position: "absolute",
                    bottom: "-40px",
                    right: msg.sender === username ? "0" : "auto",
                    left: msg.sender !== username ? "0" : "auto",
                    backgroundColor: "#fff",
                    borderRadius: "5px",
                    padding: "5px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                    zIndex: "1",
                    display: "flex",
                  }}
                >
                  {emojis.map((emoji) => (
                    <span
                      key={emoji}
                      style={{
                        cursor: "pointer",
                        margin: "0 5px",
                        fontSize: "20px",
                      }}
                      onClick={() => handleReact(index, emoji)}
                    >
                      {emoji}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <form className="input-box">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type your message..."
        />
        <button onClick={sendMessage}>Send</button>
      </form>
    </div>
  );
};

export default ChatRoom;
