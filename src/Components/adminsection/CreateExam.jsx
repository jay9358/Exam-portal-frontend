import { useState, useEffect } from "react";
import "../../assets/css/ManageExam.css";
import axios from "axios";
import toast from "react-hot-toast";

const CreateExam = () => {
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [timeLimit, setTimeLimit] = useState("");
	const [questionSets, setQuestionSets] = useState([]);
	const [availableQuestionSets, setAvailableQuestionSets] = useState([]);
	const [filteredQuestionSets, setFilteredQuestionSets] = useState([]);
	const [date, setDate] = useState("");
	const [startTime, setStartTime] = useState("");
	const [level, setLevel] = useState("1");
	const [Status, setStatus] = useState("Not Started");
	const [totalQuestions, setTotalQuestions] = useState("");

	useEffect(() => {
		const fetchQuestionSets = async () => {
			try {
				const response = await axios.get(
					`${import.meta.env.VITE_API_URL}/v1/admin/questionSets`,
					{
						headers: {
							Authorization: localStorage.getItem("token"),
						},
					}
				);
				setAvailableQuestionSets(response.data.questionSets);
			} catch (error) {
				console.error(
					"Error fetching question sets:",
					error.response?.data || error.message
				);
				toast.error("Failed to fetch question sets");
			}
		};

		fetchQuestionSets();
	}, []);

	useEffect(() => {
		console.log(availableQuestionSets);
		// Filter question sets based on the selected level
		setFilteredQuestionSets(availableQuestionSets.filter(set => String(set.level) === level));
	}, [level, availableQuestionSets]);

	const handleToggleQuestionSet = (id) => {
		if (questionSets.includes(id)) {
			setQuestionSets(questionSets.filter((setId) => setId !== id));
		} else {
			setQuestionSets([...questionSets, id]);
		}
	};

	const handleCreateExam = async () => {
		try {
			if (!title || !description || !timeLimit || !date || !startTime || !totalQuestions) {
				toast.error("Please fill in all required fields");
				return;
			}

			const response = await axios.post(
				`${import.meta.env.VITE_API_URL}/v1/admin/exams`,
				{
					title,
					description,
					timeLimit,
					questionSets,
					date,
					startTime,
					level,
					totalQuestions: parseInt(totalQuestions),
					Status
				},
				{
					headers: {
						Authorization: localStorage.getItem("token"),
					},
				}
			);
			
			setTitle("");
			setDescription("");
			setTimeLimit("");
			setQuestionSets([]);
			setDate("");
			setStartTime("");
			setLevel("1");
			setTotalQuestions("");
			toast.success("Exam created successfully!");
		} catch (error) {
			console.error("Error creating exam:", error);
			toast.error("Failed to create exam");
		}
	};

	return (
		<div className="manage-exam">
			<h1>Manage Exam</h1>
			<h2>Create Exam</h2>

			<div className="form-group">
				<input
					type="text"
					value={title}
					placeholder="Exam Title"
					onChange={(e) => setTitle(e.target.value)}
					className="form-control"
					required
				/>
			</div>

			<div className="form-group">
				<textarea
					value={description}
					placeholder="Exam Description"
					onChange={(e) => setDescription(e.target.value)}
					className="form-control"
					required
				/>
			</div>

			<div className="form-group">
				<input
					type="number"
					value={timeLimit}
					placeholder="Time Limit (minutes)"
					onChange={(e) => setTimeLimit(e.target.value)}
					className="form-control"
					min="1"
					required
				/>
			</div>

			<div className="form-group">
				<select
					value={level}
					onChange={(e) => setLevel(e.target.value)}
					className="form-control"
					required
				>
					<option value="1">Easy</option>
					<option value="2">Medium</option>
					<option value="3">Hard</option>
				</select>
			</div>

			<div className="form-group">
				<input
					type="number"
					value={totalQuestions}
					placeholder="Total Questions"
					onChange={(e) => setTotalQuestions(e.target.value)}
					className="form-control"
					min="1"
					required
				/>
			</div>

			<div className="form-group">
				<input
					type="date"
					value={date}
					onChange={(e) => setDate(e.target.value)}
					className="form-control"
					required
				/>
			</div>

			<div className="form-group">
				<input
					type="time"
					value={startTime}
					onChange={(e) => setStartTime(e.target.value)}
					className="form-control"
					required
				/>
			</div>

			<div className="question-sets-container">
				<h4 className="question-sets-title">Select Question Sets</h4>
				<ul className="question-sets-list">
					{filteredQuestionSets.map((set) => (
						<li key={set._id} className="question-set-item">
							<label className="question-set-label">
								<input
									type="checkbox"
									checked={questionSets.includes(set._id)}
									onChange={() => handleToggleQuestionSet(set._id)}
									className="question-set-checkbox"
								/>
								<span className="question-set-name">
									Set {set.setName}
								</span>
							</label>
						</li>
					))}
				</ul>
			</div>

			<div className="save-button-container">
				<button onClick={handleCreateExam} className="save-button">
					Create Exam
				</button>
			</div>
		</div>
	);
};

export default CreateExam;
