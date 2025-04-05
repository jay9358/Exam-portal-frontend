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
    batch: "",
    image: "",
    school: "",
    leading: [],
    State: "",  
    City: "",
    level: "",
  });
  const [users, setUsers] = useState([]);
  const [schools, setSchools] = useState([]);
  const [schoolOptions, setSchoolOptions] = useState([]);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(5);

  // Add new state for dropdown focus
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Add new state for cities
  const [citiesList, setCitiesList] = useState([]);

  // Add Indian states data
  const indianStates = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", 
    "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", 
    "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", 
    "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", 
    "Uttarakhand", "West Bengal"
  ];

  // Updated cities data object with comprehensive list
  const citiesByState = {
    "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Guntur", "Nellore", "Kurnool", "Kakinada", "Tirupati", "Rajahmundry", "Kadapa", "Anantapur"],
    "Arunachal Pradesh": ["Itanagar", "Naharlagun", "Pasighat", "Namsai", "Tezu", "Roing", "Ziro", "Bomdila", "Tawang", "Along"],
    "Assam": ["Guwahati", "Silchar", "Dibrugarh", "Jorhat", "Nagaon", "Tinsukia", "Tezpur", "Bongaigaon", "Diphu", "North Lakhimpur"],
    "Bihar": ["Patna", "Gaya", "Bhagalpur", "Muzaffarpur", "Purnia", "Darbhanga", "Bihar Sharif", "Arrah", "Begusarai", "Katihar"],
    "Chhattisgarh": ["Raipur", "Bhilai", "Bilaspur", "Korba", "Rajnandgaon", "Raigarh", "Durg", "Jagdalpur", "Ambikapur", "Dhamtari"],
    "Goa": ["Panaji", "Margao", "Vasco da Gama", "Mapusa", "Ponda", "Bicholim", "Curchorem", "Sanquelim", "Canacona", "Pernem"],
    "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar", "Jamnagar", "Gandhinagar", "Junagadh", "Anand", "Nadiad"],
    "Haryana": ["Faridabad", "Gurgaon", "Panipat", "Ambala", "Yamunanagar", "Rohtak", "Hisar", "Karnal", "Sonipat", "Panchkula"],
    "Himachal Pradesh": ["Shimla", "Mandi", "Solan", "Dharamshala", "Kullu", "Manali", "Hamirpur", "Una", "Bilaspur", "Chamba"],
    "Jharkhand": ["Ranchi", "Jamshedpur", "Dhanbad", "Bokaro", "Hazaribagh", "Deoghar", "Giridih", "Ramgarh", "Phusro", "Medininagar"],
    "Karnataka": ["Bangalore", "Mysore", "Hubli-Dharwad", "Mangalore", "Belgaum", "Gulbarga", "Davanagere", "Bellary", "Bijapur", "Shimoga"],
    "Kerala": ["Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur", "Kollam", "Palakkad", "Alappuzha", "Kannur", "Kottayam", "Malappuram"],
    "Madhya Pradesh": ["Bhopal", "Indore", "Jabalpur", "Gwalior", "Ujjain", "Sagar", "Dewas", "Satna", "Ratlam", "Rewa"],
    "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Thane", "Nashik", "Aurangabad", "Solapur", "Kolhapur", "Amravati", "Navi Mumbai"],
    "Manipur": ["Imphal", "Thoubal", "Kakching", "Ukhrul", "Chandel", "Bishnupur", "Churachandpur", "Senapati", "Tamenglong", "Jiribam"],
    "Meghalaya": ["Shillong", "Tura", "Nongstoin", "Jowai", "Baghmara", "Resubelpara", "Williamnagar", "Mairang", "Nongpoh", "Khliehriat"],
    "Mizoram": ["Aizawl", "Lunglei", "Saiha", "Champhai", "Kolasib", "Serchhip", "Lawngtlai", "Mamit", "Khawzawl", "Hnahthial"],
    "Nagaland": ["Kohima", "Dimapur", "Mokokchung", "Tuensang", "Wokha", "Mon", "Zunheboto", "Phek", "Kiphire", "Longleng"],
    "Odisha": ["Bhubaneswar", "Cuttack", "Rourkela", "Berhampur", "Sambalpur", "Puri", "Balasore", "Bhadrak", "Baripada", "Jharsuguda"],
    "Punjab": ["Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda", "Mohali", "Pathankot", "Hoshiarpur", "Batala", "Moga"],
    "Rajasthan": ["Jaipur", "Jodhpur", "Udaipur", "Kota", "Bikaner", "Ajmer", "Bhilwara", "Alwar", "Sikar", "Sri Ganganagar"],
    "Sikkim": ["Gangtok", "Namchi", "Gyalshing", "Mangan", "Rangpo", "Singtam", "Jorethang", "Nayabazar", "Ravangla", "Rongli"],
    "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Tirunelveli", "Tiruppur", "Vellore", "Erode", "Thoothukkudi"],
    "Telangana": ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar", "Khammam", "Ramagundam", "Secunderabad", "Mahbubnagar", "Nalgonda", "Adilabad"],
    "Tripura": ["Agartala", "Udaipur", "Dharmanagar", "Pratapgarh", "Belonia", "Kailasahar", "Ambassa", "Khowai", "Teliamura", "Mohanpur"],
    "Uttar Pradesh": ["Lucknow", "Kanpur", "Varanasi", "Agra", "Prayagraj", "Meerut", "Bareilly", "Aligarh", "Moradabad", "Saharanpur"],
    "Uttarakhand": ["Dehradun", "Haridwar", "Roorkee", "Haldwani", "Rudrapur", "Kashipur", "Rishikesh", "Pithoragarh", "Almora", "Nainital"],
    "West Bengal": ["Kolkata", "Howrah", "Durgapur", "Asansol", "Siliguri", "Bardhaman", "Malda", "Baharampur", "Krishnanagar", "Haldia"]
  };

  // Add this to your state declarations
  const [batches, setBatches] = useState([]);
  const [showCustomBatchInput, setShowCustomBatchInput] = useState(false);

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
      console.error("Error fetching users:", error.response.data.message);
      toast.error(error.response.data.message);
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

  // Fetch batches
  const fetchBatches = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/v1/admin/batches`,
        {
          headers: { Authorization: localStorage.getItem("token") },
        }
      );
      setBatches(response.data.batches);
    } catch (error) {
      console.error("Error fetching batches:", error);
      toast.error("Failed to fetch batches");
    }
  };

  // Fetch users when the accountType changes
  useEffect(() => {
    if (formData.accountType) {
      fetchUsersByRole(formData.accountType);
    }
    fetchAllSchools();
    fetchBatches();
  }, [formData.accountType]);

  // Update handleInputChange
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));

    if (name === "school") {
      fetchSchoolOptions(value);
      setIsDropdownOpen(true);
    }

    // Update cities list when state changes
    if (name === "State") {
      const cities = citiesByState[value] || [];
      setCitiesList(cities);
      // Clear the previously selected city when state changes
      setFormData(prevData => ({ ...prevData, City: "" }));
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
    const { firstName, lastName, accountType, school, email, mobileNumber, City, State, level, batch } = formData;

    // Check if all required fields are filled
    if (!firstName || !lastName || !accountType || !email || !mobileNumber) {
      toast.error("Please fill in all required fields: First Name, Last Name, Email, Mobile Number and Role");
      return;
    }

    // Add level and batch validation for students
    if (accountType === "Student") {
      if (!level) {
        toast.error("Please select a level for the student");
        return;
      }
      if (!batch) {
        toast.error("Please enter a batch ID for the student");
        return;
      }
    }

    if(accountType === "StateManager" || accountType === "CityManager"){
        if(!State){
            console.log("State is required");
            return;
        }
    }
    if(accountType === "CityManager"){
        if(!City){
            console.log("City is required");
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
                City,
                level: accountType === "Student" ? level : undefined, // Include level only for students
                batch: accountType === "Student" ? batch : undefined, // Include batch only for students
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
                City:"",
                school: "",
                leading: [],
                level: "",
                batch: "",
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
  const handleSchoolSelect = (schoolId) => {
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

  // Replace the State input field with dropdown
  const stateDropdown = (
    <div className="input-group">
      <select
        name="State"
        value={formData.State}
        onChange={handleInputChange}
        className="select-field"
        required
      >
        <option value="">Select State</option>
        {indianStates.map((state) => (
          <option key={state} value={state}>
            {state}
          </option>
        ))}
      </select>
    </div>
  );

  // Replace the City input field with dropdown
  const cityDropdown = (
    <div className="input-group">
      <select
        name="City"
        value={formData.City}
        onChange={handleInputChange}
        className="select-field"
        required
      >
        <option value="">Select City</option>
        {citiesList.map((city) => (
          <option key={city} value={city}>
            {city}
          </option>
        ))}
      </select>
    </div>
  );

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
            placeholder="Email "
            className="input-field"
          />
        </div>

        <div className="input-group">
          <input
            type="text"
            name="mobileNumber"
            value={formData.mobileNumber}
            onChange={handleInputChange}
            placeholder="Mobile Number"
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

        {(formData.accountType === "StateManager" || formData.accountType === "CityManager") && stateDropdown}
        {formData.accountType === "CityManager" && formData.State && cityDropdown}

        {formData.accountType === "Student" && (
          <>
            <div className="input-group">
              <select
                name="level"
                value={formData.level}
                onChange={handleInputChange}
                className="select-field"
                required
              >
                <option value="">Select Level</option>
                <option value="1">Level 1</option>
                <option value="2">Level 2</option>
                <option value="3">Level 3</option>
              </select>
            </div>

            <div className="input-group batch-input-container">
              <select
                name="batch"
                value={showCustomBatchInput ? "custom" : formData.batch}
                onChange={(e) => {
                  if (e.target.value === "custom") {
                    setShowCustomBatchInput(true);
                    setFormData(prev => ({ ...prev, batch: "" }));
                  } else {
                    setShowCustomBatchInput(false);
                    setFormData(prev => ({ ...prev, batch: e.target.value }));
                  }
                }}
                className="select-field"
                required
              >
                <option value="">Select Batch</option>
                {batches
                  .filter(batch => batch !== null && batch !== undefined)
                  .map((batch, index) => (
                    <option key={index} value={batch}>
                      {batch}
                    </option>
                ))}
                <option value="custom">+ Add New Batch</option>
              </select>

              {showCustomBatchInput && (
                <input
                  type="text"
                  name="batch"
                  value={formData.batch}
                  onChange={handleInputChange}
                  placeholder="Enter New Batch ID"
                  className="input-field"
                  required
                />
              )}
            </div>
          </>
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
                {formData.accountType === "Student" && (
                  <>
                    <th>Level</th>
                    <th>Batch</th>
                  </>
                )}
                <th>{formData.accountType === "StateManager" || formData.accountType === "CityManager" ? "State" : "School"}</th>
                {formData.accountType === "CityManager" && <th>City</th>}
              </tr>
            </thead>
            <tbody>
              {currentUsers.map((user, index) => (
                <tr key={index}>
                  <td>{user.firstName} {user.lastName}</td>
                  <td>
                    <span className="table-role">{user.accountType}</span>
                  </td>
                  <td>{user.email || '-'}</td>
                  {formData.accountType === "Student" && (
                    <>
                      <td>{user.level || '-'}</td>
                      <td>{user.batch || '-'}</td>
                    </>
                  )}
                  <td>{formData.accountType === "StateManager" || formData.accountType === "CityManager" ? user.State : user.school || '-'}</td>
                  {formData.accountType === "CityManager" && <td>{user.City}</td>}
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
