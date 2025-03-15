import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../Helper/axiosInstance";
import toast from "react-hot-toast";
const intialState = {};
const token = localStorage.getItem("token");
export const QuestionSets = createAsyncThunk("/questionSets", async (data) => {
	console.log(data);
	try {
		const response = axiosInstance.post("/v1/admin/questionSets", data);
		toast.promise(response, {
			loading: "wait Question Set is being created",
			success: "Question Set has been created successfully",
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
});
export const AddQuestionToSet = createAsyncThunk(
	"/questionSets/addquestions",
	async (data) => {
		//console.log(data);
		try {
			const response = axiosInstance.post(
				"/v1/admin/questionSets/questions",
				data
			);
			toast.promise(response, {
				loading: "wait Question  is being added to Question Set",
				success: "Question has been added successfully to Question Set",
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
export const UpdateQuestionToSet = createAsyncThunk(
	"/questionSets/updatequestions",
	async (data) => {
		//console.log(data);
		try {
			const response = axiosInstance.put("/v1/admin/questions/update", data);
			toast.promise(response, {
				loading: "wait Question is being updated in Question Set",
				success: "Question has been updated successfully in Question Set",
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
export const DeleteQuestionToSet = createAsyncThunk(
	"/questions/delete",
	async (data) => {
		//console.log(data);
		try {
			const response = axiosInstance.delete(
				`/v1/admin/questions/${data?.questionId}`,
				data
			);
			toast.promise(response, {
				loading: "wait Question  is being deleted from Question Set",
				success: "Question has been deleted successfully from Question Set",
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
export const GetAllQuestionSet = createAsyncThunk(
	"/questionSets/GetAllQuestionSet",
	async (data) => {
		//console.log(data);
		try {
			const response = axiosInstance.get("/v1/admin/questionSets", data);
			toast.promise(response, {
				loading: "wait Question set is being retrive",
				success: "Question set has been retrived",
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
export const CreatenewExam = createAsyncThunk("/exams", async (data) => {
	//console.log(data);
	try {
		const response = axiosInstance.post("/v1/admin/exams", data, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		toast.promise(response, {
			loading: "wait exam  is being created",
			success: "Exam has been created successfully",
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
});
export const UpdateanExam = createAsyncThunk("/exams/update", async (data) => {
	//console.log(data);
	try {
		const response = axiosInstance.put(`/v1/admin/exams/${data.examId}`, data);
		toast.promise(response, {
			loading: "wait exam  is being updated",
			success: "Exam has been updated successfully",
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
});
export const AssignanExamtoSchool = createAsyncThunk(
	"/exams/assign",
	async (data) => {
		//console.log(data);
		try {
			const response = axiosInstance.put(
				`/v1/admin/exams/${data.examId}/assignSchools`,
				data
			);
			toast.promise(response, {
				loading: "wait exam  is being assigned to school",
				success: "Exam has been assigned successfully",
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
export const GetallExam = createAsyncThunk("/exams/allExam", async () => {
	//console.log(data);
	try {
		const response = axiosInstance.post(
			"/v1/auth/exams",
			{ level: localStorage.getItem("level") || 1 },
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);

		const resp = await response;
		return resp;
	} catch (err) {
		console.log(err);
		toast.error(err?.response?.data?.message);
	}
});

export const DeleteanExam = createAsyncThunk(
	"/exams/deleteExam",
	async (data) => {
		//console.log(data);
		try {
			const response = axiosInstance.delete(
				`/v1/admin/exams/${data.examId}`,
				data
			);
			toast.promise(response, {
				loading: "wait  exam  is being deleted",
				success: "Exam has been deleted successfully",
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
export const UserCreation = createAsyncThunk(
	"/user/createuser",
	async (data) => {
		//console.log(data);
		try {
			const response = axiosInstance.post(
				`/v1/admin/users/${data.userId}/assignRole`,
				data
			);
			toast.promise(response, {
				loading: "wait user is being created and getting the role",
				success: "User has been created and assigned roles",
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
export const UserUpdation = createAsyncThunk(
	"/user/updateuser",
	async (data) => {
		//console.log(data);
		try {
			const response = axiosInstance.put(
				`/v1/admin/users/${data.userId}/updateRole`,
				data
			);
			toast.promise(response, {
				loading: "wait user is being updated",
				success: "User has been updated successfully",
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
export const RoleRemoval = createAsyncThunk(
	"/user/roleremoval",
	async (data) => {
		//console.log(data);
		try {
			const response = axiosInstance.put(
				`/v1/admin/users/${data.userId}/removeRole`,
				data
			);
			toast.promise(response, {
				loading: "wait user role is being removed",
				success: "User role has been removed successfully",
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
export const AllUserbyRole = createAsyncThunk("/user/alluser", async (data) => {
	//console.log(data);
	try {
		const response = axiosInstance.get(
			`/v1/admin/users/role/${data?.role}`,
			data
		);
		toast.promise(response, {
			loading: "wait all user is getting fetched based on role",
			success: "all user is fetched based on role successfully",
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
});
const AdminControl = createSlice({
	name: "admincontrol",
	initialState: intialState,
});
export default AdminControl.reducer;
