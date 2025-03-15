// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; 

import "../../../assets/css/EditExamModal.css"; 

const EditExamModal = ({ exam, onClose, onSave, token }) => {
	const [formData, setFormData] = useState({
		title: exam.title,
		description: exam.description,
		timeLimit: exam.timeLimit,
		date: new Date(exam.date).toISOString().split('T')[0],
		startTime: exam.startTime
	});

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const response = await axios.put(
				`${import.meta.env.VITE_API_URL}/v1/admin/exams/${exam._id}`,
				formData,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			onSave(exam._id, response.data);
			toast.success("Exam updated successfully!");
			onClose();
		} catch (error) {
			console.error("Error updating exam:", error);
			toast.error("Failed to update exam: " + (error.response?.data?.message || error.message));
		}
	};

	return (
		<div
			className="modal-overlay"
			onClick={onClose} // Close modal when clicking outside of it
		>
			<div
				className="modal-content"
				onClick={(e) => e.stopPropagation()} // Prevent click outside modal from closing it
			>
				<h2>Edit Exam</h2>
				<form onSubmit={handleSubmit}>
					<div className="form-group">
						<label htmlFor="title">Title:</label>
						<input
							type="text"
							name="title"
							value={formData.title}
							onChange={handleChange}
							required
							aria-label="Exam title"
						/>
					</div>
					<div className="form-group">
						<label htmlFor="description">Description:</label>
						<textarea
							name="description"
							value={formData.description}
							onChange={handleChange}
							required
							aria-label="Exam description"
						/>
					</div>
					<div className="form-group">
						<label htmlFor="date">Exam Date:</label>
						<input
							type="date"
							name="date"
							value={formData.date}
							onChange={handleChange}
							required
							aria-label="Exam date"
						/>
					</div>
					<div className="form-group">
						<label htmlFor="startTime">Start Time:</label>
						<input
							type="time"
							name="startTime"
							value={formData.startTime}
							onChange={handleChange}
							required
							aria-label="Exam start time"
						/>
					</div>
					<div className="form-group">
						<label htmlFor="timeLimit">Time Limit (minutes):</label>
						<input
							type="number"
							name="timeLimit"
							value={formData.timeLimit}
							onChange={handleChange}
							required
							aria-label="Exam time limit"
						/>
					</div>
					<div className="flex items-center space-x-4">
						<button type="submit" className="bg-blue-500 text-white mx-5">
							Save Changes
						</button>
						<button
							type="button"
							onClick={onClose}
							className="bg-red-500 text-white"
						>
							Cancel
						</button>
					</div>
				</form>
			</div>
			<ToastContainer /> {/* Toast Container for notifications */}
		</div>
	);
};

export default EditExamModal;
