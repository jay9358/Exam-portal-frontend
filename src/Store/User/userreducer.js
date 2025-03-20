import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../Helper/axiosInstance";
import toast from "react-hot-toast";
const initialState = {
	userDetails: null,
	isAuthenticated: false,
	loading: false,
	error: null,
	flag: null, // Ensure flag is part of the initial state
};

export const loginaccount = createAsyncThunk("/login", async (data) => {
	// console.log(data?.flag);
	localStorage.setItem("flag", data?.flag);

	try {
		const response = axiosInstance.post("/v1/auth/login", data);
		toast.promise(response, {
			loading: "Logging In...",
			success: "Your account has verified and you have successfully logged in",
			error: (err) => {
				return err?.response.message;
			},
		});
		const resp = await response;
		localStorage.setItem(
			"level",
			resp?.payload?.data?.userDetails?.level || 1
		);
		console.log(resp.data.userDetails._id);
		localStorage.setItem(
			"userId",
			resp.data.userDetails._id || 1
		);
		return resp;
	} catch (err) {
		console.log("error is here");
		console.log(err);
		toast.error(err?.response?.data?.message);
	}
});
export const OTPSending = createAsyncThunk("/sendotp", async (data) => {
	console.log("OTP Thunk - Request Data:", data);
	
	try {
		// Add toast loading notification
		toast.loading("Checking user and sending OTP...");
		
		const response = await axiosInstance.post("/v1/auth/sendotp", {
			contact: data.contact,
 // Add flag to match user type
		});
		
		toast.dismiss(); // Remove loading toast
		console.log("OTP Thunk - Success Response:", response.data);
		
		if (response.data.success) {
			toast.success(response.data.message || "OTP sent successfully!");
		} else {
			toast.error(response.data.message || "Failed to send OTP");
		}
		
		return response.data;
	} catch (error) {
		toast.dismiss(); // Remove loading toast
		console.error("OTP Thunk - Error:", {
			status: error.response?.status,
			message: error.response?.data?.message,
			error: error
		});

		// Handle specific error cases
		if (error.response?.status === 404) {
			toast.error("User not found. Please register first.");
			throw new Error("User not found. Please register first.");
		}
		
		if (error.response?.data?.message) {
			toast.error(error.response.data.message);
			throw new Error(error.response.data.message);
		}
		
		toast.error("Failed to send OTP");
		throw new Error("Failed to send OTP");
	}
});
export const RegisteringStudent = createAsyncThunk(
	"/registerStudents",
	async (data) => {
		console.log(data);
		try {
			const response = axiosInstance.post("/v1/auth/registerStudents", data);
			toast.promise(response, {
				loading: "wait you are getting verified",
				success:
					"your account has verified and  successfully otp send on your email/phone please verify it to login",
				error: (err) => {
					return err?.response.message;
				},
			});
			const resp = await response;
			console.log(resp);
			return resp;
		} catch (err) {
			console.log(err);
			toast.error(err?.response?.data?.message);
		}
	}
);
// const Userpanel = createSlice({
//     name: "UserPanel",
//     initialState:initialState,
//     extraReducers: (builder) => {
//         builder
//             .addCase(loginaccount.pending, (state) => {
//                 state.loading = true;
//                 state.error = null;
//             })
//             .addCase(loginaccount.fulfilled, (state, action) => {
//                 console.log(action.payload.data.userDetails);
//                 if (action.payload?.data?.success==true) {
//                     state.userDetails = action.payload.payload?.data?.userDetails; // Store user details
//                     state.isAuthenticated = true;                   // Set authentication status
//                 }
//                 state.loading = false;
//             })
//             .addCase(loginaccount.rejected, (state, action) => {
//                 state.loading = false;
//                 state.error = action.error.message;
//             });
//     }
// });

const Userpanel = createSlice({
	name: "UserPanel",
	initialState: initialState,
	extraReducers: (builder) => {
		builder
			.addCase(loginaccount.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(loginaccount.fulfilled, (state, action) => {
				if (action.payload?.data?.success === true) {
					const { userDetails, flag } = action.payload.data;
					state.userDetails = userDetails;
					state.flag = flag; // Set flag value when login is successful
					state.isAuthenticated = true;
				}
				state.loading = false;
			})
			.addCase(loginaccount.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error.message;
			});
	},
});

export default Userpanel.reducer;
