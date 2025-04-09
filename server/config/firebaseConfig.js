var admin = require("firebase-admin");

var serviceAccount = require("./serverJson.json");

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: "https://dashboard-llm-default-rtdb.firebaseio.com"
});

console.log("Firebase Admin SDK initialized successfully.");

const db = admin.firestore();

console.log("Firestore database initialized successfully.");
module.exports = db;
