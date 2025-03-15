// import { useState, useEffect } from "react";
// import axios from "axios";
// import toast from "react-hot-toast";

// const ManageQuestionSets = () => {
// 	const [questionSets, setQuestionSets] = useState([]);
// 	const [selectedSetId, setSelectedSetId] = useState(null);
// 	const [newQuestionSetName, setNewQuestionSetName] = useState("");
// 	const [newQuestion, setNewQuestion] = useState("");
// 	const [newOptions, setNewOptions] = useState([
// 		{ text: "", isCorrect: false },
// 		{ text: "", isCorrect: false },
// 		{ text: "", isCorrect: false },
// 		{ text: "", isCorrect: false },
// 	]);

// 	useEffect(() => {
// 		fetchQuestionSets();
// 	}, []);

// 	const fetchQuestionSets = async () => {
// 		try {
// 			const response = await axios.get(
// 				`${import.meta.env.VITE_API_URL}/admin/questionSets`,
// 				{
// 					headers: { Authorization: localStorage.getItem("token") },
// 				}
// 			);
// 			setQuestionSets(response.data.questionSets);
// 		} catch (error) {
// 			toast.error(`Error fetching question sets: ${error.message}`);
// 		}
// 	};

// 	const handleCreateQuestionSet = async () => {
// 		try {
// 			const response = await axios.post(
// 				`${import.meta.env.VITE_API_URL}/admin/questionSets`,
// 				{ setName: newQuestionSetName },
// 				{ headers: { Authorization: localStorage.getItem("token") } }
// 			);
// 			setQuestionSets([...questionSets, response.data.questionSet]);
// 			setNewQuestionSetName("");
// 			toast.success("Question set created successfully!");
// 		} catch (error) {
// 			toast.error(`Error creating question set: ${error.message}`);
// 		}
// 	};

// 	const handleAddQuestionToSet = async () => {
// 		if (!selectedSetId) {
// 			toast.error("Please select a question set.");
// 			return;
// 		}

// 		try {
// 			const response = await axios.post(
// 				`${import.meta.env.VITE_API_URL}/admin/questionSets/questions`,
// 				{
// 					questionText: newQuestion,
// 					options: newOptions,
// 					setId: selectedSetId,
// 				},
// 				{ headers: { Authorization: localStorage.getItem("token") } }
// 			);
// 			const updatedSets = questionSets.map((set) =>
// 				set._id === selectedSetId
// 					? { ...set, questions: [...set.questions, response.data.question] }
// 					: set
// 			);
// 			setQuestionSets(updatedSets);
// 			setNewQuestion("");
// 			setNewOptions([
// 				{ text: "", isCorrect: false },
// 				{ text: "", isCorrect: false },
// 				{ text: "", isCorrect: false },
// 				{ text: "", isCorrect: false },
// 			]);
// 			toast.success("Question added successfully!");
// 		} catch (error) {
// 			toast.error(`Error adding question: ${error.message}`);
// 		}
// 	};

// 	const handleUpdateQuestion = async (
// 		setId,
// 		questionId,
// 		updatedText,
// 		updatedOptions
// 	) => {
// 		try {
// 			const response = await axios.put(
// 				`${import.meta.env.VITE_API_URL}/admin/questions/update/${questionId}`,
// 				{ questionText: updatedText, options: updatedOptions },
// 				{ headers: { Authorization: localStorage.getItem("token") } }
// 			);
// 			const updatedSets = questionSets.map((set) =>
// 				set._id === setId
// 					? {
// 							...set,
// 							questions: set.questions.map((q) =>
// 								q._id === questionId ? response.data.updatedQuestion : q
// 							),
// 					  }
// 					: set
// 			);
// 			setQuestionSets(updatedSets);
// 			toast.success("Question updated successfully!");
// 		} catch (error) {
// 			toast.error(`Error updating question: ${error.message}`);
// 		}
// 	};

// 	const handleDeleteQuestion = async (setId, questionId) => {
// 		try {
// 			await axios.delete(
// 				`${import.meta.env.VITE_API_URL}/admin/questions/${questionId}`,
// 				{
// 					headers: { Authorization: localStorage.getItem("token") },
// 				}
// 			);
// 			const updatedSets = questionSets.map((set) =>
// 				set._id === setId
// 					? {
// 							...set,
// 							questions: set.questions.filter((q) => q._id !== questionId),
// 					  }
// 					: set
// 			);
// 			setQuestionSets(updatedSets);
// 			toast.success("Question deleted successfully!");
// 		} catch (error) {
// 			toast.error(`Error deleting question: ${error.message}`);
// 		}
// 	};

// 	return (
// 		<div className="max-w-4xl mx-auto py-8">
// 			<h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
// 				Manage Question Sets
// 			</h2>

// 			{/* Create Question Set */}
// 			<div className="mb-6 bg-white p-4 rounded shadow-md">
// 				<h3 className="text-lg font-semibold mb-4">Create New Question Set</h3>
// 				<input
// 					type="text"
// 					value={newQuestionSetName}
// 					onChange={(e) => setNewQuestionSetName(e.target.value)}
// 					placeholder="Enter new question set name"
// 					className="border border-gray-300 p-2 rounded w-full mb-4 focus:ring focus:ring-blue-200"
// 				/>
// 				<button
// 					onClick={handleCreateQuestionSet}
// 					className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
// 					Create Question Set
// 				</button>
// 			</div>

// 			{/* Select Question Set */}
// 			<div className="mb-6 bg-white p-4 rounded shadow-md">
// 				<h3 className="text-lg font-semibold mb-4">Select Question Set</h3>
// 				<select
// 					value={selectedSetId}
// 					onChange={(e) => setSelectedSetId(e.target.value)}
// 					className="border border-gray-300 p-2 rounded w-full focus:ring focus:ring-blue-200">
// 					<option value="">Select a set</option>
// 					{questionSets.map((set) => (
// 						<option key={set._id} value={set._id}>
// 							{set.setName}
// 						</option>
// 					))}
// 				</select>
// 			</div>

// 			{/* Add Question */}
// 			<div className="mb-6 bg-white p-4 rounded shadow-md">
// 				<h3 className="text-lg font-semibold mb-4">Add New Question</h3>
// 				<input
// 					type="text"
// 					value={newQuestion}
// 					onChange={(e) => setNewQuestion(e.target.value)}
// 					placeholder="Enter new question"
// 					className="border border-gray-300 p-2 rounded w-full mb-4 focus:ring focus:ring-blue-200"
// 				/>
// 				{newOptions.map((option, index) => (
// 					<div key={index} className="flex-col items-center mb-2">
// 						<input
// 							type="text"
// 							value={option.text}
// 							onChange={(e) =>
// 								setNewOptions(
// 									newOptions.map((opt, i) =>
// 										i === index ? { ...opt, text: e.target.value } : opt
// 									)
// 								)
// 							}
// 							placeholder={`Option ${index + 1}`}
// 							className="border border-gray-300 p-2 rounded w-full mr-2 focus:ring focus:ring-blue-200"
// 						/>
// 						<input
// 							type="checkbox"
// 							checked={option.isCorrect}
// 							onChange={() =>
// 								setNewOptions(
// 									newOptions.map((opt, i) =>
// 										i === index ? { ...opt, isCorrect: !opt.isCorrect } : opt
// 									)
// 								)
// 							}
// 							className="mr-2"
// 						/>
// 						<span>Correct</span>
// 					</div>
// 				))}
// 				<button
// 					onClick={handleAddQuestionToSet}
// 					className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
// 					Add Question
// 				</button>
// 			</div>

// 			{/* Display Question Sets and Questions */}
// 			{questionSets.map((set) => (
// 				<div key={set._id} className="mb-6 bg-white p-4 rounded shadow-md">
// 					<h3 className="text-lg font-semibold mb-4 text-gray-700">
// 						{set.setName}
// 					</h3>
// 					<ul className="space-y-4">
// 						{set.questions.map((question) => (
// 							<li
// 								key={question._id}
// 								className="p-4 border rounded shadow-sm bg-gray-50">
// 								<div className="flex justify-between items-center">
// 									<span className="text-gray-800 font-medium">
// 										{question.questionText}
// 									</span>
// 									<div>
// 										<button
// 											onClick={() =>
// 												handleUpdateQuestion(
// 													set._id,
// 													question._id,
// 													question.questionText,
// 													question.options
// 												)
// 											}
// 											className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 mr-2">
// 											Edit
// 										</button>
// 										<button
// 											onClick={() =>
// 												handleDeleteQuestion(set._id, question._id)
// 											}
// 											className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
// 											Delete
// 										</button>
// 									</div>
// 								</div>
// 								<ul className="mt-2 space-y-1">
// 									{question.options.map((option, index) => (
// 										<li key={index} className="ml-4 text-gray-700">
// 											{option.text} -{" "}
// 											<span
// 												className={
// 													option.isCorrect ? "text-green-500" : "text-red-500"
// 												}>
// 												{option.isCorrect ? "Correct" : "Incorrect"}
// 											</span>
// 										</li>
// 									))}
// 								</ul>
// 							</li>
// 						))}
// 					</ul>
// 				</div>
// 			))}
// 		</div>
// 	);
// };

// export default ManageQuestionSets;

import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const ManageQuestionSets = () => {
	const [questionSets, setQuestionSets] = useState([]);
	const [selectedSetId, setSelectedSetId] = useState(null);
	const [newQuestionSetName, setNewQuestionSetName] = useState("");
	const [csvFile, setCsvFile] = useState(null);

	// States for new exam set CSV upload
	const [newCsvSetName, setNewCsvSetName] = useState("");
	const [csvExamSetFile, setCsvExamSetFile] = useState(null);

	useEffect(() => {
		fetchQuestionSets();
	}, []);

	const fetchQuestionSets = async () => {
		try {
			const response = await axios.get(
				`${import.meta.env.VITE_API_URL}/v1/admin/questionSets`,
				{
					headers: { Authorization: localStorage.getItem("token") },
				}
			);
			setQuestionSets(response.data.questionSets);
		} catch (error) {
			toast.error(`Error fetching question sets: ${error.message}`);
		}
	};

	const handleCreateQuestionSet = async () => {
		try {
			const response = await axios.post(
				`${import.meta.env.VITE_API_URL}/v1/admin/questionSets`,
				{ setName: newQuestionSetName },
				{ headers: { Authorization: localStorage.getItem("token") } }
			);
			setQuestionSets([...questionSets, response.data.questionSet]);
			setNewQuestionSetName("");
			toast.success("Question set created successfully!");
		} catch (error) {
			toast.error(`Error creating question set: ${error.message}`);
		}
	};

	// Helper function to parse CSV text into an array of objects.
	// Note: This simple parser assumes your CSV is straightforward without quoted commas.
	const parseCSV = (text) => {
		const lines = text.split("\n").filter((line) => line.trim() !== "");
		const result = [];
		const headers = lines[0].split(",").map((header) => header.trim());
		for (let i = 1; i < lines.length; i++) {
			const obj = {};
			const currentLine = lines[i].split(",").map((item) => item.trim());
			headers.forEach((header, index) => {
				obj[header] = currentLine[index];
			});
			result.push(obj);
		}
		return result;
	};

	// Upload CSV into an Existing Question Set using the current API for each question.
	const handleFileUpload = (event) => {
		const file = event.target.files[0];
		if (!file) return;
		if (!selectedSetId) {
			toast.error("Please select a question set first.");
			return;
		}

		const reader = new FileReader();
		reader.onload = async (e) => {
			const text = e.target.result;
			const rows = parseCSV(text);
			for (const row of rows) {
				const questionText = row["Question"];
				const options = [
					{ text: row["Option 1"], isCorrect: row["Correct Answer"] === "1" },
					{ text: row["Option 2"], isCorrect: row["Correct Answer"] === "2" },
					{ text: row["Option 3"], isCorrect: row["Correct Answer"] === "3" },
					{ text: row["Option 4"], isCorrect: row["Correct Answer"] === "4" },
				];
				try {
					await axios.post(
						`${import.meta.env.VITE_API_URL}/v1/admin/questionSets/questions`,
						{ questionText, options, setId: selectedSetId },
						{ headers: { Authorization: localStorage.getItem("token") } }
					);
				} catch (error) {
					toast.error(
						`Error adding question: ${
							error.response?.data?.message || error.message
						}`
					);
				}
			}
			toast.success("CSV processed and questions added successfully!");
			fetchQuestionSets(); // Refresh question sets after upload
		};
		reader.readAsText(file);
	};

	// Upload CSV for a New Exam Set (addon) using the current API for each question.
	const handleCsvExamSetUpload = async () => {
		if (!newCsvSetName || !csvExamSetFile) {
			toast.error("Please enter a new exam set name and select a CSV file.");
			return;
		}
		try {
			// First, create a new question set with the provided name.
			const createResponse = await axios.post(
				`${import.meta.env.VITE_API_URL}/v1/admin/questionSets`,
				{ setName: newCsvSetName },
				{ headers: { Authorization: localStorage.getItem("token") } }
			);
			const newSetId = createResponse.data.questionSet._id;

			const reader = new FileReader();
			reader.onload = async (e) => {
				const text = e.target.result;
				const rows = parseCSV(text);
				for (const row of rows) {
					const questionText = row["Question"];
					const options = [
						{ text: row["Option 1"], isCorrect: row["Correct Answer"] === "1" },
						{ text: row["Option 2"], isCorrect: row["Correct Answer"] === "2" },
						{ text: row["Option 3"], isCorrect: row["Correct Answer"] === "3" },
						{ text: row["Option 4"], isCorrect: row["Correct Answer"] === "4" },
					];
					try {
						await axios.post(
							`${import.meta.env.VITE_API_URL}/v1/admin/questionSets/questions`,
							{ questionText, options, setId: newSetId },
							{ headers: { Authorization: localStorage.getItem("token") } }
						);
					} catch (error) {
						toast.error(
							`Error adding question: ${
								error.response?.data?.message || error.message
							}`
						);
					}
				}
				toast.success(
					"Exam set CSV processed and questions added successfully!"
				);
				setNewCsvSetName("");
				setCsvExamSetFile(null);
				fetchQuestionSets();
			};
			reader.readAsText(csvExamSetFile);
		} catch (error) {
			toast.error(
				`Error uploading exam set CSV: ${
					error.response?.data?.message || error.message
				}`
			);
		}
	};

	return (
		<div className="max-w-4xl mx-auto py-8">
			<h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
				Manage Question Sets
			</h2>

			{/* Create Question Set (Manual) */}
			<div className="mb-6 bg-white p-4 rounded shadow-md">
				<h3 className="text-lg font-semibold mb-4">Create New Question Set</h3>
				<input
					type="text"
					value={newQuestionSetName}
					onChange={(e) => setNewQuestionSetName(e.target.value)}
					placeholder="Enter new question set name"
					className="border border-gray-300 p-2 rounded w-full mb-4 focus:ring focus:ring-blue-200"
				/>
				<button
					onClick={handleCreateQuestionSet}
					className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
					Create Question Set
				</button>
			</div>
				{/* Upload Exam Set CSV (New Addon) */}
				<div className="mb-6 bg-white p-4 rounded shadow-md">
				<h3 className="text-lg font-semibold mb-4">Upload Exam Set CSV</h3>
				<input
					type="text"
					value={newCsvSetName}
					onChange={(e) => setNewCsvSetName(e.target.value)}
					placeholder="Enter new exam set name"
					className="border border-gray-300 p-2 rounded w-full mb-4 focus:ring focus:ring-blue-200"
				/>
				<input
					type="file"
					accept=".csv"
					onChange={(e) => setCsvExamSetFile(e.target.files[0])}
					className="border border-gray-300 p-2 rounded w-full mb-4 focus:ring focus:ring-blue-200"
				/>
				<button
					onClick={handleCsvExamSetUpload}
					className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
					Upload Exam Set CSV
				</button>
			</div>

			{/* Upload CSV into an Existing Question Set */}
			<div className="mb-6 bg-white p-4 rounded shadow-md">
				<h3 className="text-lg font-semibold mb-4">
					Upload CSV to Existing Set
				</h3>
				<select
					value={selectedSetId}
					onChange={(e) => setSelectedSetId(e.target.value)}
					className="border border-gray-300 p-2 rounded w-full focus:ring focus:ring-blue-200 mb-4">
					<option value="">Select a question set</option>
					{questionSets.map((set) => (
						<option key={set._id} value={set._id}>
							{set.setName}
						</option>
					))}
				</select>
				<input
					type="file"
					accept=".csv"
					onChange={handleFileUpload}
					className="border border-gray-300 p-2 rounded w-full mb-4 focus:ring focus:ring-blue-200"
				/>
			</div>

		
		</div>
	);
};

export default ManageQuestionSets;

