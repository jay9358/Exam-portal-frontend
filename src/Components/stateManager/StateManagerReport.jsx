import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function StateManagerReport() {
	const [cities, setCities] = useState([]);
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
	const [stateManager, setStateManager] = useState(null);
	const [schools, setSchools] = useState([]);
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
	// Fetch state manager details and their state
	const fetchStateManagerDetails = async () => {
		try {
			const userId = localStorage.getItem("userId"); // Get userId from localStorage
			if (!userId) {
				toast.error("User ID not found. Please login again.");
				return;
			}
            console.log("userId", userId);

			const response = await axios.get(
				`${import.meta.env.VITE_API_URL}/v1/admin/user/${userId}`,
				{
					headers: {
						Authorization: localStorage.getItem("token"),
					},
				}
			);
			setStateManager(response.data.user);
            console.log("response.data.user", response.data.user);
			// After getting state manager details, set cities based on their State
			if (response.data.user?.State) {
				setCities(citiesByState[response.data.user.State] || []);
			}
		} catch (error) {
			console.error("Error fetching state manager details:", error);
			toast.error("Error fetching state manager details.");
		}
	};

	// Fetch schools from API
	const fetchSchoolsByCity = async (city) => {
		try {
			const response = await axios.get(
				`${import.meta.env.VITE_API_URL}/v1/statemanager/schools`,
				{
					params: {
						State: stateManager?.State,
						City: city
					},
					headers: {
						Authorization: localStorage.getItem("token"),
					},
				}
			);
			setSchools(response.data.data);
            console.log("response.data", response.data.data);
			setFilteredSchools(response.data.data);
		} catch (error) {
			console.error("Error fetching schools:", error);
			toast.error("Error fetching schools.");
		}
	};

	useEffect(() => {
		fetchStateManagerDetails();
	}, []);

	// Add effect to update cities when stateManager changes
	useEffect(() => {
		if (stateManager?.State) {
			setCities(citiesByState[stateManager.State] || []);
		}
	}, [stateManager]);

	useEffect(() => {
		if (selectedCity) {
			fetchSchoolsByCity(selectedCity);
		}
	}, [selectedCity]);

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
		const passedStudents = results.filter(result => result.status === "Pass").length;
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

	const handleFetchExams = async () => {
		try {
			const response = await axios.get(
				`${import.meta.env.VITE_API_URL}/v1/statemanager/exams`,
				{
					headers: {
						Authorization: localStorage.getItem("token"),
					},
				}
			);
			setExams(response.data.data);
            console.log("response.data.data", response.data.data);
            
		} catch (error) {
			console.error("Error fetching exams:", error);
			toast.error("Error fetching exams.");
		}
	};

	useEffect(() => {
		handleFetchExams();
	}, []);

	const handleStudentSearch = (searchValue) => {
		if (!reportData || !reportData.users) return;

		const searchTerm = searchValue.toLowerCase().trim();
		const matchingStudents = reportData.users.filter(
			(student) =>
				student.rollNo?.toLowerCase().includes(searchTerm) ||
				student.firstName?.toLowerCase().includes(searchTerm) ||
				student.lastName?.toLowerCase().includes(searchTerm) ||
				`${student.firstName} ${student.lastName}`.toLowerCase().includes(searchTerm)
		);

		setFilteredStudents(matchingStudents);
	};

	const handleGenerateReport = async (e) => {
		e.preventDefault();
		if (!selectedCity || !selectedSchool || !selectedExam) {
			toast.error("Please select all fields");
			return;
		}
		setLoading(true);
		try {
			const response = await axios.get(
				`${import.meta.env.VITE_API_URL}/v1/statemanager/reports/performance`,
				{
					params: {
						state: stateManager?.State,
						city: selectedCity,
						schoolId: selectedSchool,
						examId: selectedExam
					},
					headers: {
						Authorization: localStorage.getItem("token"),
					},
				}
			);
			setReportData(response.data.data);
			setUser(response.data.data.users);
			setResult(response.data.data.results);
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
				<h2>State Performance Reports</h2>
				<p>Generate performance reports for {stateManager?.State}</p>
			</div>

			<form className="report-form" onSubmit={handleGenerateReport}>
				<div className="form-group">
					<label htmlFor="city">City</label>
					<select
						id="city"
						value={selectedCity}
						onChange={handleCityChange}
						required
					>
						<option value="">Select City</option>
						{cities.map((city) => (
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
						{filteredSchools.map((school) => (
							<option key={school._id} value={school.schoolId}>
								{school.schoolId} - {school.name || 'Unknown School Name'}
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
						disabled={!selectedSchool}
						required
					>
						<option value="">Select Exam</option>
						{exams.map((exam) => (
							<option key={exam._id} value={exam._id}>
								{exam.title || 'Untitled Exam'} - {new Date(exam.date).toLocaleDateString()}
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

							<div className="student-search">
								<h4>Search Student</h4>
								<div className="search-form">
									<input
										type="text"
										value={studentSearch}
										onChange={(e) => {
											setStudentSearch(e.target.value);
											handleStudentSearch(e.target.value);
										}}
										placeholder="Enter Student ID or Name"
									/>
								</div>

								{filteredStudents.length > 0 ? (
									<div className="search-results">
										<p>Found {filteredStudents.length} matching students</p>
										<table className="student-result">
											<thead>
												<tr>
													<th>Roll No</th>
													<th>Name</th>
													<th>Level</th>
                                                   
													<th>Generated Certificate</th>
												</tr>
											</thead>
											<tbody>
												{filteredStudents.map((student, index) => (
													<tr key={student._id || index}>
														<td>{student.rollNo}</td>
														<td>{`${student.firstName} ${student.lastName}`}</td>
														<td>{student.level}</td>
                                                       
														<td>
															<button className="generate-certificate-btn">
																Generate Certificate
															</button>
														</td>
													</tr>
												))}
											</tbody>
										</table>
									</div>
								) : studentSearch ? (
									<p>No students found matching "{studentSearch}"</p>
								) : null}
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
}

