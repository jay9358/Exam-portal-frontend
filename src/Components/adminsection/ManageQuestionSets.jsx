import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import "./ManageQuestionSets.css";

const ManageQuestionSets = () => {
	const [questionSets, setQuestionSets] = useState([]);
	const [selectedSetId, setSelectedSetId] = useState(null);
	const [newQuestionSetName, setNewQuestionSetName] = useState("");
	const [csvFile, setCsvFile] = useState(null);

	// States for new exam set CSV upload
	const [newCsvSetName, setNewCsvSetName] = useState("");
	const [csvExamSetFile, setCsvExamSetFile] = useState(null);
	const [isLoading, setIsLoading] = useState(false);

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

		setIsLoading(true);

		const reader = new FileReader();
		reader.onload = async (e) => {
			const text = e.target.result;
			const rows = parseCSV(text);
			const questions = [];

			for (const row of rows) {
				const questionText = row["Question"];
				const options = [
					{ text: row["Option 1"], isCorrect: row["Correct Answer"] === "1" },
					{ text: row["Option 2"], isCorrect: row["Correct Answer"] === "2" },
					{ text: row["Option 3"], isCorrect: row["Correct Answer"] === "3" },
					{ text: row["Option 4"], isCorrect: row["Correct Answer"] === "4" },
				];
				const Chapter = row["Chapter"];
				const Difficulty = row["Difficulty"];
				questions.push({ questionText, options, chapter: Chapter, difficulty: Difficulty });
			}
			const type = "Question Bank";
			try {
				const createResponse = await axios.post(
					`${import.meta.env.VITE_API_URL}/v1/admin/questionSets`,
					{ setName: newCsvSetName, type: type },
					{ headers: { Authorization: localStorage.getItem("token") } }
				);
				const newSetId = createResponse.data.questionSet._id;

				for (const question of questions) {
					try {
						await axios.post(
							`${import.meta.env.VITE_API_URL}/v1/admin/questionSets/questions`,
							{ ...question, setId: newSetId },
							{ headers: { Authorization: localStorage.getItem("token") } }
						);
					} catch (error) {
						throw new Error(`Error adding question: ${error.response?.data?.message || error.message}`);
					}
				}

				toast.success("Exam set CSV processed and questions added successfully!");
				setNewCsvSetName("");
				setCsvExamSetFile(null);
				fetchQuestionSets();
			} catch (error) {
				toast.error(`Error uploading exam set CSV: ${error.message}`);
			} finally {
				setIsLoading(false);
			}
		};
		reader.readAsText(csvExamSetFile);
	};

	// Function to download a sample CSV format
	const downloadSampleCSV = () => {
		const headers = ["Question", "Option 1", "Option 2", "Option 3", "Option 4", "Correct Answer", "Chapter", "Difficulty"];
		const sampleData = [
			"What is the capital of France?", "Paris", "London", "Berlin", "Madrid", "1", "Geography", "1"
		];
		
		// Create CSV content
		const csvContent = headers.join(",") + "\n" + 
			sampleData.join(",");
		// Create a blob and download
		const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
		const link = document.createElement("a");
		const url = URL.createObjectURL(blob);
		
		link.setAttribute("href", url);
		link.setAttribute("download", "question_format_sample.csv");
		link.style.visibility = "hidden";
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};

	return (
		<div className="question-sets-container">
			<h2 className="page-title">
				Manage Question Sets
			</h2>

			{isLoading && <div className="loader">Loading...</div>}

			<button
				onClick={downloadSampleCSV}
				className="button button-secondary">
				Download CSV Format
			</button>

			<div className="section-card">
				<h3 className="section-title">Upload Exam Set CSV</h3>
				<input
					type="text"
					value={newCsvSetName}
					onChange={(e) => setNewCsvSetName(e.target.value)}
					placeholder="Enter new exam set name"
					className="input-field"
				/>

				<input
					type="file"
					accept=".csv"
					onChange={(e) => setCsvExamSetFile(e.target.files[0])}
					className="file-input"
				/>
				<div className="button-container">
					<button
						onClick={handleCsvExamSetUpload}
						className="button button-primary">
						Upload Exam Set CSV
					</button>

				</div>
			</div>

			{/* Upload CSV into an Existing Question Set */}
			<div className="section-card">
				<h3 className="section-title">
					Upload CSV to Existing Question Bank
				</h3>
				<select
					value={selectedSetId}
					onChange={(e) => setSelectedSetId(e.target.value)}
					className="select-field">
					<option value="">Select a question Bank</option>
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
					className="file-input"
				/>

			</div>
		</div>
	);
};

export default ManageQuestionSets;

