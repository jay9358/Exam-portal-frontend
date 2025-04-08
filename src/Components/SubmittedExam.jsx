import React, { useState, useEffect } from "react";
import axios from "axios";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js"; // Import required components from Chart.js
import { useParams } from "react-router-dom";
import "../assets/css/SubmittedExam.css";

// Inside your component

// Register the components with Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

const SubmittedExam = () => {
	const { examId } = useParams();
	const [result, setResult] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const fetchResult = async () => {
		try {
			const response = await axios.get(
				`${import.meta.env.VITE_API_URL}/v1/exams/${examId}/result`,
				{
					headers: {
						Authorization: localStorage.getItem("token"), // Ensure token is set
					},
				}
			);
			setResult(response.data.resultData);
			console.log(response.data.resultData);

		} catch (err) {
			setError(err.response?.data?.message || "Error fetching exam result");
			console.log(err.response);
		} finally {
			setLoading(false);
		}
	};
	useEffect(() => {
		sessionStorage.clear();

		deletesession();
		fetchResult();
	}, [examId]);
	const deletesession = async () => {
		const response = await axios.delete(`${import.meta.env.VITE_API_URL}/v1/exams/${localStorage.getItem("userId")}/sessionDelete`, {
			headers: {
				Authorization: localStorage.getItem("token"),
			},
		});
		console.log("Session deleted:", response);
	}
	if (loading) return <p>Loading...</p>;
	if (error) return <p>Error: {error}</p>;

	// Chart data
	const pieData = {
		labels: ["Questions Attempted", "Unattempted Questions"],
		datasets: [
			{
				data: [
					result.questionsAttempted,
					result.totalQuestions - result.questionsAttempted,
				],
				backgroundColor: ["#36A2EB", "#FF6384"],
				hoverBackgroundColor: ["#36A2EB", "#FF6384"],
			},
		],
	};

		const pieOptions = {
		responsive: true,
		maintainAspectRatio: true,
		plugins: {
			legend: {
				position: "bottom",
			},
		},
	};

	return (
		<div className="submitted-exam">
			<h2>Exam Results</h2>
			<div className="result-details">
				<p>
					<strong>Student:</strong> {result.student}
				</p>
				<p>
					<strong>Exam:</strong> {result.exam}
				</p>
				<p>
					<strong>Status:</strong> {result.status}
				</p>
				<p>
					<strong>Score:</strong> {result.score}
				</p>
				<p>
					<strong>Questions Attempted:</strong> {result.questionsAttempted}
				</p>
				<p>
					<strong>Total Questions:</strong> {result.totalQuestions}
				</p>
			</div>

			{/* <div className="chart-container">
				<h3>Performance Breakdown</h3>
				<Pie data={pieData} />
			</div> */}

            <div className="chart-container">
 				<h3>Performance Breakdown</h3>
 				<div className="pie-chart">
 					<Pie data={pieData} options={pieOptions} />
 				</div>
 			</div>
		</div>
	);
};

export default SubmittedExam;