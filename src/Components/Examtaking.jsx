import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../assets/css/Examtaking.css";
import toast from "react-hot-toast";

const Examtaking = () => {
	const { examId } = useParams();
	const [questions, setQuestions] = useState([]);
	const [markedArr, setMarkedArr] = useState([]);
	const [currentQuestion, setCurrentQuestion] = useState(0);
	const [markedForReview, setMarkedForReview] = useState(0);
	const [attemptedQuestions, setAttemptedQuestions] = useState([]);
	const [answers, setAnswers] = useState({});
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [timer, setTimer] = useState(null);
	const navigate = useNavigate();

	const fetchQuestions = async () => {
		try {
			const Timeresponse = await axios.get(
				`${import.meta.env.VITE_API_URL}/v1/time`,
				{
				  headers: {
					Authorization: localStorage.getItem("token"),
				  },
				}
			  );
			  const serverTime = Timeresponse.data.data.readableTime;
			  console.log("Server time:", serverTime);
			  
			const response = await axios.get(
				`${import.meta.env.VITE_API_URL}/v1/exams/${examId}/start`,
				{
					headers: {
						Authorization: localStorage.getItem("token"),
					},
				}
			);
			if(!response){
				toast.error(response.data.message);
				
			}
			const receivedQuestions = response.data.questions;
			console.log("Received questions:", receivedQuestions);
			setQuestions(receivedQuestions);
			
			// Initialize attempted questions array with the correct length
			setAttemptedQuestions(new Array(receivedQuestions.length).fill(false));

			const [time, period] = serverTime.split(' ');
			let [serverHours, serverMinutes, serverSeconds] = time.split(':').map(Number);
			
			// Adjust hours for PM
			if (period === 'PM' && serverHours !== 12) {
				serverHours += 12;
			}
			// Adjust hours for AM
			else if (period === 'AM' && serverHours === 12) {
				serverHours = 0;
			}
			console.log("Server time:", serverHours, serverMinutes, serverSeconds);
	
			const [startHours, startMinutes] = response.data.examDetails.startTime.split(':').map(Number);
			console.log("Start time:", startHours, startMinutes);
			// Calculate elapsed time in minutes
			const elapsedMinutes = (serverHours - startHours) * 60 + (serverMinutes - startMinutes);
			console.log("Elapsed time:", elapsedMinutes);
			// Calculate remaining time based on time limit
			const timeLimit = response.data.examDetails.timeLimit;
			const remainingMinutes = Math.max(0, timeLimit - elapsedMinutes);
			const remainingSeconds = Math.max(0, (60 - serverSeconds));
			console.log("Remaining time:", remainingMinutes, remainingSeconds);
			
			
			
			startTimer(remainingMinutes, remainingSeconds);
		} catch (error) {
			navigate(`/submitexam/${examId}/result`);
			console.log("Not able to start the exam", error);
		}
	};

	useEffect(() => {
		fetchQuestions();
		
	}, []);

	const startTimer = (remainingMinutes, remainingSeconds) => {
		const endTime = Date.now() + (remainingMinutes * 60 * 1000) + (remainingSeconds * 1000);
		const interval = setInterval(() => {
			const remainingTime = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
			const minutes = Math.floor(remainingTime / 60);
			const seconds = remainingTime % 60;
			setTimer(`${minutes}:${seconds.toString().padStart(2, "0")}`);
			if (remainingTime <= 0) {
				clearInterval(interval);
				handleSubmitExam();
			}
		}, 1000);
	}; 

	const handleOptionClick = (optionId, questionId) => {
		// Update answers
		setAnswers(prevAnswers => ({
			...prevAnswers,
			[questionId]: optionId,
		}));

		// Update attempted questions array
		setAttemptedQuestions(prevAttempted => {
			const newAttempted = [...prevAttempted];
			const questionIndex = questions.findIndex(q => q._id === questionId);
			if (questionIndex !== -1) {
				newAttempted[questionIndex] = true;
			}
			return newAttempted;
		});
	};

	const handleNextQuestion = () => {
		if (currentQuestion < questions.length - 1) {
			setCurrentQuestion(currentQuestion + 1);
		}
	};

	const handlePreviousQuestion = () => {
		if (currentQuestion > 0) {
			setCurrentQuestion(currentQuestion - 1);
		}
	};

	const handleClearAnswer = () => {
		const currentQuestionId = questions[currentQuestion]._id;
		
		// Clear the answer
		setAnswers(prevAnswers => {
			const newAnswers = { ...prevAnswers };
			delete newAnswers[currentQuestionId];
			return newAnswers;
		});

		// Update attempted questions array
		setAttemptedQuestions(prevAttempted => {
			const newAttempted = [...prevAttempted];
			newAttempted[currentQuestion] = false;
			return newAttempted;
		});
	};

	const handleMarkforReview = () => {
		if (!markedArr.includes(currentQuestion)) {
			setMarkedArr([...markedArr, currentQuestion]);
			setMarkedForReview(markedForReview + 1);
		} else{
			setMarkedArr(markedArr.filter((item) => item !== currentQuestion));
			setMarkedForReview(markedForReview - 1);
		}
	};

	const handleSubmitExam = async () => {
		try {
			// Create submission data with only answered questions
			const answeredQuestions = questions.filter((q) => answers[q._id]);
			const submissionData = {
				questions: answeredQuestions,
				answers: answers,
				attemptedCount: attemptedQuestions.filter(Boolean).length
			};

			await axios.post(
				`${import.meta.env.VITE_API_URL}/v1/exams/${examId}/submit`,
				submissionData,
				{
					headers: {
						Authorization: localStorage.getItem("token"),
					},
				}
			);
			navigate(`/submitexam/${examId}/result`);
			toast.success("Exam submitted successfully!");
		} catch (error) {
			console.error(
				"Error submitting exam:",
				error.response?.data?.message || error.message
			);
			toast.error("Failed to submit the exam.");
		}
	};

	const attemptedCount = attemptedQuestions.filter(Boolean).length;
	
	const totalQuestions = questions.length;
	
	const calculateStatusCounts = () => {
		const answered = attemptedQuestions.filter(Boolean).length;
		const notAnswered = questions.length - answered;
		const notVisited = questions.length - Object.keys(answers).length;

		return { notVisited, notAnswered, answered };
	};

	const { notVisited, notAnswered, answered } = calculateStatusCounts();

	return (
		<div className="exam-container">
			<div className="exam-left">
				{questions.length > 0 && (
					<>
						<h3>Question {currentQuestion + 1}</h3>
						<p>{questions[currentQuestion].questionText}</p>
						<div className="options">
							{questions[currentQuestion].options.map((option) => (
								<button
									key={option._id}
									className={`option-btn ${
										answers[questions[currentQuestion]._id] === option._id
											? "selected"
											: ""
									}`}
									onClick={() =>
										handleOptionClick(
											option._id,
											questions[currentQuestion]._id
										)
									}>
									{option.text}
								</button>
							))}
						</div>
						<button onClick={handleClearAnswer}>Clear Answer</button>
					</>
				)}
			</div>

			<div className="exam-right">
				<h4>Navigation</h4>
				<div className="timer-display">
					Timer: {timer || "--:--"}
				</div>
				<div className="question-grid">
					{questions.map((q, index) => (
						<button
							key={index}
							data-current={currentQuestion === index}
							className={`question-btn ${attemptedQuestions[index] ? "attempted" : ""} 
								${markedArr.includes(index) ? "marked" : ""}`}
							onClick={() => setCurrentQuestion(index)}>
							{index + 1}
						</button>
					))}
				</div>
				<div className="nav-buttons">
					<button
						onClick={handlePreviousQuestion}
						disabled={currentQuestion === 0}
						className="nav-btn">
						← Previous
					</button>
					<button 
						onClick={handleMarkforReview}
						className={`mark-review-btn ${markedArr.includes(currentQuestion) ? "marked" : ""}`}>
						{markedArr.includes(currentQuestion)
							? "Unmark for Review"
							: "Mark for Review"}
					</button>
					<button
						onClick={handleNextQuestion}
						disabled={currentQuestion === questions.length - 1}
						className="nav-btn">
						Next →
					</button>
				</div>
				<div className="submit-section">
					<button 
						className="submit-btn"
						onClick={() => setIsModalOpen(true)}>
						Submit Exam
					</button>
				</div>
			</div>

			{isModalOpen && (
				<div className="modal-overlay">
					<div className="modal-content">
						<h3>Do you want to submit your exam?</h3>
						<p>You have attempted {attemptedCount} out of {totalQuestions} questions.</p>
						<div className="modal-actions">
							<button
								className="modal-submit"
								onClick={() => {
									setIsModalOpen(false);
									handleSubmitExam();
								}}>
								Yes, Submit
							</button>
							<button
								className="modal-cancel"
								onClick={() => setIsModalOpen(false)}>
								Cancel
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};


export default Examtaking;