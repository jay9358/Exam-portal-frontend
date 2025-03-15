import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { loginaccount, OTPSending } from "../Store/User/userreducer";
import { useDispatch } from "react-redux";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import '../assets/css/StudentLogin.css';

export default function SigninStudent() {
    const navigate = useNavigate();
    const [data, setData] = useState({ email: "", otp: "" });
    const [showPassword, setShowPassword] = useState(false);
    const dispatch = useDispatch();

    async function LoginAccount() {
        if (!data.email || !data.otp) {
            toast.error("Please fill all fields");
            return;
        }

  const logindata={contact:data.email, otp:data.otp,flag:"Student"};
        const loginaccountresponse=await dispatch(loginaccount(logindata));
        if (loginaccountresponse?.payload?.data?.success == true) {
					localStorage.setItem(
						"token",
						loginaccountresponse?.payload?.data?.userDetails?.token
					);
					navigate("/studhome");
				}  
    }

    async function GenerateOtp() {
        if (!data.email) {
            toast.error("Please enter your email");
            return;
        }
 const generateotpresponse=await dispatch(OTPSending({contact:data.email}));
        console.log(generateotpresponse);
        setData({...data});
    }

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
			<div className="signin-container">
				<div className="signin-box">
					<img src="logo.png" alt="Logo" className="logo" />
					<h2 className="signin-title">Let&apos;s Sign You In</h2>
					<h3 className="signin-subtitle">Student Login</h3>

					<div className="form">
						<div className="form-group">
							<label htmlFor="email" className="form-label">
								Email, Phone, or Username
							</label>
							<input
								id="email"
								name="email"
								type="text"
								value={data.email}
								onChange={(e) => setData({ ...data, email: e.target.value })}
								placeholder="Enter your email"
								className="form-input"
							/>
							<button onClick={GenerateOtp} className="generate-otp-btn">
								Generate OTP
							</button>
						</div>

						<div className="form-group">
							<label htmlFor="otp" className="form-label">
								Enter OTP
							</label>
							<div className="input-with-icon">
								<input
									id="otp"
									type={showPassword ? "text" : "password"}
									value={data.otp}
									onChange={(e) => setData({ ...data, otp: e.target.value })}
									placeholder="Enter your OTP"
									className="form-input"
								/>
								<button
									type="button"
									onClick={togglePasswordVisibility}
									className="toggle-password-btn">
									{showPassword ? <FaEyeSlash /> : <FaEye />}
								</button>
							</div>
						</div>

						<button onClick={LoginAccount} className="signin-btn">
							Sign In
						</button>
					</div>

					<Toaster />
				</div>
			</div>
		);
}
