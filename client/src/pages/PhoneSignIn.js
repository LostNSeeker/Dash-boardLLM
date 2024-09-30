import React, { useEffect, useState } from "react";
import { getAuth, signInWithPhoneNumber } from "firebase/auth";
import { setupRecaptcha } from "../services/firebaseConfig";
import { useNavigate } from "react-router-dom";
import "./PhoneSignIn.css";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

const getRandomColor = () => {
	const colors = [
		"#FF5733",
		"#33FF57",
		"#3357FF",
		"#F333FF",
		"#FF33A1",
		"#33FFF5",
		"#FF8C33",
		"#33FF8C",
		"#8C33FF",
		"#FF338C",
		"#33FF33",
		"#338CFF",
		"#FF5733",
		"#33FF57",
		"#3357FF",
		"#F333FF",
		"#FF33A1",
		"#33FFF5",
		"#FF8C33",
		"#33FF8C",
		"#8C33FF",
		"#FF338C",
		"#33FF33",
		"#338CFF",
	];
	return colors[Math.floor(Math.random() * colors.length)];
};

const PhoneSignIn = () => {
	const [phoneNumber, setPhoneNumber] = useState("");
	const [otp, setOtp] = useState("");
	const [name, setName] = useState("");
	const [rollNumber, setRollNumber] = useState("");
	const [confirmationResult, setConfirmationResult] = useState(null);
	const [showRecaptcha, setShowRecaptcha] = useState(true);
	const [isSignUp, setIsSignUp] = useState(false);

	const navigate = useNavigate();

	const auth = getAuth();

	const { setCurrentUser, currentUser } = useAuth();

	useEffect(() => {
		const user = currentUser;
		console.log(currentUser);
		if (user) {
			navigate("/dashboard");
		}
	}, [currentUser, navigate]);

	const handlePhoneSubmit = async (e) => {
		e.preventDefault();
		if (!phoneNumber) {
			toast.error("Please enter a valid phone number");
			return;
		}

		if (isSignUp && (!name || !rollNumber)) {
			toast.error("Please enter name and roll number");
			return;
		}

		console.log("+91" + phoneNumber);
		const recaptchaVerifier = setupRecaptcha("recaptcha-container");

		window.recaptchaVerifier = recaptchaVerifier;

		try {
			const result = await signInWithPhoneNumber(
				auth,
				"+91" + phoneNumber,
				recaptchaVerifier
			);

			window.confirmationResult = result;
			setConfirmationResult(result);
			toast.success("OTP sent successfully");
		} catch (error) {
			console.error("Error sending OTP:", error);
			toast.error("Error sending OTP");
		}
	};

	const verifyOTP = async () => {
		if (!otp) {
			toast.error("Please enter the OTP");
			return;
		}
		try {
			const result = await confirmationResult.confirm(otp);
			const idToken = await result.user.getIdToken();
			toast.success("Phone verified");

			const endpoint = isSignUp
				? "http://localhost:5000/api/auth/signup"
				: "http://localhost:5000/api/auth/login";

			const body = isSignUp
				? { idToken, name, rollNumber, phoneNumber, color: getRandomColor() }
				: { idToken };

			// You can now send the idToken to the backend for verification
			fetch(endpoint, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(body),
			})
				.then(async (res) => {
					if (res.status !== 200) {
						toast.error("User Not Found");
					}
					return await res.json();
				})
				.then((data) => {
					console.log(data);

					if (
						data.message === "User already registered" ||
						data.message === "User found"
					) {
						toast.success("User found");
						toast.info("Redirecting to dashboard...");
						setCurrentUser(data.userData);
						setTimeout(() => {
							navigate("/dashboard");
						}, 3000);
					}

					if (data.message === "User details saved successfully") {
						toast.success("User registered");
						toast.info("Redirecting to dashboard...");
						setCurrentUser(data.userData);

						setTimeout(() => {
							navigate("/dashboard");
						}, 3000);
					}
				});
		} catch (error) {
			toast.error("Invalid OTP");
			console.error("Error verifying OTP:", error);
		}
	};

	return (
		<div className="phone-signin-container">
			<h2>{isSignUp ? "Sign Up" : "Login"} with Phone</h2>
			<form onSubmit={handlePhoneSubmit}>
				<input
					type="text"
					value={phoneNumber}
					minLength="10"
					maxLength="10"
					onChange={(e) => setPhoneNumber(e.target.value)}
					placeholder="Enter phone number"
				/>
				{isSignUp && (
					<>
						<input
							type="text"
							value={name}
							onChange={(e) => setName(e.target.value)}
							placeholder="Enter your name"
						/>
						<input
							type="text"
							value={rollNumber}
							onChange={(e) => setRollNumber(e.target.value)}
							placeholder="Enter your roll number"
						/>
					</>
				)}
				<button type="submit">Send OTP</button>
			</form>

			<div id="recaptcha-container"></div>

			{confirmationResult && (
				<div className="otp-container">
					<input
						type="text"
						value={otp}
						onChange={(e) => setOtp(e.target.value)}
						placeholder="Enter OTP"
					/>
					<button onClick={verifyOTP}>Verify OTP</button>
				</div>
			)}

			<button onClick={() => setIsSignUp(!isSignUp)}>
				Switch to {isSignUp ? "Login" : "Sign Up"}
			</button>
		</div>
	);
};

export default PhoneSignIn;
