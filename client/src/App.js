import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import PhoneSignIn from "./pages/PhoneSignIn";
import Header from "./components/Header";
import "./App.css";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoutes";

function App() {
	return (
		<AuthProvider>
			<Router>
				<Header />
				<main>
					<Routes>
						<Route path="/" element={<PhoneSignIn />} />
						<Route
							path="/dashboard"
							element={
								<ProtectedRoute>
									<Dashboard mainContent="chatRoom" />
								</ProtectedRoute>
							}
						/>
						<Route
							path="/llm-comparison"
							element={
								<ProtectedRoute>
									<Dashboard mainContent="llmComparison" />
								</ProtectedRoute>
							}
						/>
						<Route
							path="/study-material"
							element={
								<ProtectedRoute>
									<Dashboard mainContent="studyMaterial" />
								</ProtectedRoute>
							}
						/>
						<Route path="*" element={<PhoneSignIn />} />
					</Routes>
				</main>
			</Router>
		</AuthProvider>
	);
}

export default App;
