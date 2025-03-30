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
			// Basic field validation
			if (!title.trim() || !description.trim() || !timeLimit || !date || !startTime || !totalQuestions || !selectedBatch) {
				toast.error("Please fill in all required fields");
				return;
			}

			// Validate time limit is positive
			if (timeLimit <= 0) {
				toast.error("Time limit must be greater than 0");
				return;
			}

			// Validate total questions is positive
			if (totalQuestions <= 0) {
				toast.error("Total questions must be greater than 0");
				return;
			}

			// Validate at least one question set is selected
			if (questionSets.length === 0) {
				toast.error("Please select at least one question bank");
				return;
			}

			// Validate all selected question sets have weights
			const missingWeights = questionSets.some(id => !questionSetWeights[id]);
			if (missingWeights) {
				toast.error("Please provide weightage for all selected question banks");
				return;
			}

			// Calculate total weightage
			const totalWeightage = Object.values(questionSetWeights).reduce(
				(sum, weight) => sum + parseFloat(weight || 0),
				0
			);

			// Check if total weightage equals 100
			if (totalWeightage !== 100) {
				toast.error("Total weightage must equal 100");
				return;
			}

			// Validate date is not in the past
			const examDate = new Date(`${date}T${startTime}`);
			if (examDate < new Date()) {
				toast.error("Exam date and time cannot be in the past");
				return;
			}

			const response = await axios.post(
				`${import.meta.env.VITE_API_URL}/v1/admin/exams`,
				{
					title: title.trim(),
					description: description.trim(),
					timeLimit,
					questionSets,
					date,
					startTime,
					level,
					totalQuestions: parseInt(totalQuestions),
					Status,
					batch: selectedBatch,
					questionSetWeights,
				},
				{
					headers: {
						Authorization: localStorage.getItem("token"),
					}
				}
			);

			// Reset form only if exam creation was successful
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
			toast.error(error.response?.data?.message || "Failed to create exam");
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
