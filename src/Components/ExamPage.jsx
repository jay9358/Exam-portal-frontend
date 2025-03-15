import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function ExamPages() {
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // For navigation

    // Function to fetch data
    const fetchExamData = async () => {
        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/exams`, // Change API endpoint
                {
                    headers: {
                        Authorization: localStorage.getItem("token"),
                    },
                }
            );

            const result = await response.json();

            if (response.ok) {
                setData(result.exams || []); // Assuming the response has an `exams` field
                toast.success("Exams data fetched successfully!");
            } else {
                toast.error(result.message || "Failed to fetch exam data.");
            }
        } catch (error) {
            console.error("Error fetching exam data:", error);
            toast.error("Error fetching exam data.");
        } finally {
            setIsLoading(false);
        }
    };

    // Function to start the exam
    const handleStartExam = (examId) => {
        navigate(`/exam/${examId}`);
    };

    // Fetch data on component mount
    useEffect(() => {
        fetchExamData();
    }, []);

    return (
        <div className="flex flex-col h-screen bg-gray-100">
            {/* Content Area */}
            <div className="flex-1 p-5">
                {/* Sort Dropdown */}
                <div className="mb-4">
                    <label htmlFor="sort" className="mr-2 font-medium">Sort:</label>
                    <select id="sort" className="border p-2 rounded">
                        <option>Last Week</option>
                        <option>Last Month</option>
                        <option>All Time</option>
                    </select>
                </div>

                {/* Exam Table */}
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    {isLoading ? (
                        <div className="text-center text-gray-500">Loading data...</div>
                    ) : error ? (
                        <div className="text-center text-red-500">{error}</div>
                    ) : (
                        <>
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr>
                                        <th className="py-3 px-2 border-b">#</th>
                                        <th className="py-3 px-2 border-b">Exams</th>
                                        <th className="py-3 px-2 border-b">Attempted</th>
                                        <th className="py-3 px-2 border-b">Total Questions</th>
                                        <th className="py-3 px-2 border-b">Total Score</th>
                                        <th className="py-3 px-2 border-b">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.map((exam, index) => (
                                        <tr key={index}>
                                            <td className="py-3 px-2 border-b">{index + 1}</td>
                                            <td className="py-3 px-2 border-b font-bold">{exam.name}</td>
                                            <td className="py-3 px-2 border-b">{exam.attempted}</td>
                                            <td className="py-3 px-2 border-b">{exam.totalQuestions}</td>
                                            <td className="py-3 px-2 border-b">{exam.totalScore}</td>
                                            <td className="py-3 px-2 border-b">
                                                <button
                                                    className="px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700"
                                                    onClick={() => handleStartExam(exam.id)}
                                                >
                                                    Start
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className="text-center mt-4 font-bold">
                                Total Score — {data.reduce((acc, exam) => acc + exam.totalScore, 0)}/
                                {data.reduce((acc, exam) => acc + exam.totalQuestions, 0)}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
