import { useState, useEffect } from "react";
import { PlusCircleIcon, TrashIcon } from "@heroicons/react/outline";
import "../../assets/css/UploadCSV.css";
import axios from "axios";
import toast from "react-hot-toast";

const UploadCSVSchool = () => {
  const [csvFile, setCsvFile] = useState(null);
  const [schools, setSchools] = useState([]); // State to hold fetched schools
  const [usersPerPage, setUsersPerPage] = useState(10); // State for users per page
  const [currentPage, setCurrentPage] = useState(1); // State for current page
  const fetchSchools = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/v1/admin/schools`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });

      console.log("Fetched Schools:", response.data);

      if (response.data && response.data.schools) {
        setSchools(response.data.schools);
      } else {
        toast.error("No schools found.");
      }
    } catch (error) {
      console.error("Error fetching schools:", error);
      toast.error("Error fetching schools.");
    }
  };

  // Fetch schools on component mount
  useEffect(() => {
    
    fetchSchools();
  }, []);

  // Trigger file input when custom upload button is clicked
  const handleFileClick = () => {
    document.getElementById("file-input").click();
  };

  const uploadSchools = async (file) => {
    if (!file) {
      toast.error("No file selected for upload.");
      return;
    }

    // Validate file type
    if (!file.name.endsWith('.csv')) {
      toast.error("Please upload a CSV file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/v1/admin/registerSchools`,
        formData,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.successCount > 0) {
        toast.success(`Successfully registered ${response.data.successCount} schools`);
        fetchSchools(); // Fetch updated school list after upload
      }

      if (response.data.errorCount > 0) {
        toast.error(`Failed to register ${response.data.errorCount} schools`);
        console.error("Registration errors:", response.data.errors);
        if (response.data.errors && response.data.errors.length > 0) {
          toast.error(`Error example: ${response.data.errors[0].error}`);
        }
      }
    } catch (error) {
      console.error("Upload error:", error);
      const errorMessage = error.response?.data?.message || error.message;
      toast.error(`Error: ${errorMessage}`);
    }
  };

  // Handle CSV file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    setCsvFile(file);
    uploadSchools(file);
  };

  // Handle CSV file deletion
  const deleteFile = () => {
    setCsvFile(null);
  };

  // Handle change in users per page
  const handleUsersPerPageChange = (e) => {
    setUsersPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when changing users per page
  };

  // Calculate the current schools to display
  const indexOfLastSchool = currentPage * usersPerPage;
  const indexOfFirstSchool = indexOfLastSchool - usersPerPage;
  const currentSchools = schools.slice(indexOfFirstSchool, indexOfLastSchool);

  // Calculate total pages
  const totalPages = Math.ceil(schools.length / usersPerPage);

  return (
    <div className="upload-csv">
      <h1>Register Schools</h1>

      {/* Custom Upload Button */}
      <div className="upload-section">
        <button onClick={handleFileClick} className="custom-upload-btn">
          <PlusCircleIcon className="icon" /> Upload CSV
        </button>

        {/* Hidden file input */}
        <input
          type="file"
          id="file-input"
          accept=".csv"
          onChange={handleFileUpload}
          className="upload-input"
        />

        {csvFile && (
          <div className="file-info">
            <span>{csvFile.name}</span>
            <button onClick={deleteFile} className="delete-button">
              <TrashIcon className="icon" />
            </button>
          </div>
        )}
      </div>

      {/* Users per page selection */}
      <div className="users-per-page">
        <label htmlFor="users-per-page">Users per page:</label>
        <select id="users-per-page" value={usersPerPage} onChange={handleUsersPerPageChange}>
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
      </div>

      {/* User Data Table for Schools */}
      {currentSchools.length > 0 && (
        <div className="user-table">
          <h2>Registered Schools</h2>
          <table>
            <thead>
              <tr>
                <th>School ID</th>
                <th>School Name</th>
                <th>City</th>
                <th>State</th>
              </tr>
            </thead>
            <tbody>
              {currentSchools.map((school, index) => (
                <tr key={index}>
                  <td>{school.schoolId || "N/A"}</td>
                  <td>{school.name || "N/A"}</td>
                  <td>{school.city || "N/A"}</td>
                  <td>{school.state || "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

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
  );
};

export default UploadCSVSchool;