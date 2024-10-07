import React, { useState, useEffect, useRef } from "react";
import "./ChatRoom.css";
import { useAuth } from "../context/AuthContext";
import { useSearchParams } from "react-router-dom";


const ChatRoom = () => {
	const [messages, setMessages] = useState([]);

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
							display: "flex", // Align image and text side by side
          					justifyContent: msg.sender === username ? "flex-end" : "flex-start", // Position accordingly
							position: "relative", // Required for positioning reactions
						}}
						
					>
						
						{msg.sender !== username && (
          					<img
            					src={msg.profileImage || "https://via.placeholder.com/30"}
            					alt="avatar"
            					style={{ borderRadius: "50%", marginRight: "10px" }} // Profile image style
          					/>
       					 )}

					<div>
						{msg.sender !== username && (
							<strong style={{ color: msg.color }}>{msg.sender}: </strong>
						)}
						{msg.content}
						<span className="timestamp">
							{" "}
							{new Date(msg.timestamp).toLocaleTimeString()}
						</span>

						
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
