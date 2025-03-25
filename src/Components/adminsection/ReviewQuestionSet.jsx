import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import '../../assets/css/Review.css'; // Adjust the path as necessary

export default function ReviewQuestionSet() {
	const [exams, setExams] = useState([]);
	const [loading, setLoading] = useState(true);
	const [setNames, setSetNames] = useState({});
	const [questionSets, setQuestionSets] = useState({});
	const [admin,setAdmin]=useState(0);
	const fetchExams = async () => {
		const token = localStorage.getItem("token");
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
			console.log(response.data.exams)
			
		} catch (error) {
			console.error("Error fetching exams:", error.response?.data || error.message);
		}
	};

	const fetchQuestionSetsByType = async () => {
		const token = localStorage.getItem("token");
		try {
			const response = await axios.get(
				`${import.meta.env.VITE_API_URL}/v1/exams/questionsets/Exam Set`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			setQuestionSets(response.data.questionSets);
		} catch (error) {
			console.error("Error fetching question sets by type:", error.response?.data || error.message);
		}
	};

	useEffect(() => {
		fetchExams();
		fetchQuestionSetsByType();
	}, []);

	const approveExamSet = async (id) => {
		const token = localStorage.getItem("token");
		try {
			await axios.post(
				`${import.meta.env.VITE_API_URL}/v1/admin/exams/${id}/approve`,
				{},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			console.log(`Approved exam set with id: ${id}`);
			fetchExams(); // Refresh the list after approval
		} catch (error) {
			console.error("Error approving exam set:", error.response?.data || error.message);
		}
	};


	const generatePDF = async (set) => {
		console.log(set)
		const token = localStorage.getItem("token");
		try {
			const response = await axios.get(
				`${import.meta.env.VITE_API_URL}/v1/admin/exams/${set._id}/questions`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			const questions = response.data.questions;
			console.log(questions)
			// Create PDF document
			const doc = new jsPDF();
			
			// Add colored header background - reduced height
			doc.setFillColor(52, 152, 219);
			doc.rect(0, 0, doc.internal.pageSize.width, 30, 'F');
			
			// Add exam title with white color - adjusted position
			doc.setTextColor(255, 255, 255);
			doc.setFont("helvetica", "bold");
			doc.setFontSize(16);
			console.log(set.setName)
			doc.text(set.setName.toUpperCase(), doc.internal.pageSize.width/2, 20, { align: "center" });
			
			// Reset text color to black
			doc.setTextColor(0, 0, 0);
			
			// Add date and duration with styling - moved up
			doc.setFontSize(10);
			doc.setFont("helvetica", "normal");
			doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 40);

			// Add weightage table - compact version


			
			
	// Initialize yPos with a default value if autoTable is not used
			let yPos = (doc.autoTable && doc.autoTable.previous) ? doc.autoTable.previous.finalY + 35 : 50;
			const pageHeight = doc.internal.pageSize.height;

			// Add logging to verify values
			console.log(`Drawing rect at yPos: ${yPos}, width: ${doc.internal.pageSize.width - 30}`);

			// Add questions with compact formatting
			console.log(questions)
			questions.forEach((q, index) => {
				if (yPos > pageHeight - 40) {
					doc.addPage();
					yPos = 20;
				}

				// Question box with light background - reduced height
				doc.setFillColor(240, 240, 240);
				doc.rect(15, yPos - 4, doc.internal.pageSize.width - 30, 6, 'F');
				
				// Question number and text
				doc.setFont("helvetica", "bold");
				doc.setFontSize(10);
				doc.text(`Q${index + 1}.`, 20, yPos);
				doc.setFont("helvetica", "normal");
				doc.text(` ${q.questionText}`, 32, yPos);
				
				yPos += 8; // Reduced spacing

				// Options with compact formatting
				q.options.forEach((option, optIndex) => {
					if (yPos > pageHeight - 30) {
						doc.addPage();
						yPos = 20;
					}

					const optionLabel = String.fromCharCode(65 + optIndex);
					
					// Option circle - smaller
					doc.setDrawColor(52, 152, 219);
					doc.circle(25, yPos - 2, 1.5, 'S');
					
					// Option text
					doc.setFontSize(9);
					doc.text(`${optionLabel}) ${option.text}`, 32, yPos);
					yPos += 7; // Reduced spacing between options
				});

				yPos += 5; // Reduced spacing between questions
			});

			// Add page numbers with styling - smaller footer
            const pageCount = doc.internal.getNumberOfPages();
            for (let i = 1; i <= pageCount; i++) {
                doc.setPage(i);
                doc.setFontSize(8);
                doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.width - 40, doc.internal.pageSize.height - 10);
            }

            // Save the PDF with a descriptive name
            doc.save(`${set.setName.replace(/\s+/g, '_')}_Question_Paper.pdf`);
		} catch (error) {
			console.error("Error fetching exam questions:", error.response?.data || error.message);
		}
	};



	return (
		<div className="review-exam-set">
			<h1>Review Exam Set</h1>
			<ul>
				{exams.map(exam => (
					<li key={exam.id}>
						<strong>{exam.title}</strong> - Batch: {exam.batch}
						

						{exam.ApprovalStatus === 'Approved' ? (
							<span style={{ color: 'green', fontWeight: 'bold' }}>Approved</span>
						) : (
							exam.createdBy._id != localStorage.getItem('userId') && <button onClick={() => approveExamSet(exam._id)}>Approve</button>
						)}
						
						<ul>
							{Object.keys(questionSets).filter(setId => questionSets[setId].exam.toString() === exam._id).map(setId => (
								<li key={setId}>
									{questionSets[setId].setName || "Unknown Set"}
									<button onClick={() => generatePDF(questionSets[setId])}>Download Set PDF</button>
								</li>
							))}
						</ul>
					</li>
				))}
			</ul>


		</div>
	);
}
