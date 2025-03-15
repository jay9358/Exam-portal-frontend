// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const ExamInstructions = () => {
	const { examId } = useParams();
	const navigate = useNavigate();
	const [isAgreed, setIsAgreed] = useState(false);

	const handleStartExam = () => {
		if (isAgreed) {
			navigate(`/exam/${examId}`);
		}
	};

	return (
		<div className="bg-gray-100 min-h-screen flex items-center justify-center p-5">
			<div className="bg-white shadow-lg rounded-lg p-6 max-w-3xl w-full p-5">
				<h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
					Guidelines and Instructions for the Candidates for Online Examination
				</h1>

				<div className="text-gray-700 space-y-4">
					<p>
						**Online examination is being conducted for evaluating the students’
						performance for Term-End Examination (TEE) for various courses.
					</p>
					<p>
						** It is an Online Examination system, fully computerized, user
						friendly having advanced security features making it fair,
						transparent and standardized.
					</p>
					<p>
						**The term end examination will be conducted in an online proctored
						mode. Candidate can take the test from the safe and secure
						environment of his/her home, with a desktop/laptop/ and an internet
						connection (UN-interrupted internet speed is desirable).
					</p>
					<p>
						**Candidates are requested to take the test honestly, ethically, and
						should follow all the instructions.
					</p>
					<p>
						** The test will be auto-submitted after the timer runs out or the
						student can manually submit the test if completed before the time.
					</p>

					<h2 className="text-xl font-semibold mt-6">
						Basic Instructions for Online Examinations:
					</h2>

					<h3 className="text-lg font-medium mt-4">A. General information:</h3>
					<ol className="list-decimal list-inside space-y-2">
						<li>
							The examination will comprise of Objective type Multiple Choice
							Questions (MCQs) with more than one correct answers possible.
						</li>
						<li>
							All questions are compulsory and each carries two marks which can
							be multi-select and single-select either.
						</li>
						<li>
							The total number of questions will be 50 with all questions
							jumbled.
						</li>
						<li>
							The Subjects or topics covered in the exam will be as per the
							Syllabus.
						</li>
						<li>There will be NO NEGATIVE MARKING for the wrong answers.</li>
					</ol>

					<h3 className="text-lg font-medium mt-4">
						B. Information & Instructions:
					</h3>
					<ol className="list-decimal list-inside space-y-2">
						<li>
							The examination does not require using any paper, pen and an
							inbuilt calculator will be there on the screen.
						</li>
						<li>
							The system will generate the score in real time and the score will
							be shown immediately on the screen after the test ends.
						</li>
						<li>
							On computer screen every student will be given objective type
							Multiple Choice Questions (MCQs).
						</li>
						<li>
							Each student will get a different set from sets A, B and C with
							different questions and answers.
						</li>
						<li>
							The students just need to click on the Right Choice / Correct
							option from the multiple choices/options given with each question.
							For Multiple Choice Questions, each question has four options, and
							the candidate has to click the appropriate option.
						</li>
					</ol>
				</div>

				<div className="flex items-center justify-between mt-6">
					<label className="flex items-center text-gray-700">
						<input
							type="checkbox"
							className="form-checkbox h-5 w-5 text-blue-600 rounded focus:ring focus:ring-blue-200 mr-2"
							onChange={(e) => setIsAgreed(e.target.checked)}
						/>
						Agreed in all terms
					</label>
					<button
						className={`px-5 mx-5 py-2 rounded focus:outline-none focus:ring focus:ring-blue-200 ${
							isAgreed
								? "bg-blue-500 text-white hover:bg-blue-600"
								: "bg-gray-300 text-gray-500 cursor-not-allowed"
						}`}
						onClick={handleStartExam}
						disabled={!isAgreed}>
						Take Exam
					</button>
				</div>
			</div>
		</div>
	);
};

export default ExamInstructions;
