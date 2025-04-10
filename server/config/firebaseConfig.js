var admin = require("firebase-admin");

const serviceAccountPath =
	process.env.NODE_ENV === "production"
		? "/etc/secrets/serviceAccountKey.json"
		: "./serverJson.json";

console.log("Service Account Path:", serviceAccountPath);

var serviceAccount = require("./serverJson.json");

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: "https://dashboard-llm-default-rtdb.firebaseio.com",
});

console.log("Firebase Admin SDK initialized successfully.");

const db = admin.firestore();

console.log("Firestore database initialized successfully.");
module.exports = db;
