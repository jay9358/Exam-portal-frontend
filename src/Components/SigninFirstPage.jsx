import { Link } from "react-router-dom";
import "../assets/css/FirstPage.css"; 

export default function FirstPage() {
  return (
		<div className="container">
			{/* Centered Container */}
			<div className="box">
				{/* Logo */}
				<img src="logo.png" alt="Logo" className="logo" />

				{/* Greeting Text */}
				<h1 className="greeting-text">Hey, would you like to sign in as...</h1>

				{/* Buttons Container */}
				<div className="button-container">
					<Link to={"/adminlogin"} className="button admin-button">
						ADMIN
					</Link>
					<Link to={"/stulogin"} className="button student-button">
						STUDENT
					</Link>
					<Link to={"/citymanagerlogin"} className="button student-button">
						City Manager
					</Link>
					<Link to={"/statemanagerlogin"} className="button student-button">
						State Manager
					</Link>
				</div>
			</div>
		</div>
	);
}
