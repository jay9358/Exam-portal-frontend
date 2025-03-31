import React, { useState, useEffect } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "../../assets/css/Review.css";

export default function ReviewQuestionSet() {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [setNames, setSetNames] = useState({});
  const [questionSets, setQuestionSets] = useState({});
  const [admin, setAdmin] = useState(0);
  const [usersPerPage, setUsersPerPage] = useState(10); // State for users per page
  const [currentPage, setCurrentPage] = useState(1);
  const [approve,setApprove]=useState(); // State for current page
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
    
      console.log(response.data.exams);
    } catch (error) {
      console.error(
        "Error fetching exams:",
        error.response?.data || error.message
      );
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
      console.error(
        "Error fetching question sets by type:",
        error.response?.data || error.message
      );
    }
  };

  useEffect(() => {
    fetchExams();
    fetchQuestionSetsByType();
  }, []);

  const approveExamSet = async (id) => {
    const token = localStorage.getItem("token");
    const userId=localStorage.getItem("userId")
    console.log()
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/v1/admin/exams/${id}/approve`,
        {userId},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(`Approved exam set with id: ${id}`);
      
      fetchExams(); // Refresh the list after approval
    } catch (error) {
      console.error(
        "Error approving exam set:",
        error.response?.data || error.message
      );
    }

  };

  const generatePDF = async (set) => {
    console.log(set);
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
      console.log(questions);
      // Create PDF document
      const doc = new jsPDF();

      // Add colored header background - reduced height
      doc.setFillColor(52, 152, 219);
      doc.rect(0, 0, doc.internal.pageSize.width, 30, "F");

      // Add exam title with white color - adjusted position
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      console.log(set.setName);
      doc.text(set.setName.toUpperCase(), doc.internal.pageSize.width / 2, 20, {
        align: "center",
      });

      // Reset text color to black
      doc.setTextColor(0, 0, 0);

      // Add date and duration with styling - moved up
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 40);

      // Add weightage table - compact version

      // Initialize yPos with a default value if autoTable is not used
      let yPos =
        doc.autoTable && doc.autoTable.previous
          ? doc.autoTable.previous.finalY + 35
          : 50;
      const pageHeight = doc.internal.pageSize.height;

      // Add logging to verify values
      console.log(
        `Drawing rect at yPos: ${yPos}, width: ${
          doc.internal.pageSize.width - 30
        }`
      );

      // Add questions with compact formatting
      console.log(questions);
      questions.forEach((q, index) => {
        if (yPos > pageHeight - 40) {
          doc.addPage();
          yPos = 20;
        }

        // Question box with light background - reduced height
        doc.setFillColor(240, 240, 240);
        doc.rect(15, yPos - 4, doc.internal.pageSize.width - 30, 6, "F");

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
          doc.circle(25, yPos - 2, 1.5, "S");

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
        doc.text(
          `Page ${i} of ${pageCount}`,
          doc.internal.pageSize.width - 40,
          doc.internal.pageSize.height - 10
        );
      }

      // Save the PDF with a descriptive name
      doc.save(`${set.setName.replace(/\s+/g, "_")}_Question_Paper.pdf`);
    } catch (error) {
      console.error(
        "Error fetching exam questions:",
        error.response?.data || error.message
      );
    }
  };

  const [batchFilter, setBatchFilter] = useState("");

  // Filter exams based on batch
  const filteredExams = batchFilter
    ? exams.filter((exam) =>
        exam.batch.toLowerCase().includes(batchFilter.toLowerCase())
      )
    : exams;

  // Handle change in users per page
  const handleUsersPerPageChange = (e) => {
    setUsersPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when changing users per page
  };

  // Calculate the current schools to display
  const indexOfLastSchool = currentPage * usersPerPage;
  const indexOfFirstSchool = indexOfLastSchool - usersPerPage;
  const currentBatches = filteredExams.slice(
    indexOfFirstSchool,
    indexOfLastSchool
  );

  // Calculate total pages
  const totalPages = Math.ceil(filteredExams.length / usersPerPage);
  useEffect(() => {
    fetchExams();
    fetchQuestionSetsByType();
  }, []);

  return (
    <>
      <div className="review-exam-set">
        <h1 className="title"> Review Exam Set</h1>
        {/* Batch Filter */}
        <div className="filter-container">
          <input
            type="text"
            id="batch-filter"
            placeholder="Enter batch..."
            className="bg-light"
            value={batchFilter}
            onChange={(e) => setBatchFilter(e.target.value)}
          />
        </div>

        {/* Exam Table */}
        <table className="exam-table ">
          <thead>
            <tr>
              <th>S/N</th>
              <th>Exam Title</th>
              <th>Batch</th>
              <th>Approval Status</th>
              <th>Question Sets</th>
              <th>Created By</th>
            
              <th>Updated By</th>
            </tr>
          </thead>
          <tbody>
            {currentBatches.length > 0 ? (
              currentBatches.map((exam, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>

                  <td>{exam.title}</td>
                  <td>{exam.batch}</td>

                  <td>
                    {exam.ApprovalStatus === "Approved" ? (
                      <span style={{ color: "green", fontWeight: "bold" }}>
                        Approved
                      </span>
                    ) : (
                      exam.createdBy._id !== localStorage.getItem("userId") && (
                        <button
                          className="approve-btn btn-danger"
                          onClick={() => approveExamSet(exam._id)}
                        >
                          Approve
                        </button>
                      )
                    )}
                  </td>

                  <td>
                    <ul className="question-set-list">
                      {Object.keys(questionSets)
                        .filter(
                          (setId) =>
                            questionSets[setId].exam.toString() === exam._id
                        )
                        .map((setId) => (
                          <li key={setId}>
                            {questionSets[setId].setName || "Unknown Set"}
                            <button
                              onClick={() => generatePDF(questionSets[setId])}
                            >
                              Download Set PDF
                            </button>
                          </li>
                        ))}
                    </ul>
                  </td>
                  <td>{exam.createdBy.firstName} {exam.createdBy.lastName}</td>
                  <td>{exam.approvedByName}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="no-data">
                  No exams found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {/* Users per page selection */}
        <div className="users-per-page">
          <label htmlFor="users-per-page">Users per page:</label>
          <select
            id="users-per-page"
            value={usersPerPage}
            onChange={handleUsersPerPageChange}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
        {/* Pagination Controls */}
        <div className="pagination">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index + 1)}
              className={currentPage === index + 1 ? "active" : ""}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
