import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// A protected route component that redirects unauthenticated users to the login page
const ProtectedRoute = ({ children }) => {
	const { currentUser } = useAuth();

	if (!currentUser) {
		return <Navigate to="/" />; // Redirect to login if not authenticated
	}

	return children;
};

export default ProtectedRoute;
