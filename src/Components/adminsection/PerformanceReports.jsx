import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import "../../assets/css/PerformanceReports.css";

const PerformanceReports = () => {
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
  const [filteredStudent, setFilteredStudent] = useState(null);
  // List of Indian states
  const indianStates = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
    "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
    "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
    "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
  ];

  // Cities object with major cities for each state
  const citiesByState = {
    "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Guntur", "Nellore", "Kurnool", "Kakinada", "Tirupati", "Rajahmundry", "Kadapa"],
    "Arunachal Pradesh": ["Itanagar", "Naharlagun", "Pasighat", "Namsai", "Roing", "Tezu", "Tawang", "Ziro", "Bomdila"],
    "Assam": ["Guwahati", "Silchar", "Dibrugarh", "Jorhat", "Nagaon", "Tinsukia", "Tezpur", "Bongaigaon", "Karimganj"],
    "Bihar": ["Patna", "Gaya", "Bhagalpur", "Muzaffarpur", "Purnia", "Darbhanga", "Arrah", "Bihar Sharif", "Begusarai"],
    "Chhattisgarh": ["Raipur", "Bhilai", "Bilaspur", "Korba", "Durg", "Rajnandgaon", "Raigarh", "Jagdalpur", "Ambikapur"],
    "Goa": ["Panaji", "Margao", "Vasco da Gama", "Mapusa", "Ponda", "Bicholim", "Curchorem", "Cuncolim", "Canacona"],
    "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar", "Jamnagar", "Gandhinagar", "Junagadh", "Anand"],
    "Haryana": ["Faridabad", "Gurgaon", "Panipat", "Ambala", "Yamunanagar", "Rohtak", "Hisar", "Karnal", "Sonipat"],
    "Himachal Pradesh": ["Shimla", "Mandi", "Dharamshala", "Solan", "Kullu", "Manali", "Hamirpur", "Una", "Bilaspur"],
    "Jharkhand": ["Ranchi", "Jamshedpur", "Dhanbad", "Bokaro", "Hazaribagh", "Deoghar", "Giridih", "Ramgarh", "Phusro"],
    "Karnataka": ["Bangalore", "Mysore", "Hubli-Dharwad", "Mangalore", "Belgaum", "Gulbarga", "Davanagere", "Bellary", "Bijapur"],
    "Kerala": ["Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur", "Kollam", "Palakkad", "Alappuzha", "Kannur", "Kottayam"],
    "Madhya Pradesh": ["Bhopal", "Indore", "Jabalpur", "Gwalior", "Ujjain", "Sagar", "Dewas", "Satna", "Ratlam"],
    "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Thane", "Nashik", "Aurangabad", "Solapur", "Kolhapur", "Amravati"],
    "Manipur": ["Imphal", "Thoubal", "Bishnupur", "Churachandpur", "Kakching", "Ukhrul", "Chandel", "Senapati", "Tamenglong"],
    "Meghalaya": ["Shillong", "Tura", "Jowai", "Nongstoin", "Williamnagar", "Baghmara", "Resubelpara", "Ampati", "Khliehriat"],
    "Mizoram": ["Aizawl", "Lunglei", "Saiha", "Champhai", "Kolasib", "Serchhip", "Lawngtlai", "Mamit", "Khawzawl"],
    "Nagaland": ["Kohima", "Dimapur", "Mokokchung", "Tuensang", "Wokha", "Zunheboto", "Mon", "Phek", "Kiphire"],
    "Odisha": ["Bhubaneswar", "Cuttack", "Rourkela", "Berhampur", "Sambalpur", "Puri", "Balasore", "Bhadrak", "Baripada"],
    "Punjab": ["Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda", "Mohali", "Pathankot", "Hoshiarpur", "Batala"],
    "Rajasthan": ["Jaipur", "Jodhpur", "Udaipur", "Kota", "Bikaner", "Ajmer", "Bhilwara", "Alwar", "Sikar"],
    "Sikkim": ["Gangtok", "Namchi", "Gyalshing", "Mangan", "Rangpo", "Singtam", "Jorethang", "Nayabazar", "Ravangla"],
    "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Tirunelveli", "Tiruppur", "Vellore", "Erode"],
    "Telangana": ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar", "Khammam", "Ramagundam", "Secunderabad", "Nalgonda", "Suryapet"],
    "Tripura": ["Agartala", "Udaipur", "Dharmanagar", "Pratapgarh", "Belonia", "Kailasahar", "Khowai", "Teliamura", "Melaghar"],
    "Uttar Pradesh": ["Lucknow", "Kanpur", "Varanasi", "Agra", "Meerut", "Allahabad", "Ghaziabad", "Noida", "Gorakhpur"],
    "Uttarakhand": ["Dehradun", "Haridwar", "Roorkee", "Haldwani", "Rudrapur", "Kashipur", "Rishikesh", "Kathgodam", "Pithoragarh"],
    "West Bengal": ["Kolkata", "Howrah", "Durgapur", "Asansol", "Siliguri", "Bardhaman", "Malda", "Baharampur", "Krishnanagar"]
  };

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
  };

  useEffect(() => {
    
    fetchAllSchools();
  }, []);
  useEffect(() => {
    if (selectedState && selectedCity) {
      const filtered = schools.filter(
        (school) => school.state === selectedState && school.city === selectedCity
      );
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
  const calculateStatistics = (results) => {
    console.log(results);
    if (!results || results.length === 0) return null;
    console.log("ds");
    const totalStudents = results.length;
    const passedStudents = results.filter(result => result.status === "PASS").length;
    const totalScore = results.reduce((sum, result) => sum + result.score, 0);
    const averageScore = (totalScore / totalStudents).toFixed(2);
    
    return {
      totalStudents,
      passedStudents,
      failedStudents: totalStudents - passedStudents,
      averageScore,
      passPercentage: ((passedStudents / totalStudents) * 100).toFixed(2)
    };
  };
  const handleStudentSearch = (e) => {
    e.preventDefault();
    if (!reportData || !reportData.results) return;


    setFilteredStudent(student || null);
  };

  const handleGenerateReport = async (e) => {
    e.preventDefault();
    if (!selectedState || !selectedCity || !selectedSchool) {
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
            schoolId: selectedSchool
          },
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      setReportData(response.data.data);
      setUser(response.data.data.user);
      setResult(response.data.data.result);

      setShowReport(true);
      
    } catch (error) {
      console.error("Error generating report:", error);
      toast.error("Error generating report.");
    } finally {
      setLoading(false);
    }
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
            disabled={!selectedCity}
            required
          >
            <option value="">Select School</option>
            {filteredSchools.map((school) => (
              <option key={school._id} value={school.schoolId}>
                {school.schoolId} - {school.name}
              </option>
            ))}
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
          ) : reportData && reportData.result ? (
            <div className="report-data">
              <h3>Performance Report</h3>
              
              {/* Overall Statistics Table */}
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
                      const stats = calculateStatistics(reportData.result);
                      return stats && (
                        <tr>
                          <td>{stats.totalStudents}</td>
                          <td>{stats.passedStudents}</td>
                          <td>{stats.failedStudents}</td>
                          <td>{stats.averageScore}</td>
                          <td>{stats.passPercentage}%</td>
                        </tr>
                      );
                    })()}
                  </tbody>
                </table>
              </div>

              {/* Student Search Section */}
              <div className="student-search">
                <h4>Search Student</h4>
                <form onSubmit={handleStudentSearch} className="search-form">
                  <input
                    type="text"
                    value={studentSearch}
                    onChange={(e) => setStudentSearch(e.target.value)}
                    placeholder="Enter Student ID or Name"
                    required
                  />
                  <button type="submit">Search</button>
                </form>

                {filteredStudent && (
                  <table className="student-result">
                    <thead>
                      <tr>
                        <th>Student ID</th>
                        <th>Name</th>
                        <th>Score</th>
                        <th>Status</th>
                        <th>Exam Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{filteredStudent.studentId}</td>
                        <td>{filteredStudent.studentName}</td>
                        <td>{filteredStudent.score}%</td>
                        <td className={filteredStudent.status === "PASS" ? "pass" : "fail"}>
                          {filteredStudent.status}
                        </td>
                        <td>{new Date(filteredStudent.examDate).toLocaleDateString()}</td>
                      </tr>
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          ) : (
            <div className="no-data">
              <h3>No Data Available</h3>
              <p>Performance data is not available for the selected criteria.</p>
            </div>
          )}
        </div>
      )}
      
    </div>
  );
};

export default PerformanceReports;
