import React, { useState } from "react";
import "./Header.css";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Header = () => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const { currentUser, logout } = useAuth();
	const navigate = useNavigate();

	const getGreeting = () => {
		const currentHour = new Date().getHours();
		if (currentHour < 12) {
			return "Good Morning";
		} else if (currentHour < 18) {
			return "Good Afternoon";
		} else {
			return "Good Evening";
		}
	};

	const handleLogout = async () => {
		setIsModalOpen(false);
		try {
			await logout();
			navigate("/"); // Redirect to login page after logout
		} catch (error) {
			console.error("Failed to logout", error);
		}
	};

	const greetingMessage = currentUser
		? `${getGreeting()}, ${currentUser.name}`
		: "Please login";

	return (
		<header className="header">
			<div className="company-name">
				<h1>Interactive Learning Assistant</h1>
			</div>
			<div className="user-greeting">
				<h3>{greetingMessage}</h3>
			</div>
			{currentUser && (
				<>
					<div className="user-circle" onClick={() => setIsModalOpen(true)}>
						<img
							className="user-img"
							src={currentUser.photoUrl}
							alt={currentUser.name}
						/>
					</div>
					{isModalOpen && (
						<div className="modal" style={{ color: "black" }}>
							<div className="modal-content">
								<h2>User Details</h2>
								<img
									className="user-img"
									src={currentUser.photoUrl}
									alt={currentUser.name}
								/>
								<p>
									<strong>Name:</strong> {currentUser.name}
								</p>
								<p>
									<strong>Phone:</strong> {currentUser.phoneNumber}
								</p>
								<p>
									<strong>Roll No:</strong> {currentUser.rollNumber}
								</p>
								<button onClick={handleLogout}>Logout</button>
								<button onClick={() => setIsModalOpen(false)}>Close</button>
							</div>
						</div>
					)}
				</>
			)}
		</header>
	);
};

export default Header;
