import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { loginaccount, OTPSending } from "../../Store/User/userreducer";
import { useDispatch } from "react-redux";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import '../../assets/css/StateManagerLogin.css';

export default function StateManagerLogin() {
    const [data, setData] = useState({ email: "", otp: "" });
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    async function LoginAccount() {
        if (data.email === "" || data.otp === "") {
            toast.error("Please fill all fields");
            return;
        }

        const logindata = { contact: data.email, otp: data.otp, flag: "StateManager" };
        const loginaccountresponse = await dispatch(loginaccount(logindata));

        if (loginaccountresponse?.payload?.data?.success === true) {
            // Store the token in localStorage
            const token = loginaccountresponse?.payload?.data?.userDetails?.token;
            localStorage.setItem('token', token);
            localStorage.setItem('flag', 'StateManager');
            localStorage.setItem('userId', loginaccountresponse?.payload?.data?.userDetails?._id);
            // Navigate to the state manager dashboard
            navigate('/statemanagerreports');
        } else {
            toast.error("Login failed, please try again.");
        }
    }

    async function GenerateOtp() {
        if (data.email === "") {
            toast.error("Please enter your email");
            return;
        }
        const generateotpresponse = await dispatch(
            OTPSending({ contact: data.email })
        );
        console.log(generateotpresponse);
    }

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <>
            <div className="signin-container">
                <div className="signin-form">
                    <img src="logo.png" alt="Logo" className="logo mx-auto" />
                    <h2 className="signin-title">State Manager Login</h2>
                    <div className="form-group">
                        <input
                            id="email"
                            name="email"
                            type="text"
                            value={data.email}
                            onChange={(e) => setData({ ...data, email: e.target.value })}
                            placeholder="Email, Phone, or Username"
                            className="input-field"
                        />
                        <button onClick={GenerateOtp} className="generate-otp-btn">
                            Generate OTP
                        </button>
                    </div>

                    <div className="form-group">
                        <div className="password-field">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your OTP"
                                value={data.otp}
                                onChange={(e) => setData({ ...data, otp: e.target.value })}
                                className="input-field"
                            />
                            <button
                                type="button"
                                onClick={togglePasswordVisibility}
                                className="password-toggle-btn">
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                    </div>

                    <div className="form-group">
                        <button onClick={LoginAccount} className="signin-btn">
                            Sign in
                        </button>
                    </div>

                    <p className="register-link">
                        Don't have an account?{" "}
                        <a href="#" className="register-link-text">
                            Register Now
                        </a>
                    </p>
                </div>
            </div>

            <Toaster />
        </>
    );
}

