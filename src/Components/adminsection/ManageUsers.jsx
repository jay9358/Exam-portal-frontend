import { useState, useEffect } from "react";
import "../../assets/css/Manageuser.css";
import toast from "react-hot-toast";
import axios from "axios";

const ManageUsers = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobileNumber: "",
    accountType: "",
    image: "",
    school: "",
    leading: [],
    State: "",  
  });
  const [users, setUsers] = useState([]);
  const [schools, setSchools] = useState([]);
  const [schoolOptions, setSchoolOptions] = useState([]);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(5);

  // Add new state for dropdown focus
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Fetch users by accountType
  const fetchUsersByRole = async (role) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/v1/admin/users/role/${role}`,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      setUsers(response.data.users);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Error fetching users.");
    }
  };

  // Fetch all schools
  const fetchAllSchools = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/v1/admin/schools`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      setSchools(response.data.schools);
    } catch (error) {
      console.error("Error fetching schools:", error);
      toast.error("Error fetching schools.");
    }
  };

  // Fetch users when the accountType changes
  useEffect(() => {
    if (formData.accountType) {
      fetchUsersByRole(formData.accountType);
    }
    fetchAllSchools();
  }, [formData.accountType]);

  // Update handleInputChange
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));

    if (name === "school") {
      fetchSchoolOptions(value);
      setIsDropdownOpen(true);
    }
  };

  // Fetch school options based on input
  const fetchSchoolOptions = async (input) => {
    try {
      const filteredSchools = schools.filter((school) =>
        school.schoolId.toLowerCase().includes(input.toLowerCase())
      );
      setSchoolOptions(filteredSchools);
    } catch (error) {
      console.error("Error filtering schools:", error);
      toast.error("Error fetching school options.");
    }
  };

  // Handle adding a new user
  const handleAddUser = async () => {
    const { firstName, lastName, accountType, school, email, mobileNumber, leading, State } = formData;

    // Check if all required fields are filled
    if (!firstName || !lastName || !accountType ) {
        console.log("Please fill all the required fields");
        return;
    }
    if(accountType === "StateManager" || accountType === "CityManager"){
        if(!State){
            console.log("State is required");
            return;
        }
    }

    // Create the payload with the school ID and student information
    const payload = {
        schoolId: school, // School ID
        Users: [
            {
                firstName,
                lastName,
                email,
                mobileNumber,
                accountType,
                State,
                 // Include account type
                // Add any other fields required by your User model
            },
        ],
    };

    // Handle additional fields based on account type


    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/v1/auth/registerStudents`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: localStorage.getItem("token"),
            },
            body: JSON.stringify(payload), // Send JSON payload
        });

        const data = await response.json();
        if (response.ok) {
            setUsers([...users, ...data.users]); // Assuming the response contains the new users
            setFormData({
                firstName: "",
                lastName: "",
                email: "",
                mobileNumber: "",
                accountType: "",
                image: "",
                State: "",
                school: "",
                leading: [],
            });
            setSchoolOptions([]);
            toast.success("Users added successfully!");
        } else {
            toast.error(data.message || "Failed to add users.");
        }
    } catch (error) {
        console.error("Error adding users:", error);
        toast.error("Error adding users.");
    }
  };

  // Update handleSchoolSelect
  const handleSchoolSelect = (schoolId, schoolName) => {
    setFormData((prevData) => ({ ...prevData, school: schoolId }));
    setSchoolOptions([]);
    setIsDropdownOpen(false);
  };

  // Add click outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.input-group')) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  // Get current users for pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(users.length / usersPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Generate page numbers
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="manage-users">
      <div className="manage-users-header">
        <h1>Manage Users</h1>
        <h4>Add New User</h4>
      </div>

      <div className="form-section">
        <div className="input-group">
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            placeholder="First Name"
            className="input-field"
            required
          />
        </div>

        <div className="input-group">
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            placeholder="Last Name"
            className="input-field"
            required
          />
        </div>

        <div className="input-group">
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Email (optional)"
            className="input-field"
          />
        </div>

        <div className="input-group">
          <input
            type="text"
            name="mobileNumber"
            value={formData.mobileNumber}
            onChange={handleInputChange}
            placeholder="Mobile Number (optional)"
            className="input-field"
          />
        </div>

        <div className="input-group">
          <select
            name="accountType"
            value={formData.accountType}
            onChange={handleInputChange}
            className="select-field"
            required
          >
            <option value="">Select Role</option>
            <option value="Admin">Admin</option>
            <option value="Student">Student</option>
            <option value="StateManager">State Manager</option>
            <option value="CityManager">City Manager</option>
            <option value="Worker">Worker</option>
            <option value="None">None</option>
          </select>
        </div>

        {(formData.accountType === "Student" || formData.accountType === "Worker") && (
          <div className={`input-group ${isDropdownOpen ? 'with-dropdown' : ''}`}>
            <input
              type="text"
              name="school"
              value={formData.school}
              onChange={handleInputChange}
              onFocus={() => {
                if (formData.school) {
                  fetchSchoolOptions(formData.school);
                }
                setIsDropdownOpen(true);
              }}
              placeholder="Search School ID..."
              className="input-field"
              autoComplete="off"
            />
            {schoolOptions.length > 0 && isDropdownOpen && (
              <ul className="school-dropdown">
                {schoolOptions.map((school) => (
                  <li
                    key={school._id}
                    onClick={() => handleSchoolSelect(school.schoolId)}
                    title={`School ID: ${school.schoolId}`}
                  >
                    <span>{school.schoolId}</span>
                    <span style={{ color: '#64748b', marginLeft: 'auto' }}>
                      {school.name}
                    </span>
                  </li>
                ))}
                {schoolOptions.length === 0 && (
                  <li className="no-results">No schools found</li>
                )}
              </ul>
            )}
          </div>
        )}

        {(formData.accountType === "StateManager" || formData.accountType === "CityManager") && (
          <div className="input-group">
            <input
              type="text"
              name="State"
              value={formData.State}
              onChange={handleInputChange}
              placeholder="State"
              className="input-field"
            />
          </div>
        )}

        <div className="input-group">
          <input
            type="text"
            name="image"
            value={formData.image}
            onChange={handleInputChange}
            placeholder="Image URL (optional)"
            className="input-field"
          />
        </div>
      </div>

      <button onClick={handleAddUser} className="add-button">
        Add User
      </button>

      {users.length > 0 ? (
        <div className="users-table-container">
          <h4>Existing Users</h4>
          <table className="users-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Role</th>
                <th>Email</th>
                <th>{formData.accountType === "StateManager" || formData.accountType === "CityManager" ? "State" : "School"}</th>
                <th>Leading</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map((user, index) => (
                <tr key={index}>
                  <td>{user.firstName} {user.lastName}</td>
                  <td>
                    <span className="table-role">{user.role}</span>
                  </td>
                  <td>{user.email || '-'}</td>
                  <td>{formData.accountType === "StateManager" ? user.State : user.school || '-'}</td>
                  <td>{user.leading?.length > 0 ? user.leading.join(", ") : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pagination">
            <button
              className="pagination-button"
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            
            {pageNumbers.map(number => (
              <button
                key={number}
                className={`pagination-button ${currentPage === number ? 'active' : ''}`}
                onClick={() => paginate(number)}
              >
                {number}
              </button>
            ))}
            
            <button
              className="pagination-button"
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      ) : formData.accountType ? (
        <div className="no-data-container">
          <div className="no-data-content">
            <svg className="no-data-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
              <polyline points="13 2 13 9 20 9"></polyline>
            </svg>
            <h3>No Users Found</h3>
            <p>There are no users registered with the selected role.</p>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default ManageUsers;
