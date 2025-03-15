import  { useState } from "react";
export default function Guidelines() {
    const [isAgreed,setisAgreed] = useState(false);
    const handlecheckboxchange=()=>{
        setisAgreed(!isAgreed);
    }
    return (
        <>
            <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
                <div className="w-full max-w-3xl bg-white p-6 md:p-10 rounded-lg shadow-lg">
                    <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">
                        Guidelines and Instructions for the Candidates for Online Examination
                    </h2>

                    <div className="space-y-4 text-sm md:text-base">
                        <p className="text-gray-700">
                            <strong>**Online examination</strong> is being conducted for evaluating the students’ performance for Term-End Examination (TEE) for various courses.
                        </p>
                        <p className="text-gray-700">
                            <strong>** It is an Online Examination system,</strong> fully computerized, user friendly having advanced security features making it fair, transparent and standardized.
                        </p>
                        <p className="text-gray-700">
                            <strong>**The term end examination</strong> will be conducted in an online proctored mode. Candidate can take the test from the safe and secure environment of his/her home, with a desktop/laptop and an internet connection (UN-interrupted internet speed is desirable).
                        </p>
                        <p className="text-gray-700">
                            <strong>**Candidates are requested</strong> to take the test honestly, ethically, and should follow all the instructions.
                        </p>
                        <p className="text-gray-700">
                            <strong>** The test will be auto-submitted</strong> after the timer runs out or the student can manually submit the test if completed before the time.
                        </p>
                    </div>

                    <h3 className="text-xl md:text-2xl font-semibold mt-6">Basic Instructions for Online Examinations:</h3>

                    <div className="mt-4">
                        <h4 className="font-semibold">A. General Information:</h4>
                        <ul className="list-decimal list-inside space-y-2 text-gray-700 mt-2 text-sm md:text-base">
                            <li>The examination will comprise of Objective type Multiple Choice Questions (MCQs) with more than one correct answer possible.</li>
                            <li>All questions are compulsory and each carries two marks which can be multi-select and single-select either.</li>
                            <li>The total number of questions will be 50 with all questions jumbled.</li>
                            <li>The Subjects or topics covered in the exam will be as per the Syllabus.</li>
                            <li>There will be NO NEGATIVE MARKING for the wrong answers.</li>
                        </ul>
                    </div>

                    <div className="mt-4">
                        <h4 className="font-semibold">B. Information & Instructions:</h4>
                        <ul className="list-decimal list-inside space-y-2 text-gray-700 mt-2 text-sm md:text-base">
                            <li>The examination does not require using any paper, pen and an inbuilt calculator will be there on the screen.</li>
                            <li>The system will generate the score in real time and the score will be shown immediately on the screen after the test ends.</li>
                            <li>On computer screen every student will be given objective type Multiple Choice Questions (MCQs).</li>
                            <li>Each student will get a different set from sets A,B and C with different questions and answers.</li>
                            <li>The students just need to click on the Right Choice / Correct option from the multiple choices/options given with each question.</li>
                        </ul>
                    </div>

                    <div className="flex items-center justify-center mt-6 space-x-2">
                        <input type="checkbox" checked={isAgreed} onChange={handlecheckboxchange} id="agree" className="h-5 w-5 text-blue-600" />
                        <label htmlFor="agree" className="text-gray-700 text-sm md:text-base">Agreed in all terms</label>
                    </div>

                    <div className="flex justify-center mt-4">
                    <button 
                        className={`px-4 md:px-6 py-2 rounded transition ${
                            isAgreed ? 'bg-blue-500 hover:bg-blue-600 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                        disabled={!isAgreed}
                    >
                        Take Exam
                    </button>
                    </div>
                </div>
            </div>
        </>
    )
}