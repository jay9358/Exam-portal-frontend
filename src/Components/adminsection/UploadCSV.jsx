import { useState, useEffect } from "react";
import { PlusCircleIcon, TrashIcon, DownloadIcon } from "@heroicons/react/outline"; // Import DownloadIcon
import "../../assets/css/UploadCSV.css";
import axios from "axios";
import toast from "react-hot-toast";

const UploadCSV = () => {
  const [csvFile, setCsvFile] = useState(null);
  const [students, setStudents] = useState([]); // State to hold fetched students
  const [usersPerPage, setUsersPerPage] = useState(10); // State for users per page
  const [currentPage, setCurrentPage] = useState(1); // State for current page
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const fetchStudents = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/v1/admin/users/role/Student`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      
      // Log the response to check its structure
      console.log("Fetched Students:", response.data);

      // Ensure the response structure matches what you're trying to access
      if (response.data && response.data.users) {
        setStudents(response.data.users); // Adjust this if the structure is different
      } else {
        toast.error("No students found.");
      }
    } catch (error) {
      console.error("Error fetching students:", error);
      toast.error("Error fetching students.");
    }
  };

  // Fetch students with role "Student" on component mount
  useEffect(() => {
    
    fetchStudents();
  }, []); // Empty dependency array to run only on mount

  // Trigger file input when custom upload button is clicked
  const handleFileClick = () => {
    document.getElementById("file-input").click();
  };

  // Download CSV template function
  const downloadCSVTemplate = () => {
    // Define headers for CSV
    const headers = ["Roll No", "firstName", "lastName", "email", "level", "school", "schoolId"];
    
    // Create CSV content
    const csvContent = headers.join(",") + "\n" + 
                       "123456,John,Doe,john.doe@example.com,High School,Sample School,SCH001";
    
    // Create a blob with the CSV content
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    
    // Create a link element
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    
    // Set link properties
    link.setAttribute("href", url);
    link.setAttribute("download", "students_template.csv");
    
    // Append to body and trigger click
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    document.body.removeChild(link);
    toast.success("CSV template downloaded");
  };

  const uploadStudents = async (file) => {
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
        `${import.meta.env.VITE_API_URL}/v1/admin/registerStudents`,
        formData,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
            "Content-Type": "multipart/form-data",
          },
        }
      );
      
      // Show detailed success message
      if (response.data.successCount > 0) {
        toast.success(`Successfully registered ${response.data.successCount} students`);
        fetchStudents(); // Fetch updated student list after upload
      }
      
      // Show errors if any
      if (response.data.errorCount > 0) {
        toast.error(`Failed to register ${response.data.errorCount} students`);
        console.error("Registration errors:", response.data.errors);
        
        // Show first error in toast
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
    uploadStudents(file);
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

  // Calculate the current users to display
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = students.slice(indexOfFirstUser, indexOfLastUser);

  // Calculate total pages
  const totalPages = Math.ceil(students.length / usersPerPage);

  // Handle delete all users
  const handleDeleteAllUsers = async () => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/v1/admin/users/deleteAll`,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      
      if (response.status === 200) {
        toast.success("All users deleted successfully");
        setStudents([]); // Clear the local state
        setShowConfirmDialog(false);
      }
    } catch (error) {
      console.error("Error deleting users:", error);
      toast.error("Failed to delete users");
      setShowConfirmDialog(false);
    }
  };

  return (
    <div className="upload-csv">
      <h1>Register Users</h1>

      {/* Upload and Download Section */}
      <div className="upload-section">
        <button onClick={handleFileClick} className="custom-upload-btn">
          <PlusCircleIcon className="icon" /> Upload CSV
        </button>
        
        {/* Download CSV Template Button */}
        <button onClick={downloadCSVTemplate} className="download-template-btn">
          <DownloadIcon className="icon" /> Download CSV Template
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


      {/* Delete All Users Button */}
      <div className="delete-all-section">
        <button 
          onClick={() => setShowConfirmDialog(true)}
          className="delete-all-btn"
        >
          <TrashIcon className="icon" /> Delete All Users
        </button>
      </div>

      {/* User Data Table for Students */}
      {currentUsers.length > 0 && (
        <div className="user-table">
          <h2>Registered Students</h2>
          <table>
            <thead>
              <tr>
                <th>Roll No</th>
                <th>Name</th>
                <th>Email</th>
                <th>School</th>
                <th>Level</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map((student, index) => (
                <tr key={index}>
                  <td>{student.rollNo || "N/A"}</td>
                  <td>{student.firstName}</td>
                  <td>{student.email}</td>
                  <td>{student.schoolId || "N/A"}</td>
                  <td>{student.level || "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="users-per-page">
        <label htmlFor="users-per-page">Users per page:</label>
        <select id="users-per-page" value={usersPerPage} onChange={handleUsersPerPageChange}>
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
      </div>
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

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="confirmation-dialog">
          <div className="dialog-content">
            <h3>Delete All Users</h3>
            <p>Are you sure you want to delete all users? This action cannot be undone.</p>
            <div className="dialog-buttons">
              <button onClick={() => setShowConfirmDialog(false)} className="cancel-btn">
                Cancel
              </button>
              <button onClick={handleDeleteAllUsers} className="confirm-btn">
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadCSV;
