import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { loginaccount } from "../Store/User/userreducer";
import { useDispatch } from "react-redux";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import '../assets/css/StudentLogin.css';

export default function SigninStudent() {
    const [data, setData] = useState({ rollNumber: "", password: "" });
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
            if (!data.rollNumber || !data.password) {
                toast.error("Please fill all fields");
                return;
            }

            setLoading(true);
            const loginData = { 
                rollNumber: data.rollNumber, 
                password: data.password, 
                flag: "Student" 
            };
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
                        <label htmlFor="rollNumber" className="form-label">Roll Number</label>
                        <input
                            id="rollNumber"
                            name="rollNumber"
                            type="text"
                            value={data.rollNumber}
                            onChange={(e) => setData({ ...data, rollNumber: e.target.value })}
                            placeholder="Enter your roll number"
                            className="form-input"
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password" className="form-label">Password</label>
                        <div className="input-with-icon">
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                value={data.password}
                                onChange={(e) => setData({ ...data, password: e.target.value })}
                                placeholder="Enter your password"
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
