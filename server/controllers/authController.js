const { getAuth } = require("firebase-admin/auth");
const db = require("../config/firebaseConfig"); // Firestore DB setup

exports.verifyAndSaveUser = async (req, res) => {
	const { idToken, name, rollNumber, phoneNumber, color } = req.body;

	try {
		// Verify the Firebase ID token from the client
		const decodedToken = await getAuth().verifyIdToken(idToken);
		const uid = decodedToken.uid;

		// Check if the user already exists in Firestore
		const userDoc = await db.collection("users").doc(uid).get();
		console.log(userDoc);
		if (userDoc.exists) {
			// User already exists, return existing user data
			const existingUserData = userDoc.data();
			return res.status(200).json({
				message: "User already registered",
				userData: existingUserData,
			});
		}

		// If user does not exist, save new user details
		await db.collection("users").doc(uid).set({
			uid: uid,
			name: name,
			rollNumber: rollNumber,
			phoneNumber: phoneNumber,
			color,
			createdAt: new Date().toISOString(),
		});

		const data = {
			uid: uid,
			name: name,
			rollNumber: rollNumber,
			phoneNumber: phoneNumber,
			photoUrl:
				"https://t4.ftcdn.net/jpg/02/29/75/83/360_F_229758328_7x8jwCwjtBMmC6rgFzLFhZoEpLobB6L8.jpg",
			color,
			createdAt: new Date().toISOString(),
		};

		res
			.status(200)
			.json({ message: "User details saved successfully", userData: data });
	} catch (error) {
		console.error("Error verifying token and saving user details:", error);
		res.status(500).json({ error: "Error saving user details" });
	}
};

exports.verifyUser = async (req, res) => {
	const { idToken } = req.body;

	try {
		// Verify the Firebase ID token from the client
		const decodedToken = await getAuth().verifyIdToken(idToken);
		const uid = decodedToken.uid;

		// Check if the user already exists in Firestore
		const userDoc = await db.collection("users").doc(uid).get();

		if (!userDoc.exists) {
			// User does not exist, return error
			return res.status(404).json({ error: "User not found" });
		}

		// If user exists, return user data
		const userData = userDoc.data();
		res.status(200).json({ message: "User found", userData });
	} catch (error) {
		console.error("Error verifying token and fetching user details:", error);
		res.status(500).json({ error: "Error fetching user details" });
	}
};

exports.getUser = async (req, res) => {
	const { uid } = req.body;
	console.log("Received data:", req.body);

	try {
		// Fetch user data from Firestore
		const userDoc = await db.collection("users").doc(uid).get();

		console.log("User document:", userDoc.data());

		if (!userDoc.exists) {
			// User does not exist, return error
			console.log("User not found in Firestore for UID:", uid);
			return res.status(404).json({ error: "User not found" });
		}

		// If user exists, return user data
		const userData = userDoc.data();
		console.log("User data fetched successfully:", userData);
		res.status(200).json({ message: "User found", userData });
	} catch (error) {
		console.error("Error fetching user details:", error);
		if (error.code === 16) {
			console.error(
				"UNAUTHENTICATED error: Ensure the service account key is valid and has the correct permissions."
			);
		}
		res.status(500).json({ error: "Error fetching user details" });
	}
};
