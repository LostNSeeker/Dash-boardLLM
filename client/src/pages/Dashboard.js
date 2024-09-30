import React, { useEffect } from "react";
import "./Dashboard.css";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import ChatRoom from "./ChatRoom";
import LLMComparison from "./LLMComparison";
import StudyMaterial from "./StudyMaterial";
import { useAuth } from "../context/AuthContext";

const mapRoute = {
	chatRoom: <ChatRoom />,
	llmComparison: <LLMComparison />,
	studyMaterial: <StudyMaterial />,
};

const Dashboard = ({ mainContent }) => {
	const { loading } = useAuth();

	if (loading) {
		return <div>Loading...</div>;
	}
	return (
		<div className="dashboard-container">
			<Sidebar />
			<div className="main-content">{mapRoute[mainContent]}</div>
		</div>
	);
};

export default Dashboard;
