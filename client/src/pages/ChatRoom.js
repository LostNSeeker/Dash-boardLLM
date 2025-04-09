import React, { useState, useEffect, useRef } from "react";
import "./ChatRoom.css";
import { useAuth } from "../context/AuthContext";
import { useSearchParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faChevronDown,
	faSmile,
	faTrash,
} from "@fortawesome/free-solid-svg-icons";

const ChatRoom = () => {
	const [messages, setMessages] = useState([]);

	const [showOptions, setShowOptions] = useState(null);
	const [showReactions, setShowReactions] = useState(null);
	const optionsRef = useRef(null); // Ref for detecting clicks outside
	const chatBoxRef = useRef(null); // Ref for chat box

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

	// Scroll to bottom function
	const scrollToBottom = () => {
		if (chatBoxRef.current) {
			chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
		}
	};

	// Connect to WebSocket server when the component mounts
	useEffect(() => {
		if (queryMessage) {
			setInputValue(queryMessage);
		}

		ws.current = new WebSocket(`${process.env.REACT_APP_BACKEND_WS_URL}`); // Adjust the URL if necessary

		ws.current.onopen = () => {
			console.log("Connected to WebSocket server");
			ws.current.send(JSON.stringify({ type: "sync" }));
		};

		// Listen for messages from the server
		ws.current.onmessage = (event) => {
			const message = JSON.parse(event.data);
			if (message.type === "sync") {
				setMessages(message.messages);
				setTimeout(scrollToBottom, 100); // Scroll after messages are rendered
			} else {
				setMessages((prevMessages) => [...prevMessages, message]);
				setTimeout(scrollToBottom, 100); // Scroll after new message is added
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

	// Add effect to scroll on messages change
	useEffect(() => {
		scrollToBottom();
	}, [messages]);

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
			<h2>Chat Room</h2>
			<div className="chat-box" ref={chatBoxRef}>
				{messages.map((msg, index) => (
					<div
						key={index}
						className={`chat-message ${
							msg.sender === username ? "self" : "other"
						}`}
					>
						<div className="message-wrapper">
							{msg.sender !== username && (
								<img
									src={
										msg.profileImage ||
										`https://api.dicebear.com/6.x/micah/svg?seed=${msg.sender}`
									}
									alt="avatar"
									className="avatar"
								/>
							)}

							<div className="message-content-wrapper">
								{msg.sender !== username && (
									<span className="sender-name" style={{ color: msg.color }}>
										{msg.sender}
									</span>
								)}

								<div className="message-content">
									<div
										className="message-options"
										onClick={() => toggleOptions(index)}
									>
										<FontAwesomeIcon icon={faChevronDown} />
									</div>

									{msg.content}
									<span className="timestamp">
										{new Date(msg.timestamp).toLocaleTimeString([], {
											hour: "2-digit",
											minute: "2-digit",
										})}
									</span>
									{msg.reaction && (
										<div className="message-reaction">{msg.reaction}</div>
									)}
								</div>

								{showOptions === index && (
									<div className="message-options-popup" ref={optionsRef}>
										<button
											className="react-button"
											onClick={() => toggleReactions(index)}
										>
											<FontAwesomeIcon icon={faSmile} />
											<span className="button-text">React</span>
										</button>
										<button
											className="delete-button"
											onClick={() => handleDelete(index)}
										>
											<FontAwesomeIcon icon={faTrash} />
											<span className="button-text">Delete</span>
										</button>
									</div>
								)}

								{showReactions === index && (
									<div className="reactions-popup">
										{emojis.map((emoji) => (
											<span
												key={emoji}
												className="reaction-emoji"
												onClick={() => handleReact(index, emoji)}
												role="button"
												aria-label={`React with ${emoji}`}
											>
												{emoji}
											</span>
										))}
									</div>
								)}
							</div>
						</div>
					</div>
				))}
			</div>

			<form className="input-box" onSubmit={sendMessage}>
				<input
					type="text"
					value={inputValue}
					onChange={(e) => setInputValue(e.target.value)}
					placeholder="Type your message..."
				/>
				<button type="submit">Send</button>
			</form>
		</div>
	);
};

export default ChatRoom;
