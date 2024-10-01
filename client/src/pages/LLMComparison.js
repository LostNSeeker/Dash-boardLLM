import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./LLMComparison.css";

const LLMComparison = () => {
	const [question, setQuestion] = useState("");
	const [image, setImage] = useState(null);
	const [responses, setResponses] = useState({
		chatgpt: [],
		claude: [],
		groq: [],
	});
	const chatgptRef = useRef(null);
	const claudeRef = useRef(null);
	const groqRef = useRef(null);
	const navigate = useNavigate();

	const { currentUser } = useAuth();

	const handleInputChange = (e) => {
		setQuestion(e.target.value);
	};

	const handleImageChange = (e) => {
		const file = e.target.files[0];
		setImage(file);
	};

	const removeImage = () => {
		setImage(null);
	};

	const fetchAllResponses = async (question, image) => {
		if (!question) return;
		if (image) {
			const formData = new FormData();
			formData.append("image", image);
			formData.append("question", question);
			formData.append("userId", currentUser.uid);

			const response = await fetch(
				"http://localhost:5000/api/llm/queryWithImage",
				{
					method: "POST",
					body: formData,
				}
			);
			const data = await response.json();
			return data;
		} else {
			const response = await fetch(
				`http://localhost:5000/api/llm?question=${question}&userId=${currentUser.uid}`
			);
			const data = await response.json();
			return data;
		}
	};

	const handleSubmit = async () => {
		if (!question) return;

		const allResponses = await fetchAllResponses(question, image);
		console.log(allResponses);
		const res = {
			chatgpt: allResponses.chatgpt
				? [...responses.chatgpt, allResponses.chatgpt]
				: [...responses.chatgpt],
			claude: allResponses.claude
				? [...responses.claude, allResponses.claude]
				: [...responses.claude],
			groq: allResponses.groq
				? [...responses.groq, allResponses.groq]
				: [...responses.groq],
		};
		setResponses(res);

		setQuestion("");
		setImage(null);
	};

	const triggerFileInput = () => {
		document.getElementById("fileInput").click();
	};

	const handleShare = (response, AIModel) => {
		response = AIModel + ": \n" + response;
		navigate(`/dashboard?message=${encodeURIComponent(response)}`);
	};

	const handleFullscreen = (e) => {
		const card = e.target.closest(".card");
		const parent = card.parentElement;
		const cards = parent.children;

		for (let i = 0; i < cards.length; i++) {
			cards[i].style.display = "none";
		}

		card.style.display = "block";
		card.style.width = "100%";

		const backButton = document.createElement("div");
		backButton.className = "fullscreen-btn back-btn";
		backButton.innerText = "B";
		backButton.onclick = handleBackToNormalScreen;
		card.appendChild(backButton);
	};

	const handleBackToNormalScreen = (e) => {
		const card = e.target.closest(".card");
		const parent = card.parentElement;
		const cards = parent.children;

		for (let i = 0; i < cards.length; i++) {
			cards[i].style.display = "block";
			cards[i].style.width = "32%";
		}

		const backButton = card.querySelector(".back-btn");
		if (backButton) {
			card.removeChild(backButton);
		}
	};

	useEffect(() => {
		if (chatgptRef.current) {
			setTimeout(
				() => chatgptRef.current.scrollIntoView({ behavior: "smooth" }),
				0
			);
		}
		if (claudeRef.current) {
			setTimeout(
				() => claudeRef.current.scrollIntoView({ behavior: "smooth" }),
				500
			);
		}
		if (groqRef.current) {
			setTimeout(
				() => groqRef.current.scrollIntoView({ behavior: "smooth" }),
				1000
			);
		}
	}, [responses.chatgpt, responses.claude, responses.groq]);

	//syncing with the backend
	useEffect(() => {
		if (!currentUser) return;
		const fetchResponses = async () => {
			const response = await fetch(
				`http://localhost:5000/api/llm/getUserResponses?userId=${currentUser.uid}`
			);
			const data = await response.json();
			console.log(data);

			if (response.status === 200) {
				const res = {};

				// Iterate over the data array
				data.forEach((item) => {
					// Iterate over the keys of each object in the data array
					Object.keys(item).forEach((key) => {
						// If the key does not exist in res, initialize it as an empty array
						if (!res[key]) {
							res[key] = [];
						}
						//add only if key is chatgpt, claude or groq
						if (key !== "chatgpt" && key !== "claude" && key !== "groq") return;
						// Append the responses to the corresponding key in the res object
						res[key] = res[key].concat(item[key]);
					});
				});

				setResponses(res);
				console.log(res);
			}
		};

		fetchResponses();
	}, [currentUser]);

	return (
		<div className="content">
			<div className="llm-comparison">
				<h3>Real-Time LLM Comparison</h3>
				<div className="comparison-cards">
					<div className="card">
						<h4>ChatGPT</h4>
						<div className="fullscreen-btn" onClick={handleFullscreen}>
							F
						</div>
						<div className="res-div">
							{responses.chatgpt.map((response, index) => (
								<div
									key={index}
									ref={
										index === responses.chatgpt.length - 1 ? chatgptRef : null
									}
								>
									<div className="you-asked-div">
										You asked:
										<div>
											<h5>{response.question}</h5>
											{response.qImage && (
												<img
													src={"http://localhost:5000/" + response.qImage.path}
													alt="Image"
													style={{ width: "30%" }}
												/>
											)}
										</div>
									</div>
									<div className="response-div">
										Response:
										<p>{response.response}</p>
										<button
											onClick={() => handleShare(response.response, "ChatGPT")}
										>
											Share
										</button>
									</div>
								</div>
							))}
						</div>
					</div>
					<div className="card">
						<h4>Claude</h4>
						<div className="fullscreen-btn" onClick={handleFullscreen}>
							F
						</div>

						<div className="res-div">
							{responses.claude.map((response, index) => (
								<div
									key={index}
									ref={index === responses.claude.length - 1 ? claudeRef : null}
								>
									<div className="you-asked-div">
										You asked:
										<div>
											<h5>{response.question}</h5>
											{response.qImage && (
												<img
													src={"http://localhost:5000/" + response.qImage.path}
													alt="Image"
													style={{ width: "30%" }}
												/>
											)}
										</div>
									</div>
									<div className="response-div">
										Response:
										<p>{response.response}</p>
										<button
											onClick={() => handleShare(response.response, "Claude")}
										>
											Share
										</button>
									</div>
								</div>
							))}
						</div>
					</div>
					<div className="card">
						<h4>Groq</h4>
						<div className="fullscreen-btn" onClick={handleFullscreen}>
							F
						</div>

						<div className="res-div">
							{responses.groq.map((response, index) => (
								<div
									key={index}
									ref={index === responses.groq.length - 1 ? groqRef : null}
								>
									<div className="you-asked-div">
										You asked:
										<div>
											<h5>{response.question}</h5>
											{response.qImage && (
												<img
													src={"http://localhost:5000/" + response.qImage.path}
													alt="Image"
													style={{ width: "30%" }}
												/>
											)}
										</div>
									</div>
									<div className="response-div">
										Response:
										<p>{response.response}</p>
										<button
											onClick={() => handleShare(response.response, "Groq")}
										>
											Share
										</button>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>

			<div className="input-box">
				<input
					type="text"
					placeholder="Type your question here..."
					value={question}
					onChange={handleInputChange}
				/>
				<input
					type="file"
					id="fileInput"
					accept="image/*"
					onChange={handleImageChange}
					style={{ display: "none" }}
				/>
				<div className="file-icon" onClick={triggerFileInput}>
					📁
				</div>
				{image && (
					<div className="image-preview-container">
						<img
							src={URL.createObjectURL(image)}
							alt="Preview"
							className="image-preview"
						/>
						<div className="remove-image-btn" onClick={removeImage}>
							✖
						</div>
					</div>
				)}
				<button onClick={handleSubmit}>Submit</button>
			</div>
		</div>
	);
};

export default LLMComparison;
