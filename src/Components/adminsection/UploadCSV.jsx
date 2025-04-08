import { useState, useEffect } from "react";
import {
  PlusCircleIcon,
  TrashIcon,
  DownloadIcon,
} from "@heroicons/react/outline"; // Import DownloadIcon
import "../../assets/css/UploadCSV.css";
import axios from "axios";
import toast from "react-hot-toast";

const UploadCSV = () => {
  const [csvFile, setCsvFile] = useState(null);
  const [students, setStudents] = useState([]); // State to hold fetched students
  const [usersPerPage, setUsersPerPage] = useState(10); // State for users per page
  const [currentPage, setCurrentPage] = useState(1); // State for current page
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  
  // State for update modal
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [currentStudent, setCurrentStudent] = useState(null);
  const [updatedData, setUpdatedData] = useState({
    rollNo: '',
    firstName: '',
    lastName: '',
    email: '',
    mobileNumber: '',
    batch: '',
    level: '',
    schoolId: '',
  });

  const fetchStudents = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/v1/admin/users/role/Student`,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );

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
    const headers = [
      "Roll No",
      "firstName",
      "lastName",
      "email",
      "mobileNumber",
      "level",
      "school",
      "schoolId",
      "BatchID",
    ];

    // Create CSV content
    const csvContent =
      headers.join(",") +
      "\n" +
      "123456,John,Doe,john.doe@example.com,9876543210,High School,Sample School,SCH001,BATCH001";

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
    if (!file.name.endsWith(".csv")) {
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
        toast.success(
          `Successfully registered ${response.data.successCount} students`
        );
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

  // Rename this function
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

  // State for student filtering
  const [studentFilterText, setStudentFilterText] = useState("");
  const [studentFilterColumn, setStudentFilterColumn] = useState("rollNo");

  const filteredUsers = studentFilterText
    ? currentUsers.filter((student) =>
        student[studentFilterColumn]
          ?.toLowerCase()
          .includes(studentFilterText.toLowerCase())
      )
    : currentUsers;

  // Add this new function near other handler functions
  const handleDeleteSingleUser = async (userId) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/v1/admin/users/delete/${userId}`,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );

      if (response.status === 200) {
        toast.success("User deleted successfully");
        fetchStudents(); // Refresh the student list
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user");
    }
  };

  const handleUpdateSingleUser = async (userId) => {
    console.log(updatedData)
    try {
     
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/v1/admin/users/${userId}/update`,
        updatedData,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );

      if (response.status === 200) {
        toast.success("User updated successfully");
        fetchStudents(); // Refresh the student list
        setShowUpdateModal(false); // Close the modal
      }
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Failed to update user");
    }
  };

  const openUpdateModal = (student) => {
    setCurrentStudent(student);
    setUpdatedData({
      rollNo: student.rollNo || '',
      firstName: student.firstName || '',
      lastName: student.lastName || '',
      email: student.email || '',
      mobileNumber: student.mobileNumber || '',
      batch: student.batch || '',
      level: student.level || '',
      schoolId: student.schoolId || '',
    });
    setShowUpdateModal(true);
  };

  return (
    <div className="upload-csv">
      <h1>Register Users</h1>
      
      <div className="actions-bar">
        <div className="upload-section">
          <button onClick={handleFileClick} className="custom-upload-btn">
            <PlusCircleIcon className="icon" /> Upload CSV
          </button>
          <button onClick={downloadCSVTemplate} className="download-template-btn">
            <DownloadIcon className="icon" /> Download Template
          </button>
          <input
            type="file"
            id="file-input"
            accept=".csv"
            onChange={handleFileUpload}
            style={{ display: 'none' }}  // Hide using inline style
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
        
        <button onClick={() => setShowConfirmDialog(true)} className="delete-all-btn">
          <TrashIcon className="icon" /> Delete All Users
        </button>
      </div>
      
      {/* Users per page selection */}

      {/* Students Section */}
      {currentUsers.length > 0 && (
        <div className="user-table">
      

          {/* Student Filter */}
          <div className="filter-container">
            <div className="filter-section">
              <select
                id="student-filter-column"
                value={studentFilterColumn}
                onChange={(e) => setStudentFilterColumn(e.target.value)}
                className="filter-select"
              >
                <option value="rollNo">Roll No</option>
                <option value="firstName">Name</option>
                <option value="email">Email</option>
                <option value="mobileNumber">Phone</option>
                <option value="schoolId">School</option>
                <option value="batch">BatchID</option>
              </select>
              <input
                type="text"
                placeholder={`Search ${studentFilterColumn}...`}
                value={studentFilterText}
                onChange={(e) => setStudentFilterText(e.target.value)}
                className="filter-input"
              />
            </div>
          </div>

          {/* Student Table */}
          <table>
            <thead>
              <tr>
                <th>Roll No</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>School</th>
                <th>Level</th>
                <th>BatchID</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((student, index) => (
                <tr key={index}>
                  <td>{student.rollNo || "N/A"}</td>
                  <td>
                    {student.firstName} {student.lastName}
                  </td>
                  <td>{student.email}</td>
                  <td>{student.mobileNumber || "N/A"}</td>
                  <td>{student.schoolId || "N/A"}</td>
                  <td>{student.level || "N/A"}</td>
                  <td>{student.batch || "N/A"}</td>
                  <td>
                    <button
                      onClick={() => handleDeleteSingleUser(student._id)}
                      className="delete-user-btn"
                    >
                      <TrashIcon className="icon" />
                    </button>
                    <button
                      onClick={() => openUpdateModal(student)}
                      className="update-user-btn"
                    >
                      Update
                    </button>
                  </td>
                </tr>
              ))}
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
            <p>
              Are you sure you want to delete all users? This action cannot be
              undone.
            </p>
            <div className="dialog-buttons">
              <button
                onClick={() => setShowConfirmDialog(false)}
                className="cancel-btn"
              >
                Cancel
              </button>
              <button onClick={handleDeleteAllUsers} className="confirm-btn">
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Update Modal */}
      {showUpdateModal && (
        <div className="update-modal">
          <div className="modal-content">
            <h3>Update User</h3>
            <input
              type="text"
              placeholder="Roll No"
              value={updatedData.rollNo}
              onChange={(e) => setUpdatedData({ ...updatedData, rollNo: e.target.value })}
            />
            <input
              type="text"
              placeholder="First Name"
              value={updatedData.firstName}
              onChange={(e) => setUpdatedData({ ...updatedData, firstName: e.target.value })}
            />
            <input
              type="text"
              placeholder="Last Name"
              value={updatedData.lastName}
              onChange={(e) => setUpdatedData({ ...updatedData, lastName: e.target.value })}
            />
            <input
              type="email"
              placeholder="Email"
              value={updatedData.email}
              onChange={(e) => setUpdatedData({ ...updatedData, email: e.target.value })}
            />
            <input
              type="text"
              placeholder="Mobile Number"
              value={updatedData.mobileNumber}
              onChange={(e) => setUpdatedData({ ...updatedData, mobileNumber: e.target.value })}
            />
            <input
              type="text"
              placeholder="Batch ID"
              value={updatedData.batch}
              onChange={(e) => setUpdatedData({ ...updatedData, batch: e.target.value })}
            />
            <input
              type="text"
              placeholder="Level"
              value={updatedData.level}
              onChange={(e) => setUpdatedData({ ...updatedData, level: e.target.value })}
            />
            <input
              type="text"
              placeholder="School ID"
              value={updatedData.schoolId}
              onChange={(e) => setUpdatedData({ ...updatedData, schoolId: e.target.value })}
            />
            <button className="save-btn" onClick={() => handleUpdateSingleUser(currentStudent._id)}>Save</button>
            <button className="cancel-btn" onClick={() => setShowUpdateModal(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadCSV;
