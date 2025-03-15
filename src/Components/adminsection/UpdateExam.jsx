import { useState, useEffect } from "react";
import "../../assets/css/ManageExam.css";
import axios from "axios";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

const UpdateExam = () => {
  const { examId } = useParams();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    timeLimit: "",
    questionSets: [],
  });
  const [loading, setLoading] = useState(true);

  // Fetch exam data when component mounts
  useEffect(() => {
    const fetchExamData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/admin/exams/${examId}`
        );
        const exam = response.data.exam;

        setFormData({
          title: exam.title,
          description: exam.description,
          timeLimit: exam.timeLimit,
          questionSets: exam.questionSets,
        });
        setLoading(false);
        toast.success("Exam data fetched successfully!");
      } catch (error) {
        console.error("Error fetching exam data:", error.response?.data || error.message);
        toast.error("Failed to fetch exam data.");
        setLoading(false);
      }
    };
    fetchExamData();
  }, [examId]);

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: name === "questionSets" ? value.split(",").map((id) => id.trim()) : value,
    }));
  };

  // Update exam data
  const handleUpdateExam = async () => {
    const { title, description, timeLimit, questionSets } = formData;

    if (!title || !description || !timeLimit) {
      toast.warn("Please fill all required fields!");
      return;
    }

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/admin/exams/${examId}`,
        { title, description, timeLimit, questionSets }
      );

      toast.success("Exam updated successfully!");
      console.log("Exam updated successfully:", response.data);
    } catch (error) {
      console.error("Error updating exam:", error.response?.data || error.message);
      toast.error("Failed to update exam.");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="manage-exam">
      <h1>Manage Exam</h1>
      <h2>Update Exam</h2>

      <div className="form-group">
        <label htmlFor="title">Exam Title</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          placeholder="Exam Title"
          onChange={handleInputChange}
          className="form-control"
        />
      </div>

      <div className="form-group">
        <label htmlFor="description">Exam Description</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          placeholder="Exam Description"
          onChange={handleInputChange}
          className="form-control"
        />
      </div>

      <div className="form-group">
        <label htmlFor="timeLimit">Time Limit (minutes)</label>
        <input
          type="number"
          id="timeLimit"
          name="timeLimit"
          value={formData.timeLimit}
          placeholder="Time Limit"
          onChange={handleInputChange}
          className="form-control"
        />
      </div>

      <div className="form-group">
        <label htmlFor="questionSets">Question Set IDs (comma-separated)</label>
        <input
          type="text"
          id="questionSets"
          name="questionSets"
          value={formData.questionSets.join(",")}
          placeholder="Question Set IDs"
          onChange={handleInputChange}
          className="form-control"
        />
      </div>

      <div className="save-button-container">
        <button onClick={handleUpdateExam} className="save-button btn btn-primary">
          Update Exam
        </button>
      </div>
    </div>
  );
};

export default UpdateExam;
