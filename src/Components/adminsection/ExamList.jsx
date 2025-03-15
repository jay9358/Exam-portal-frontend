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
	const generatePDF = (exam) => {
		const doc = new jsPDF();
		const tableData = [
			[
				exam.title,
				exam.description,
				`${exam.timeLimit} minutes`,
				new Date(exam.date).toLocaleDateString(),
				exam.startTime,
				exam.createdBy?.firstName + " " + exam.createdBy?.lastName,
			],
		];

		doc.autoTable({
			head: [["Title", "Date", "Time", "Registered Students", "Attempted Students","Passed Students","Failed Students", "Created By"]],
			
		});

		doc.save(`${exam.title}_exam_details.pdf`);
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
