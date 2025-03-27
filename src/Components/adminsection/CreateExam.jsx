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
	const [date, setDate] = useState("");
	const [startTime, setStartTime] = useState("");
	const [level, setLevel] = useState("1");
	const [Status, setStatus] = useState("Not Started");
	const [totalQuestions, setTotalQuestions] = useState("");
	const [selectedBatch, setSelectedBatch] = useState("");
	const [questionSetWeights, setQuestionSetWeights] = useState({});
	const [batch, setBatch] = useState([]);

	const fetchBatch = async () => {
		try {
			const response = await axios.get(
				`${import.meta.env.VITE_API_URL}/v1/admin/batches`,
				{
					headers: { Authorization: localStorage.getItem("token") },
				}
			);
			// Assuming the response structure is { batches: [...] }
			console.log(response.data.batches);
			setBatch(response.data.batches);
		} catch (error) {
			console.error("Error fetching batches:", error.response?.data || error.message);
			toast.error("Failed to fetch batches");
		}
	};

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
				const questionSets = response.data.questionSets.filter(set => set.type === "Question Bank");
				setAvailableQuestionSets(questionSets);
				console.log(questionSets);

			} catch (error) {
				console.error(
					"Error fetching question sets:",
					error.response?.data || error.message
				);
				toast.error("Failed to fetch question sets");
			}
		
		};
	
		

		fetchQuestionSets();
		fetchBatch();
		
	}, []);


	const handleToggleQuestionSet = (id) => {
		if (questionSets.includes(id)) {
			setQuestionSets(questionSets.filter((setId) => setId !== id));
			const updatedWeights = { ...questionSetWeights };
			delete updatedWeights[id];
			setQuestionSetWeights(updatedWeights);
		} else {
			setQuestionSets([...questionSets, id]);
		}
	};

	const handleWeightChange = (id, weight) => {
		setQuestionSetWeights({
			...questionSetWeights,
			[id]: weight,
		});
	};

	const handleCreateExam = async () => {
		try {
			if (!title || !description || !timeLimit || !date || !startTime || !totalQuestions || !selectedBatch) {
				toast.error("Please fill in all required fields");
				return;
			}

			// Calculate total weightage
			const totalWeightage = Object.values(questionSetWeights).reduce((sum, weight) => sum + parseFloat(weight || 0), 0);

			// Check if total weightage exceeds 100
			if (totalWeightage > 100) {
				toast.error("Total weightage cannot exceed 100");
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
					Status,
					batch: selectedBatch,
					questionSetWeights, // Include weights in the request
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
			setQuestionSetWeights({});
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
					<option value="1">L1-Prarambh</option>
					<option value="2">L2-Madhyam</option>
					<option value="3">L3-Uttam</option>
					<option value="4">Trainer</option>
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
			<div className="form-group">
				<select
					type="text"
					value={selectedBatch}
					onChange={(e) => setSelectedBatch(e.target.value)}
					className="form-control"
					required
				>
					<option value="" disabled>
						Select Batch
					</option>
					{batch
						.filter((batchItem) => batchItem !== null && batchItem !== undefined)
						.map((batchItem, index) => (
							<option key={index} value={batchItem}>
								{batchItem}
							</option>
						))}
				</select>
			</div>
			

			<div className="question-sets-container">
				<h4 className="question-sets-title">Select Question Banks and Their Weightage</h4>
				<ul className="question-sets-list">
					{availableQuestionSets.map((set) => (
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
							{questionSets.includes(set._id) && (
								<input
									type="number"
									value={questionSetWeights[set._id] || ""}
									onChange={(e) => handleWeightChange(set._id, e.target.value)}
									placeholder="Weightage"
									className="form-control weightage-input"
									min="0"
								/>
							)}
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
