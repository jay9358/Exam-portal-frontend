import React, { useState, useEffect } from "react";

function EditQuestionModal({ question, isOpen, onSave, onClose }) {
	const [questionText, setQuestionText] = useState(question.questionText);
	const [options, setOptions] = useState(question.options);

	useEffect(() => {
		if (isOpen) {
			setQuestionText(question.questionText);
			setOptions(question.options);
		}
	}, [question, isOpen]);

	const handleOptionChange = (index, value) => {
		const newOptions = options.map((opt, i) => {
			if (i === index) {
				return { ...opt, text: value };
			}
			return opt;
		});
		setOptions(newOptions);
	};

	const handleOptionToggleCorrect = (index) => {
		const newOptions = options.map((opt, i) => {
			if (i === index) {
				return { ...opt, isCorrect: !opt.isCorrect };
			}
			return opt;
		});
		setOptions(newOptions);
	};

	const handleSubmit = () => {
		onSave(question.id, questionText, options);
		onClose();
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
			<div className="bg-white p-4 rounded-lg shadow-lg max-w-md w-full">
				<h4>Edit Question</h4>
				<input
					type="text"
					value={questionText}
					onChange={(e) => setQuestionText(e.target.value)}
					className="border p-1 rounded w-full"
				/>
				{options.map((option, index) => (
					<div key={index}>
						<input
							type="text"
							value={option.text}
							onChange={(e) => handleOptionChange(index, e.target.value)}
							className="border p-1 rounded w-full my-2"
						/>
						<button onClick={() => handleOptionToggleCorrect(index)}>
							{option.isCorrect ? "Mark Incorrect" : "Mark Correct"}
						</button>
					</div>
				))}
				<button
					onClick={handleSubmit}
					className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
					Save Changes
				</button>
				<button
					onClick={onClose}
					className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-2">
					Cancel
				</button>
			</div>
		</div>
	);
}
