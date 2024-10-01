const axios = require("axios");

const { OpenAI } = require("openai");
const { Anthropic } = require("@anthropic-ai/sdk");

async function getChatGPTResponse(question) {
	const apiKey = process.env.OPENAI_API_KEY;
	const openai = new OpenAI({ apiKey });

	const completion = await openai.chat.completions.create({
		messages: [
			{ role: "system", content: "You are a helpful assistant." },
			{ role: "user", content: question },
		],
		model: "gpt-4o",
	});
	return completion.choices[0].message.content;
}

async function getClaudeResponse(question) {
	// return "Claude response";
	const apiKey = process.env.CLAUDE_API_KEY;
	const anthropic = new Anthropic({
		apiKey, // defaults to process.env["ANTHROPIC_API_KEY"]
	});

	const msg = await anthropic.messages.create({
		model: "claude-3-5-sonnet-20240620",
		max_tokens: 1024,
		messages: [{ role: "user", content: "Hello, Claude" }],
	});
	console.log(msg);
	return msg.content[0].text;
}

async function getGroqResponse(question) {
	return "Groq response";

	const apiKey = "YOUR_GROQ_API_KEY";
	const response = await axios.post(
		"https://api.groq.com/v1/groq",
		{
			prompt: question,
			max_tokens: 100,
		},
		{
			headers: {
				Authorization: `Bearer ${apiKey}`,
				"Content-Type": "application/json",
			},
		}
	);
	return response.data.choices[0].text.trim();
}

exports.postQueryWithImage = async (req, res) => {
	const { question } = req.body;
	const image = req.file;

	console.log("Query:", question);
	console.log("Image:", image);

	// Add your logic to handle the request here

	res.json({
		chatgpt: {
			question,
			qImage: image,
			response: "ChatGPT response",
		},
		claude: {
			question,
			qImage: image,
			response: "Claude response",
		},
		groq: {
			question,
			qImage: image,
			response: "Groq response",
		},
	});
};

exports.postQueryWithoutImage = async (req, res) => {
	const question = req.query.question;
	console.log("Received question:", question);

	const responses = {
		chatgpt: { question, response: null },
		claude: { question, response: null },
		groq: { question, response: null },
	};

	try {
		responses.chatgpt.response = await getChatGPTResponse(question);
	} catch (error) {
		console.error("Error fetching ChatGPT response:", error);
		responses.chatgpt.response = "Error fetching ChatGPT response";
	}

	try {
		responses.claude.response = await getClaudeResponse(question);
	} catch (error) {
		console.error("Error fetching Claude response:", error);
		responses.claude.response = "Error fetching Claude response";
	}

	try {
		responses.groq.response = await getGroqResponse(question);
	} catch (error) {
		console.error("Error fetching Groq response:", error);
		responses.groq.response = "Error fetching Groq response";
	}

	res.json(responses);
};
