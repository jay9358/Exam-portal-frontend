import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import "../../assets/css/PerformanceReports.css";
import { Search } from "lucide-react";
import certificateTemplate from "../../assets/certificate.jpg";

const PerformanceReports = () => {
  // List of Indian states
  const indianStates = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
  ];

  // Cities object with major cities for each state
  const citiesByState = {
    "Andhra Pradesh": [
      "Visakhapatnam",
      "Vijayawada",
      "Guntur",
      "Nellore",
      "Kurnool",
      "Kakinada",
      "Tirupati",
      "Rajahmundry",
      "Kadapa",
    ],
    "Arunachal Pradesh": [
      "Itanagar",
      "Naharlagun",
      "Pasighat",
      "Namsai",
      "Roing",
      "Tezu",
      "Tawang",
      "Ziro",
      "Bomdila",
    ],
    Assam: [
      "Guwahati",
      "Silchar",
      "Dibrugarh",
      "Jorhat",
      "Nagaon",
      "Tinsukia",
      "Tezpur",
      "Bongaigaon",
      "Karimganj",
    ],
    Bihar: [
      "Patna",
      "Gaya",
      "Bhagalpur",
      "Muzaffarpur",
      "Purnia",
      "Darbhanga",
      "Arrah",
      "Bihar Sharif",
      "Begusarai",
    ],
    Chhattisgarh: [
      "Raipur",
      "Bhilai",
      "Bilaspur",
      "Korba",
      "Durg",
      "Rajnandgaon",
      "Raigarh",
      "Jagdalpur",
      "Ambikapur",
    ],
    Goa: [
      "Panaji",
      "Margao",
      "Vasco da Gama",
      "Mapusa",
      "Ponda",
      "Bicholim",
      "Curchorem",
      "Cuncolim",
      "Canacona",
    ],
    Gujarat: [
      "Ahmedabad",
      "Surat",
      "Vadodara",
      "Rajkot",
      "Bhavnagar",
      "Jamnagar",
      "Gandhinagar",
      "Junagadh",
      "Anand",
    ],
    Haryana: [
      "Faridabad",
      "Gurgaon",
      "Panipat",
      "Ambala",
      "Yamunanagar",
      "Rohtak",
      "Hisar",
      "Karnal",
      "Sonipat",
    ],
    "Himachal Pradesh": [
      "Shimla",
      "Mandi",
      "Dharamshala",
      "Solan",
      "Kullu",
      "Manali",
      "Hamirpur",
      "Una",
      "Bilaspur",
    ],
    Jharkhand: [
      "Ranchi",
      "Jamshedpur",
      "Dhanbad",
      "Bokaro",
      "Hazaribagh",
      "Deoghar",
      "Giridih",
      "Ramgarh",
      "Phusro",
    ],
    Karnataka: [
      "Bangalore",
      "Mysore",
      "Hubli-Dharwad",
      "Mangalore",
      "Belgaum",
      "Gulbarga",
      "Davanagere",
      "Bellary",
      "Bijapur",
    ],
    Kerala: [
      "Thiruvananthapuram",
      "Kochi",
      "Kozhikode",
      "Thrissur",
      "Kollam",
      "Palakkad",
      "Alappuzha",
      "Kannur",
      "Kottayam",
    ],
    "Madhya Pradesh": [
      "Bhopal",
      "Indore",
      "Jabalpur",
      "Gwalior",
      "Ujjain",
      "Sagar",
      "Dewas",
      "Satna",
      "Ratlam",
    ],
    Maharashtra: [
      "Mumbai",
      "Pune",
      "Nagpur",
      "Thane",
      "Nashik",
      "Aurangabad",
      "Solapur",
      "Kolhapur",
      "Amravati",
    ],
    Manipur: [
      "Imphal",
      "Thoubal",
      "Bishnupur",
      "Churachandpur",
      "Kakching",
      "Ukhrul",
      "Chandel",
      "Senapati",
      "Tamenglong",
    ],
    Meghalaya: [
      "Shillong",
      "Tura",
      "Jowai",
      "Nongstoin",
      "Williamnagar",
      "Baghmara",
      "Resubelpara",
      "Ampati",
      "Khliehriat",
    ],
    Mizoram: [
      "Aizawl",
      "Lunglei",
      "Saiha",
      "Champhai",
      "Kolasib",
      "Serchhip",
      "Lawngtlai",
      "Mamit",
      "Khawzawl",
    ],
    Nagaland: [
      "Kohima",
      "Dimapur",
      "Mokokchung",
      "Tuensang",
      "Wokha",
      "Zunheboto",
      "Mon",
      "Phek",
      "Kiphire",
    ],
    Odisha: [
      "Bhubaneswar",
      "Cuttack",
      "Rourkela",
      "Berhampur",
      "Sambalpur",
      "Puri",
      "Balasore",
      "Bhadrak",
      "Baripada",
    ],
    Punjab: [
      "Ludhiana",
      "Amritsar",
      "Jalandhar",
      "Patiala",
      "Bathinda",
      "Mohali",
      "Pathankot",
      "Hoshiarpur",
      "Batala",
    ],
    Rajasthan: [
      "Jaipur",
      "Jodhpur",
      "Udaipur",
      "Kota",
      "Bikaner",
      "Ajmer",
      "Bhilwara",
      "Alwar",
      "Sikar",
    ],
    Sikkim: [
      "Gangtok",
      "Namchi",
      "Gyalshing",
      "Mangan",
      "Rangpo",
      "Singtam",
      "Jorethang",
      "Nayabazar",
      "Ravangla",
    ],
    "Tamil Nadu": [
      "Chennai",
      "Coimbatore",
      "Madurai",
      "Tiruchirappalli",
      "Salem",
      "Tirunelveli",
      "Tiruppur",
      "Vellore",
      "Erode",
    ],
    Telangana: [
      "Hyderabad",
      "Warangal",
      "Nizamabad",
      "Karimnagar",
      "Khammam",
      "Ramagundam",
      "Secunderabad",
      "Nalgonda",
      "Suryapet",
    ],
    Tripura: [
      "Agartala",
      "Udaipur",
      "Dharmanagar",
      "Pratapgarh",
      "Belonia",
      "Kailasahar",
      "Khowai",
      "Teliamura",
      "Melaghar",
    ],
    "Uttar Pradesh": [
      "Lucknow",
      "Kanpur",
      "Varanasi",
      "Agra",
      "Meerut",
      "Allahabad",
      "Ghaziabad",
      "Noida",
      "Gorakhpur",
    ],
    Uttarakhand: [
      "Dehradun",
      "Haridwar",
      "Roorkee",
      "Haldwani",
      "Rudrapur",
      "Kashipur",
      "Rishikesh",
      "Kathgodam",
      "Pithoragarh",
    ],
    "West Bengal": [
      "Kolkata",
      "Howrah",
      "Durgapur",
      "Asansol",
      "Siliguri",
      "Bardhaman",
      "Malda",
      "Baharampur",
      "Krishnanagar",
    ],
  };

  const [schools, setSchools] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedSchool, setSelectedSchool] = useState("");
  const [showReport, setShowReport] = useState(false);
  const [filteredSchools, setFilteredSchools] = useState([]);
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [user, setUser] = useState(null);
  const [result, setResult] = useState(null);
  const [studentSearch, setStudentSearch] = useState("");
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState("");
  const [batch, setBatch] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState("");
  const [generatingCertificate, setGeneratingCertificate] = useState(false);
  
  // Fetch schools from API
  const fetchAllSchools = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/v1/admin/schools`,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      setSchools(response.data.schools);
    } catch (error) {
      console.error("Error fetching schools:", error);
      toast.error("Error fetching schools.");
    }
    console.log(exams);
  };

  useEffect(() => {
    fetchAllSchools();
    fetchBatch();
    }, []);

  useEffect(() => {
    if (selectedState && selectedCity && schools.length > 0) {
      console.log("Filtering schools with:", { selectedState, selectedCity });
      console.log("Available schools:", schools);

      const filtered = schools.filter((school) => {
        const stateMatch =
          school.state?.toLowerCase() === selectedState.toLowerCase();
        console.log("State match:", stateMatch);
        console.log("School state:", school.state);
        const cityMatch =
          school.city?.toLowerCase() === selectedCity.toLowerCase();
        console.log("City match:", cityMatch);
        return stateMatch && cityMatch;
      });

      console.log("Filtered schools:", filtered);
      setFilteredSchools(filtered);
    } else {
      setFilteredSchools([]);
    }
  }, [selectedState, selectedCity, schools]);
  const handleStateChange = (e) => {
    setSelectedState(e.target.value);
    setSelectedCity(""); // Reset city when state changes
    setSelectedSchool(""); // Reset school when state changes
  };

  const handleCityChange = (e) => {
    setSelectedCity(e.target.value);
    setSelectedSchool(""); // Reset school when city changes
  };

  const handleSchoolChange = (e) => {
    setSelectedSchool(e.target.value);
  };

  const handleExamChange = (e) => {
    setSelectedExam(e.target.value);
  };

  const calculateStatistics = (results) => {
    
    if (!results || results.length === 0) return null;
    
    const totalStudents = results.length;
    const passedStudents = results.filter(
      (result) => result.status === "Pass"
    ).length;
    const totalScore = results.reduce((sum, result) => sum + result.score, 0);
    const averageScore = (totalScore / totalStudents).toFixed(2);

    return {
      totalStudents,
      passedStudents,
      failedStudents: totalStudents - passedStudents,
      averageScore,
      passPercentage: ((passedStudents / totalStudents) * 100).toFixed(2),
    };
  };
  const token = localStorage.getItem("token");
  const handleFetchExams = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/v1/admin/exams`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setExams(response.data.exams);
      setLoading(false);
    } catch (error) {
      console.error(
        "Error fetching exams:",
        error.response?.data || error.message
      );
      setLoading(false);
    }
  };

  useEffect(() => {
    handleFetchExams();
  }, []);

  const handleStudentSearch = (searchValue) => {
    setStudentSearch(searchValue);
    
    if (!reportData || !reportData.users || !reportData.results) return;
    
    const searchTerm = searchValue.toLowerCase().trim();

    // Create a map of results by student ID
    const resultsByStudentId = reportData.results.reduce((acc, result) => {
      acc[result.student] = result;  // Use the entire result object
      return acc;
    }, {});

    // Search and map students with their results
    const matchingStudents = reportData.users
      .filter((student) =>
        (student.rollNo || '').toLowerCase().includes(searchTerm) ||
        (student.firstName || '').toLowerCase().includes(searchTerm) ||
        (student.lastName || '').toLowerCase().includes(searchTerm) ||
        `${student.firstName || ''} ${student.lastName || ''}`
          .toLowerCase()
          .includes(searchTerm)
      )
      .map(user => {
        const examResult = resultsByStudentId[user._id];
        return {
          ...user,
          examResult: examResult || null
        };
      });

    console.log("Matching students with results:", matchingStudents);
    setFilteredStudents(matchingStudents);
  };

  const handleGenerateReport = async (e) => {
    e.preventDefault();
    if (!selectedState || !selectedCity || !selectedSchool || !selectedExam) {
      toast.error("Please select all fields");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/v1/admin/reports/performance`,
        {
          params: {
            state: selectedState,
            city: selectedCity,
            schoolId: selectedSchool,
            examId: selectedExam,
          },
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      
      console.log("API Response:", response.data.data);

      // Create a map of results by student ID
      const resultsByStudentId = {};
      response.data.data.results.forEach(result => {
        resultsByStudentId[result.student] = result;
      });

      // Map users with their exam results
      const initialFilteredStudents = response.data.data.users.map(user => ({
        ...user,
        examResult: resultsByStudentId[user._id] || null
      }));

      setReportData(response.data.data);
      setUser(response.data.data.users);
      setResult(response.data.data.results);
      setFilteredStudents(initialFilteredStudents);
      console.log("Filtered Students:", initialFilteredStudents);
      setShowReport(true);
    } catch (error) {
      console.error("Error generating report:", error);
      toast.error("Error generating report.");
    } finally {
      setLoading(false);
    }
  };

  const generateCertificate = (student) => {
    return async () => {
      setGeneratingCertificate(true);
      try {
        // Get the certificate template image
        const certificateImg = new Image();
        certificateImg.src = certificateTemplate;
        certificateImg.crossOrigin = "anonymous";

        // Create canvas
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // Wait for image to load
        await new Promise((resolve, reject) => {
          certificateImg.onload = () => {
            canvas.width = certificateImg.width;
            canvas.height = certificateImg.height;
            
            // Draw certificate template
            ctx.drawImage(certificateImg, 0, 0);

            // Configure text style for student name
            ctx.font = 'bold 36px "Times New Roman"';
            ctx.fillStyle = '#FFFFFF';
            ctx.textAlign = 'center';

            // Add student name - positioned above "This is to certify that"
            const studentName = `${student.firstName} ${student.lastName}`;
            ctx.fillText(studentName, canvas.width/2, canvas.height/2 + 110);

            resolve();
          };
          certificateImg.onerror = (e) => {
            console.error('Error loading image:', e);
            reject(new Error('Failed to load certificate template'));
          };
        });

        // Convert to PNG and download
        const dataUrl = canvas.toDataURL('image/png', 1.0);
        const link = document.createElement('a');
        link.download = `${student.firstName}_${student.lastName}_certificate.png`;
        link.href = dataUrl;
        link.click();

      } catch (error) {
        console.error('Error generating certificate:', error);
        toast.error('Failed to generate certificate: ' + error.message);
      } finally {
        setGeneratingCertificate(false);
      }
    };
  };

  const fetchBatch = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/v1/admin/batches`,
        {
          headers: { Authorization: localStorage.getItem("token") },
        }
      );
      // Assuming the response structure is { batches: [...] }
      console.log(response.data.batches);
      setBatch(response.data.batches);
    } catch (error) {
      console.error(
        "Error fetching batches:",
        error.response?.data || error.message
      );
      toast.error("Failed to fetch batches");
    }
  };

  const [usersPerPage, setUsersPerPage] = useState(10); // Default 10 students per page
  const [currentPage, setCurrentPage] = useState(1); // Default to first page

  // Calculate indexes for pagination
  const indexOfLastStudent = currentPage * usersPerPage;
  const indexOfFirstStudent = indexOfLastStudent - usersPerPage;
  const currentStudents = filteredStudents.slice(
    indexOfFirstStudent,
    indexOfLastStudent
  );

  // Total number of pages
  const totalPages = Math.ceil(filteredStudents.length / usersPerPage);

  // Handle users per page change
  const handleUsersPerPageChange = (e) => {
    setUsersPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when changing users per page
  };

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="performance-reports">
      <div className="report-header">
        <h2>Performance Reports</h2>
        <p>Generate performance reports by location and school</p>
      </div>

      <form className="report-form" onSubmit={handleGenerateReport}>
        <div className="form-group">
          <label htmlFor="state">State</label>
          <select
            id="state"
            value={selectedState}
            onChange={handleStateChange}
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

        <div className="form-group">
          <label htmlFor="city">City</label>
          <select
            id="city"
            value={selectedCity}
            onChange={handleCityChange}
            disabled={!selectedState}
            required
          >
            <option value="">Select City</option>
            {selectedState &&
              citiesByState[selectedState]?.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="school">School ID</label>
          <select
            id="school"
            value={selectedSchool}
            onChange={handleSchoolChange}
            disabled={!selectedCity || filteredSchools.length === 0}
            required
          >
            <option value="">Select School</option>
            {filteredSchools.length > 0 ? (
              filteredSchools.map((school) => (
                <option key={school._id} value={school.schoolId}>
                  {school.schoolId} - {school.name || "Unknown School Name"}
                </option>
              ))
            ) : (
              <option value="" disabled>
                {selectedCity
                  ? "No schools found in this city"
                  : "Select a city first"}
              </option>
            )}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="school">Batch </label>

          <select
            type="text"
            value={selectedBatch}
            onChange={(e) => setSelectedBatch(e.target.value)}
            required
            disabled={!selectedSchool}
          >
            <option value="" disabled>
              Select Batch
            </option>
            {batch
              .filter(
                (batchItem) => batchItem !== null && batchItem !== undefined
              )
              .map((batchItem, index) => (
                <option key={index} value={batchItem}>
                  {batchItem}
                </option>
              ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="exam">Exam</label>
          <select
            id="exam"
            value={selectedExam}
            onChange={handleExamChange}
            disabled={!selectedBatch}
            required
          >
            <option value="">Select Exam</option>
            {exams.length > 0 ? (
              exams.map((exam) => (
                <option key={exam._id} value={exam._id}>
                  {exam.title || "Untitled Exam"} -{" "}
                  {new Date(exam.date).toLocaleDateString()}
                </option>
              ))
            ) : (
              <option value="" disabled>
                No exams available
              </option>
            )}
          </select>
        </div>

        <button type="submit" className="generate-btn">
          {loading ? "Generating..." : "Generate Report"}
        </button>
      </form>

      {showReport && (
        <div className="report-result">
          {loading ? (
            <div className="loading">
              <p>Generating report...</p>
            </div>
          ) : reportData && reportData.results ? (
            <div className="report-data">
              <h3>Performance Report</h3>

              <div className="statistics-table">
                <h4>Overall Statistics</h4>
                <table>
                  <thead>
                    <tr>
                      <th>Total Students</th>
                      <th>Passed Students</th>
                      <th>Failed Students</th>
                      <th>Average Score</th>
                      <th>Pass Percentage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(() => {
                      const stats = calculateStatistics(reportData.results);
                      return (
                        stats && (
                          <tr>
                            <td>{stats.totalStudents}</td>
                            <td>{stats.passedStudents}</td>
                            <td>{stats.failedStudents}</td>
                            <td>{stats.averageScore}</td>
                            <td>{stats.passPercentage}%</td>
                          </tr>
                        )
                      );
                    })()}
                  </tbody>
                </table>
              </div>

              <div className="student-search">
                <div className="search-form d-flex justify-content-end align-items-center">
                  <div
                    className="input-group input-group-sm"
                    style={{ maxWidth: "350px" }}
                  >
                    <input
                      type="text"
                      className="form-control mx-2"
                      value={studentSearch}
                      onChange={(e) => handleStudentSearch(e.target.value)}
                      placeholder="Search Student Id or Name"
                    />

                    <Search />
                  </div>
                </div>

                <>
                  {filteredStudents.length > 0 ? (
                    <div className="search-results">
                      <table className="student-result">
                        <thead>
                          <tr>
                            <th>Roll No</th>
                            <th>Name</th>
                            <th>Marks</th>
                            <th>Status</th>
                            <th>Generated Certificate</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentStudents
                            .filter(student => student.examResult !== null)
                            .map((student, index) => {
                              console.log("Rendering student with exam result:", student.examResult);
                              return (
                                <tr key={student._id || index}>
                                  <td>{student.rollNo}</td>
                                  <td>{`${student.firstName} ${student.lastName}`}</td>
                                  <td>{student.examResult.score}</td>
                                  <td style={{
                                    color: student.examResult.status === "Pass" ? "#4CAF50" : "#f44336",
                                    fontWeight: "bold",
                                    backgroundColor: student.examResult.status === "Pass" ? 
                                      "rgba(76, 175, 80, 0.1)" : "rgba(244, 67, 54, 0.1)",
                                    padding: "4px 8px",
                                    borderRadius: "4px",
                                    textAlign: "center"
                                  }}>
                                    {student.examResult.status}
                                  </td>
                                  <td>
                                    <button 
                                      className="generate-certificate-btn"
                                      disabled={student.examResult.status !== "Pass" || generatingCertificate}
                                      onClick={generateCertificate(student)}
                                    >
                                      {generatingCertificate ? "Generating..." : "Generate Certificate"}
                                    </button>
                                  </td>
                                </tr>
                              );
                            })}
                        </tbody>
                      </table>

                      {/* Users Per Page Dropdown */}
                      <div className="users-per-page">
                        <label htmlFor="users-per-page">
                          Students per page:
                        </label>
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

                      {/* Pagination Controls */}
                      <div className="pagination">
                        {Array.from({ length: totalPages }, (_, index) => (
                          <button
                            key={index}
                            onClick={() => handlePageChange(index + 1)}
                            className={
                              currentPage === index + 1 ? "active" : ""
                            }
                          >
                            {index + 1}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : studentSearch ? (
                    <p>No students found matching {studentSearch}</p>
                  ) : null}
                </>
              </div>
            </div>
          ) : (
            <div className="no-data">
              <h3>No Data Available</h3>
              <p>
                Performance data is not available for the selected criteria.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PerformanceReports;
