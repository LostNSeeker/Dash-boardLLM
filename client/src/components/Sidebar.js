import React from "react";
import "./Sidebar.css";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
	return (
		<nav className="sidebar">
			<ul>
				<li>
					<NavLink to="/dashboard">Dashboard</NavLink>
				</li>
				<li>
					<NavLink to="/study-material">Study Material</NavLink>
				</li>
				<li>
					<NavLink to="/llm-comparison">LLM Comparison</NavLink>
				</li>
			</ul>
		</nav>
	);
};

export default Sidebar;
