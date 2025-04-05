import { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import "../../assets/css/ExamList.css";
import EditExamModal from "./Modal/EditExamModel";
import toast from "react-hot-toast";

const ExamList = () => {
	const [exams, setExams] = useState([]);
	const [loading, setLoading] = useState(true);
	const [editingExam, setEditingExam] = useState(null);

	const token = localStorage.getItem("token");

	// Fetch Exams
	const handleFetchExams = async () => {
		try {
			const response = await axios.get(
				`${import.meta.env.VITE_API_URL}/v1/admin/exams`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			setExams(response.data.exams);
			setLoading(false);
		} catch (error) {
			console.error("Error fetching exams:", error.response?.data || error.message);
			setLoading(false);
		}
	};

	useEffect(() => {
		handleFetchExams();
	}, []);

	const handleEdit = (exam) => {
		setEditingExam(exam);
		console.log(editingExam);
	};

	const handleCloseModal = () => {
		setEditingExam(null);
	};

	const handleSave = (id, updatedExam) => {
		setExams(
			exams.map((exam) =>
				exam._id === id ? { ...exam, ...updatedExam } : exam
			)
		);
	};

	// Delete Exam
	const handleDeleteExam = async (examId) => {
		try {
			await axios.delete(`${import.meta.env.VITE_API_URL}/v1/admin/exams/${examId}`, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem("token")}`,
				},
			});
			console.log("Exam deleted successfully");
			setExams((prevExams) => prevExams.filter((exam) => exam._id !== examId));
			toast.success("Exam deleted successfully!");
			// alert("Exam deleted successfully");
		} catch (error) {
			console.error("Error deleting exam:", error.response?.data || error.message);
		}
	};

	// Generate PDF
	const generatePDF = async (exam) => {
		try {
			// Show loading toast
			const loadingToast = toast.loading("Generating PDF report...");
			console.log(exam);
			
			// Fetch all results
			const resultsResponse = await axios.get(
				`${import.meta.env.VITE_API_URL}/v1/admin/results`,
				{
					headers: {
						Authorization: token,
					},
				}
			);
			console.log(resultsResponse.data.results);
			// Filter results for this specific exam
			const examResults = resultsResponse.data.results.filter(
				(result) => result.exam === exam._id
			);

			console.log(examResults);
			// Calculate statistics
			const registeredStudents = examResults?.length || 0;
			const attemptedStudents = examResults.length;
			const passedStudents = examResults.filter(result => result.status === "Pass").length;
			const failedStudents = attemptedStudents - passedStudents;
			
			// Create PDF document
			const doc = new jsPDF();
			
			// Add title
			doc.setFontSize(18);
			doc.text(`Exam Report: ${exam.title}`, 14, 22);
			
			// Add exam details
			doc.setFontSize(12);
			doc.text(`Date: ${new Date(exam.date).toLocaleDateString()}`, 14, 32);
			doc.text(`Time: ${exam.startTime}`, 14, 38);
			doc.text(`Duration: ${exam.timeLimit} minutes`, 14, 44);
			doc.text(`Created by: ${exam.createdBy?.firstName} ${exam.createdBy?.lastName}`, 14, 50);
			
			// Add statistics table
			doc.autoTable({
				startY: 60,
				head: [["Statistics", "Count"]],
				body: [
					["Registered Students", registeredStudents.toString()],
					["Attempted Students", attemptedStudents.toString()],
					["Passed Students", passedStudents.toString()],
					["Failed Students", failedStudents.toString()],
					["Pass Rate", attemptedStudents > 0 ? `${Math.round((passedStudents / attemptedStudents) * 100)}%` : "N/A"],
				],
				theme: 'grid',
				headStyles: { fillColor: [41, 128, 185], textColor: 255 },
				styles: { fontSize: 12 }
			});
			
			// Add description
			if (exam.description) {
				const finalY = doc.lastAutoTable.finalY + 10;
				doc.text("Exam Description:", 14, finalY);
				doc.setFontSize(10);
				doc.text(exam.description, 14, finalY + 6);
			}
			
			// Add results table if there are attempted exams
			if (attemptedStudents > 0) {
				const startY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 20 : 120;
				
				doc.setFontSize(14);
				doc.text("Student Results", 14, startY + 10);
				
				// Fetch student details for each result
				const resultDataPromises = examResults.map(async (result) => {
					try {
						// Try to fetch student details
						const studentResponse = await axios.get(
							`${import.meta.env.VITE_API_URL}/v1/admin/user/${result.student}`,
							{
								headers: {
									Authorization: token,
								},
							}
						);
						
						const student = studentResponse.data.user;
						const studentName = student ? `${student.firstName} ${student.lastName}` : "Unknown Student";
						const attemptedQuestions = result.questionsAnswered ? result.questionsAnswered.length : 0;
						const percentage = exam.totalQuestions > 0 ? Math.round((result.score / exam.totalQuestions) * 100) : 0;
						
						return [
							studentName,
							result.score,
							attemptedQuestions,
							exam.totalQuestions,
							`${percentage}%`,
							result.status,
							new Date(result.createdAt).toLocaleString()
						];
					} catch (error) {
						// If we can't get student details, still show the result with minimal info
						return [
							`Student ID: ${result.student}`,
							result.score,
							result.questionsAnswered ? result.questionsAnswered.length : 'N/A',
							exam.totalQuestions,
							exam.totalQuestions > 0 ? Math.round((result.score / exam.totalQuestions) * 100) : 0,
							
							result.status,
							new Date(result.createdAt).toLocaleString()
						];
					}
				});
				
				// Wait for all student data to be fetched
				const resultData = await Promise.all(resultDataPromises);
				
				doc.autoTable({
					startY: startY,
					head: [["Student Name", "Score", "Attempted Questions","Total Question", "Percentage", "Status", "Submitted At"]],
					body: resultData,
					theme: 'grid',
					headStyles: { fillColor: [41, 128, 185], textColor: 255 },
					styles: { fontSize: 10 },
					columnStyles: {
						5: { cellWidth: 40 }
					}
				});
			}
			
			// Save the PDF
			doc.save(`${exam.title}_exam_report.pdf`);
			
			// Dismiss loading toast and show success
			toast.dismiss(loadingToast);
			toast.success("PDF report generated successfully!");
		} catch (error) {
			console.error("Error generating PDF:", error);
			toast.error("Failed to generate PDF report");
		}
	};

	// Handle File Import
	const handleFileImport = (event) => {
		const file = event.target.files[0];
		alert(`File selected: ${file.name}`);
		// Add file processing logic here
	};

	if (loading) return <div>Loading...</div>;

	return (
		<div className="exam-list-container">
			<div className="header">
				<h2 className="heading">Exam List</h2>
				<div>
					<button
						className="import-button"
						onClick={() => document.getElementById("fileInput").click()}>
						Import File
					</button>
					<input
						type="file"
						id="fileInput"
						style={{ display: "none" }}
						onChange={handleFileImport}
					/>
				</div>
			</div>

			<table className="exam-table">
				<thead>
					<tr>
						<th>Title</th>
						<th>Time Limit</th>
						<th>Exam Date</th>
						<th>Time</th>
						<th>BatchId</th>
						<th>Created By</th>
						<th>Actions</th>
						<th>Generate PDF</th>
					</tr>
				</thead>
				<tbody>
					{exams.map((exam) => (
						<tr key={exam._id}>
							<td>{exam.title}</td>
							<td>{exam.timeLimit} minutes</td>
							<td>
								{editingExam?._id === exam._id ? (
									<input 
										type="date"
										defaultValue={exam.date.split('T')[0]}
										onChange={(e) => {
											setEditingExam({
												...editingExam,
												date: e.target.value
											});
										}}
									/>
								) : (
									new Date(exam.date).toLocaleDateString()
								)}
							</td>
				
							<td>
								{editingExam?._id === exam._id ? (
									<input 
										type="time"
										defaultValue={exam.startTime}
										onChange={(e) => {
											setEditingExam({
												...editingExam,
												startTime: e.target.value
											});
										}}
									/>
								) : (
									exam.startTime
								)}
							</td>
							<td>
								{exam.batch}
							</td>
							<td>
								{exam.createdBy?.firstName} {exam.createdBy?.lastName}
							</td>
							<td className="action-icons">
								<FaEdit
									onClick={() => handleEdit(exam)}
									className="icon edit-icon"
								/>
								<FaTrash
									onClick={() => handleDeleteExam(exam._id)}
									className="icon delete-icon"
								/>
							</td>
							<td>
								<button
									onClick={() => generatePDF(exam)}
									className="pdf-button">
									Generate PDF
								</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>
			{editingExam && (
				<EditExamModal
					exam={editingExam}
					onClose={handleCloseModal}
					onSave={handleSave}
					token={token}
				/>
			)}
		</div>
	);
};

export default ExamList;
