import React from "react";
import "./StudyMaterial.css";

const subjects = [
	{
		id: 1,
		name: "Mathematics",
		description: "Learn about algebra, geometry, and more.",
	},
	{
		id: 2,
		name: "Physics",
		description: "Explore the laws of nature and the universe.",
	},
	{
		id: 3,
		name: "Chemistry",
		description:
			"Understand the composition, structure, and properties of substances.",
	},
	{
		id: 4,
		name: "Biology",
		description: "Study the science of life and living organisms.",
	},
	{
		id: 5,
		name: "History",
		description:
			"Dive into the events of the past and how they shape our present.",
	},
];

const StudyMaterial = () => {
	const handleOpenMaterial = (subjectName) => {
		alert(`Opening study material for ${subjectName}`);
	};

	return (
		<div className="study-material-container">
			{subjects.map((subject) => (
				<div key={subject.id} className="card">
					<h3>{subject.name}</h3>
					<p>{subject.description}</p>
					<button onClick={() => handleOpenMaterial(subject.name)}>
						Open Study Material
					</button>
				</div>
			))}
		</div>
	);
};

export default StudyMaterial;
