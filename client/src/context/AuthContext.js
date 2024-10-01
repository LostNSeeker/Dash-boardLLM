import React, { createContext, useContext, useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";

// Create the AuthContext
const AuthContext = createContext();

// Custom hook to access the AuthContext
export const useAuth = () => useContext(AuthContext);

// AuthProvider component that wraps the app
export const AuthProvider = ({ children }) => {
	const [currentUser, setCurrentUser] = useState(null);
	const [loading, setLoading] = useState(true);

	const auth = getAuth();

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			if (user) {
				fetch("http://localhost:5000/api/auth/getUser", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						uid: user.uid,
					}),
				})
					.then((res) => res.json())
					.then((data) => {
						setCurrentUser(data.userData);
						setLoading(false);
					})
					.catch((error) => {
						console.error("Error:", error);
					});
			}
			setLoading(false)
		});

		return unsubscribe; // Cleanup subscription on unmount
	}, [auth]);

	const logout = () => {
		setCurrentUser(null);
		return signOut(auth);
	};

	const value = {
		currentUser,
		logout,
		loading,
		setCurrentUser,
	};

	return (
		<AuthContext.Provider value={value}>
			{!loading && children}{" "}
			{/* Don't render children until loading is complete */}
		</AuthContext.Provider>
	);
};
