const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const dotenv = require("dotenv");
const llmRoutes = require("./routes/llmRoutes");
const authRoutes = require("./routes/authRoutes");
const path = require("path");
const cors = require("cors");
const db = require("./config/firebaseConfig");

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/llm", llmRoutes);

// Create an HTTP server
const server = http.createServer(app);

// Create a WebSocket server
const wss = new WebSocket.Server({ server });

// Store active connections
let clients = [];

// Broadcast a message to all clients
function broadcastMessage(data) {
	clients.forEach((client) => {
		if (client.readyState === WebSocket.OPEN) {
			client.send(JSON.stringify(data));
		}
	});
}

// Store message in Firebase
async function storeMessage(message) {
	try {
		await db.collection("messages").add(message);
	} catch (error) {
		console.error("Error storing message:", error);
	}
}

// Retrieve messages from Firebase
async function retrieveMessages() {
	try {
		const snapshot = await db.collection("messages").orderBy("timestamp").get();
		return snapshot.docs.map((doc) => doc.data());
	} catch (error) {
		console.error("Error retrieving messages:", error);
		return [];
	}
}

// Set up WebSocket server
wss.on("connection", (ws) => {
	console.log("A new client connected!");
	clients.push(ws);

	// Handle incoming messages
	ws.on("message", async (message) => {
		const parsedMessage = JSON.parse(message);
		console.log("Received:", parsedMessage);

		if (parsedMessage.type === "sync") {
			const messages = await retrieveMessages();
			ws.send(JSON.stringify({ type: "sync", messages }));
		} else {
			await storeMessage(parsedMessage);
			broadcastMessage(parsedMessage);
		}
	});

	// Handle client disconnection
	ws.on("close", () => {
		console.log("A client disconnected");
		clients = clients.filter((client) => client !== ws);
	});
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
