import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import './QuestionBank.css'; // Import the CSS file

const QuestionBank = () => {
	const [questionSets, setQuestionSets] = useState([]);
	const [loading, setLoading] = useState(true);
	const [filterLevel, setFilterLevel] = useState('1'); // Default to level 1

	const fetchQuestionSets = async () => {
		try {
			const response = await axios.get(`${import.meta.env.VITE_API_URL}/v1/admin/questionSets`, {
				headers: {
					Authorization: localStorage.getItem("token"),
				},
			});
			const filteredSets = response.data.questionSets.filter(set => set.type === "Question Bank");
			setQuestionSets(filteredSets);
		} catch (error) {
			toast.error("Failed to fetch question sets.");
			console.error("Error fetching question sets:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleDelete = async (id) => {
		try {
			await axios.delete(`${import.meta.env.VITE_API_URL}/v1/admin/questionSets/${id}`, {
				headers: {
					Authorization: localStorage.getItem("token"),
				},
			});
			toast.success("Question set deleted successfully!");
			fetchQuestionSets(); // Refresh the list after deletion
		} catch (error) {
			toast.error("Failed to delete question set.");
			console.error("Error deleting question set:", error);
		}
	};

	const downloadCSV = (set) => {
		const csvRows = [];
		const headers = ['Question', 'Option 1', 'Option 2', 'Option 3', 'Option 4', 'Correct Answer', 'Chapter', 'Difficulty'];
		csvRows.push(headers.join(','));

		set.questions.forEach(question => {
			const questionText = question.questionText;
			const options = question.options.map(option => option.text);
			const correctAnswer = options.find((option, index) => question.options[index].isCorrect) || '';
			const chapter = question.chapter || '';
			const difficulty = question.difficulty || '';

			const row = [
				questionText,
				options[0] || '',
				options[1] || '',
				options[2] || '',
				options[3] || '',
				correctAnswer,
				chapter,
				difficulty
			];
			csvRows.push(row.join(','));
		});

		const csvString = csvRows.join('\n');
		const blob = new Blob([csvString], { type: 'text/csv' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.setAttribute('href', url);
		a.setAttribute('download', `${set.setName}.csv`);
		a.click();
		URL.revokeObjectURL(url);
	};

	const getLevelFromSetName = (setName) => {
		if (!setName) return '1'; // Default to level 1
		const firstLetter = setName.charAt(0).toUpperCase();
		switch (firstLetter) {
			case 'P': return '1';
			case 'M': return '2';
			case 'U': return '3';
			case 'T': return '4';
			default: return '1'; // Default to level 1
		}
	};

	const filteredQuestionSets = questionSets.filter(set => getLevelFromSetName(set.setName) === filterLevel);

	useEffect(() => {
		fetchQuestionSets();
	}, []);

	if (loading) {
		return <div>Loading...</div>;
	}

	return (
		<div className="question-bank-container">
			<h2>Question Bank</h2>
			<label htmlFor="levelFilter">Filter by Level:</label>
			<select id="levelFilter" value={filterLevel} onChange={(e) => setFilterLevel(e.target.value)}>
				<option value="1">Level 1</option>
				<option value="2">Level 2</option>
				<option value="3">Level 3</option>
				<option value="4">Level 4</option>
			</select>
			<table className="question-bank-table">
				<thead>
					<tr>
						<th>Set Name</th>
						<th>Number of Questions</th>
						<th>Actions</th>
					</tr>
				</thead>
				<tbody>
					{filteredQuestionSets.map((set) => (
						<tr key={set._id}>
							<td>{set.setName}</td>
							<td>{set.questions.length}</td>
							<td>
								<button onClick={() => handleDelete(set._id)}>Delete</button>
								<button onClick={() => downloadCSV(set)}>Download CSV</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default QuestionBank;
