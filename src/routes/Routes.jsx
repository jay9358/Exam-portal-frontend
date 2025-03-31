import { Route, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';
import Layout from '../layout';
import SigninStudent from '../Components/SigninStudent';
import SigninAdmin from '../Components/SigninAdmin';
import Dashboard from '../Components/adminsection/Dashboard';
import AdminDashboard from '../Components/adminsection/AdminDashboard';
import StudentSection from '../Components/StudentHomePage';
import FirstPage from '../Components/SigninFirstPage';
import Contactus from '../Components/Contactus';
import ResetPassword from '../Components/ResetPassword';
import ExamLogin from '../Components/ExamStart.Page';
import UploadCSV from '../Components/adminsection/UploadCSV';
import ExamList from '../Components/adminsection/ExamList';
import ManageExams from '../Components/adminsection/ManageExams';
import ManageUsers from '../Components/adminsection/ManageUsers';
import CreateExam from '../Components/adminsection/CreateExam';
import ManageQuestionSets from '../Components/adminsection/ManageQuestionSets';
import ExamPages from '../Components/ExamPage';
import SubmitConfirmation from '../Components/ExamExit';
import Examtaking from '../Components/Examtaking';
import SubmittedExam from '../Components/SubmittedExam';
import ExamInstructions from '../Components/ExamInstructions';
import RegisterSchools  from '../Components/adminsection/UploadCSVschool';
import PerformanceReports from '../Components/adminsection/PerformanceReports';
import StateManagerReports from '../Components/stateManager/StateManagerReport';
import StateManagerLogin from '../Components/stateManager/StateManagerLogin';
import CityManagerLogin from '../Components/cityManager/CityManagerLogin';
import CityManagerReport from '../Components/cityManager/CityManagerReport';
import SeeChapterWeitghage from '../Components/adminsection/SeeChapterWeitghage';
import ReviewQuestionSet from '../Components/adminsection/ReviewQuestionSet';
import GeneratePassword from '../Components/adminsection/GeneratePassword';
const Routes = createBrowserRouter(
	createRoutesFromElements(
		<Route element={<Layout />}>
			{/* Public Routes */}

			<Route path="/" element={<FirstPage />} />
			<Route path="/stulogin" element={<SigninStudent />} />
			<Route path="/adminlogin" element={<SigninAdmin />} />
			<Route path="/contact" element={<Contactus />} />
			<Route path="/reset" element={<ResetPassword />} />
			<Route path="/examstart" element={<ExamLogin />} />
			<Route path="/examend" element={<SubmitConfirmation />} />
			<Route path="/exam/:examId" element={<Examtaking />} />
			<Route path="/submitexam/:examId/result" element={<SubmittedExam />} />
			<Route path="/examInstrctions/:examId" element={<ExamInstructions />} />
			<Route path="/seechapterweightage" element={<SeeChapterWeitghage />} />
			<Route path="/reviewquestionset" element={<ReviewQuestionSet />} />
			{/* Protected Routes for Admin */}
			<Route path="/dashboard" element={<Dashboard />} />
			<Route path="/admindashboard" element={<AdminDashboard />} />
			<Route path="/createexam" element={<CreateExam />} />
			<Route path="/performancereports" element={<PerformanceReports />} />
			<Route path="/manageexam" element={<ManageExams />} />
			<Route path="/manageuser" element={<ManageUsers />} />
			<Route path="/statemanagerreports" element={<StateManagerReports />} />
			<Route path="/uploadcsv" element={<UploadCSV />} />
			<Route path="/uploadcsvSchools" element={<RegisterSchools />} />
			<Route path="/examlist" element={<ExamList />} />
			<Route path="/managequestionsets" element={<ManageQuestionSets />} />
			<Route path="/exampage" element={<ExamPages />} />
			<Route path="/statemanagerlogin" element={<StateManagerLogin />} />
			<Route path="/citymanagerlogin" element={<CityManagerLogin />} />
			<Route path="/citymanagerreports" element={<CityManagerReport />} />
			<Route path='/generate' element={<GeneratePassword/>}></Route>
			{/* Protected Routes for Student */}
			<Route path="/studhome" element={<StudentSection />} />
		</Route>
	)
);

export default Routes;


