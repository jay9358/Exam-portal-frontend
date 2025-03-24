import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import '../../assets/css/Review.css'; // Adjust the path as necessary

export default function ReviewQuestionSet() {
	const [exams, setExams] = useState([]);
	const [loading, setLoading] = useState(true);
	const [setNames, setSetNames] = useState({});

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
			const names = {};
			for (const exam of response.data.exams) {
				for (const setId in exam.questionSetWeights) {
					console.log(setId);
					try {
						const response = await axios.get(
							`${import.meta.env.VITE_API_URL}/v1/admin/questionSets/${setId}`,
							{
								headers: {
									Authorization: `Bearer ${token}`,
								},
							}
						);
						console.log(response.data);
						names[setId] = response.data.questionSet.setName;
					} catch (error) {
						console.error(`Error fetching set name for id ${setId}:`, error.response?.data || error.message);
					}
				}
			}
			setSetNames(names);
		} catch (error) {
			console.error("Error fetching exams:", error.response?.data || error.message);
		}
	};

	useEffect(() => {
		fetchExams();
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

	const generatePDF = async (exam) => {
		const token = localStorage.getItem("token");
		try {
			const response = await axios.get(
				`${import.meta.env.VITE_API_URL}/v1/admin/exams/${exam._id}/questions`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			const questions = response.data.questions;

			// Create PDF document
			const doc = new jsPDF();
			
			// Add colored header background - reduced height
			doc.setFillColor(52, 152, 219);
			doc.rect(0, 0, doc.internal.pageSize.width, 30, 'F');
			
			// Add exam title with white color - adjusted position
			doc.setTextColor(255, 255, 255);
			doc.setFont("helvetica", "bold");
			doc.setFontSize(16);
			doc.text(exam.title.toUpperCase(), doc.internal.pageSize.width/2, 20, { align: "center" });
			
			// Reset text color to black
			doc.setTextColor(0, 0, 0);
			
			// Add date and duration with styling - moved up
			doc.setFontSize(10);
			doc.setFont("helvetica", "normal");
			doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 40);
			doc.text(`Duration: ${exam.timeLimit} minutes`, doc.internal.pageSize.width - 20, 40, { align: "right" });

			// Add weightage table - compact version
			const weightageData = [];
			for (const setId in exam.questionSetWeights) {
				const setName = setNames[setId] || "Unknown Set";
				weightageData.push([setName, `${exam.questionSetWeights[setId]}%`]);
			}

			doc.autoTable({
				startY: 45,
				head: [['Question Set', 'Weightage']],
				body: weightageData,
				headStyles: {
					fillColor: [41, 128, 185],
					textColor: 255,
					fontSize: 10,
					halign: 'center'
				},
				bodyStyles: {
					fontSize: 9,
					halign: 'center',
					cellPadding: 2
				},
				alternateRowStyles: {
					fillColor: [240, 240, 240]
				},
				margin: { left: 20, right: 20 },
			});

			// Add instructions with styling - more compact
			doc.setFillColor(243, 156, 18);
			doc.rect(20, doc.autoTable.previous.finalY + 5, doc.internal.pageSize.width - 40, 20, 'F');
			
			doc.setTextColor(255, 255, 255);
			doc.setFont("helvetica", "bold");
			doc.setFontSize(10);
			doc.text("Instructions:", 25, doc.autoTable.previous.finalY + 12);
			
			// Instructions in two columns
			doc.setTextColor(0, 0, 0);
			doc.setFont("helvetica", "normal");
			doc.setFontSize(8);
			const instructions = [
				"1. All questions are compulsory",
				"2. Each question carries equal marks",
				"3. Choose the most appropriate option",
				"4. No negative marking"
			];
			
			// Split instructions into two columns
			const leftInstructions = instructions.slice(0, 2);
			const rightInstructions = instructions.slice(2);
			doc.text(leftInstructions, 25, doc.autoTable.previous.finalY + 20);
			doc.text(rightInstructions, doc.internal.pageSize.width/2 + 10, doc.autoTable.previous.finalY + 20);

			// Starting position for questions - reduced spacing
			let yPos = doc.autoTable.previous.finalY + 35;
			const pageHeight = doc.internal.pageSize.height;

			// Add questions with compact formatting
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
			for(let i = 1; i <= pageCount; i++) {
				doc.setPage(i);
				doc.setFillColor(52, 152, 219);
				doc.rect(0, pageHeight - 15, doc.internal.pageSize.width, 15, 'F');
				doc.setTextColor(255, 255, 255);
				doc.setFontSize(8);
				doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.width/2, pageHeight - 6, {
					align: "center"
				});
			}

			// Save the PDF
			doc.save(`${exam.title}_Question_Paper.pdf`);
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
						<button onClick={() => approveExamSet(exam.id)}>Approve</button>
						<button onClick={() => generatePDF(exam)}>Download Exam Set PDF</button>
					</li>
				))}
			</ul>
		</div>
	);
}
