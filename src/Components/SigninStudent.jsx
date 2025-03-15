import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { loginaccount, OTPSending } from "../Store/User/userreducer";
import { useDispatch } from "react-redux";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import '../assets/css/StudentLogin.css';

export default function SigninStudent() {
    const [data, setData] = useState({ email: "", otp: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const getErrorMessage = (error) => {
        if (typeof error === 'string') return error;
        
        // Handle Axios error
        if (error?.isAxiosError) {
            return error.response?.data?.message || error.message || "Network error occurred";
        }
        
        // Handle Redux error
        if (error?.payload) {
            if (typeof error.payload === 'string') return error.payload;
            if (error.payload?.message) return error.payload.message;
            if (error.payload?.error) return error.payload.error;
        }
        
        // Handle general error object
        if (error?.message && typeof error.message === 'string') return error.message;
        if (error?.error && typeof error.error === 'string') return error.error;
        
        return "An unexpected error occurred";
    };

    const handleLogin = async () => {
        try {
            if (!data.email || !data.otp) {
                toast.error("Please fill all fields");
                return;
            }

            setLoading(true);
            const loginData = { contact: data.email, otp: data.otp, flag: "Student" };
            const action = await dispatch(loginaccount(loginData));

            if (action.type.endsWith('/fulfilled')) {
                if (!action.payload?.data) {
                    toast.error("No response received from server");
                    return;
                }

                if (action.payload.data.success) {
                    localStorage.setItem("token", action.payload.data.userDetails.token);
                    toast.success("Login successful!");
                    navigate("/studhome");
                } else {
                    toast.error(getErrorMessage(action.payload.data));
                }
            } else if (action.type.endsWith('/rejected')) {
                toast.error(getErrorMessage(action.error));
            }
        } catch (error) {
            toast.error(getErrorMessage(error));
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateOtp = async () => {
        try {
            if (!data.email) {
                toast.error("Please enter your email");
                return;
            }

            setLoading(true);
            const action = await dispatch(OTPSending({ contact: data.email }));
            
            // Log for debugging
            console.log('OTP Action:', {
                type: action.type,
                error: action.error,
                payload: action.payload
            });

            // Handle rejected action first
            if (action.type.endsWith('/rejected')) {
                // Handle 404 specifically
                if (action.error?.response?.status === 404) {
                    toast.error("Email not found or invalid");
                    return;
                }

                // Handle other rejection cases
                let errorMessage = "Failed to send OTP";
                if (typeof action.error === 'string') {
                    errorMessage = action.error;
                } else if (action.error?.message) {
                    errorMessage = action.error.message;
                } else if (action.error?.response?.data?.message) {
                    errorMessage = action.error.response.data.message;
                }
                
                toast.error(errorMessage);
                return;
            }

            // Handle fulfilled action
            if (action.type.endsWith('/fulfilled')) {
                // Handle undefined payload
                if (!action.payload) {
                    toast.error("Server error: No response received");
                    return;
                }

                // Handle success case
                if (action.payload.success) {
                    toast.success("OTP sent successfully!");
                    return;
                }

                // Handle error in success response
                let message = "Failed to send OTP";
                if (typeof action.payload === 'string') {
                    message = action.payload;
                } else if (action.payload.message) {
                    message = String(action.payload.message);
                }
                toast.error(message);
                return;
            }

            // Handle unexpected action type
            toast.error("Unexpected response from server");
        } catch (error) {
            // Handle any unexpected errors
            let errorMessage = "An unexpected error occurred";
            if (typeof error === 'string') {
                errorMessage = error;
            } else if (error?.message) {
                errorMessage = String(error.message);
            }
            toast.error(errorMessage);
            console.error('OTP Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="signin-container">
            <div className="signin-box">
                <h2 className="signin-title">Let&apos;s Sign You In</h2>
                <h3 className="signin-subtitle">Student Login</h3>

                <div className="signin-form">
                    <div className="form-group">
                        <label htmlFor="email" className="form-label">Email, Phone, or Username</label>
                        <input
                            id="email"
                            name="email"
                            type="text"
                            value={data.email}
                            onChange={(e) => setData({ ...data, email: e.target.value })}
                            placeholder="Enter your email"
                            className="form-input"
                            disabled={loading}
                        />
                        <button 
                            onClick={handleGenerateOtp} 
                            className="generate-otp-btn"
                            disabled={loading}
                        >
                            {loading ? "Sending..." : "Generate OTP"}
                        </button>
                    </div>

                    <div className="form-group">
                        <label htmlFor="otp" className="form-label">Enter OTP</label>
                        <div className="input-with-icon">
                            <input
                                id="otp"
                                type={showPassword ? "text" : "password"}
                                value={data.otp}
                                onChange={(e) => setData({ ...data, otp: e.target.value })}
                                placeholder="Enter OTP"
                                className="form-input"
                                disabled={loading}
                            />
                            <button
                                type="button"
                                onClick={togglePasswordVisibility}
                                className="toggle-password-btn"
                                disabled={loading}
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                    </div>

                    <button
                        onClick={handleLogin}
                        className="signin-btn"
                        disabled={loading}
                    >
                        {loading ? "Signing in..." : "Sign In"}
                    </button>
                </div>
            </div>
            <Toaster 
                position="top-center"
                toastOptions={{
                    duration: 3000,
                    style: {
                        background: '#363636',
                        color: '#fff',
                    },
                }}
            />
        </div>
    );
}
