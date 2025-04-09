const admin = require("firebase-admin");

// Ensure the Firebase Admin SDK is initialized with a service account key
if (!admin.apps.length) {
	admin.initializeApp({
		credential: admin.credential.cert(require("./serverJson.json")),
		databaseURL: "https://dashboard-llm-default-rtdb.firebaseio.com", // Replace <your-project-id> with your Firebase project ID
	});

	console.log("Firebase Admin SDK initialized successfully.");
}

const db = admin.firestore();

console.log("Firestore database initialized successfully.");
module.exports = db;
