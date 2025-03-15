import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../Helper/axiosInstance";
import toast from "react-hot-toast";
const intialState={
    
};
export const LiveMonitoringofExam=createAsyncThunk('/live',async(data)=>{
    //console.log(data);
    try{
     const response=axiosInstance.get(`/v1/exams/liveMonitor/${data.role}/${data.userId}/${data?.schoolId}`,data)
     toast.promise(response,{
        loading:"wait you are getting live monitoring of user ",
        success: "",
        error:(err)=>{
            return err?.response.message
        }
     })
     const resp=await response;
     console.log(resp);
     return resp;
    }
    catch(err){
        console.log(err);
        toast.error(err?.response?.data?.message)
    }
})
export const PerformanceReportOfUser=createAsyncThunk('/userperformance',async(data)=>{
    //console.log(data);
    try{
     const response=axiosInstance.get(`/v1/exams/performanceReports/${data.role}/${data.userId}/${data?.schoolId}`,data)
     toast.promise(response,{
        loading:"wait you are getting the performance report ",
        success: "Performance report fetched successfully",
        error:(err)=>{
            return err?.response.message
        }
     })
     const resp=await response;
     console.log(resp);
     return resp;
    }
    catch(err){
        console.log(err);
        toast.error(err?.response?.data?.message)
    }
})
export const SchoolWiseData=createAsyncThunk('/schooldata',async(data)=>{
    //console.log(data);
    try{
     const response=axiosInstance.get(`/v1/exams/schoolWiseData/${data.role}/${data.userId}/${data?.schoolId}`,data)
     toast.promise(response,{
        loading:"wait you are getting performance report",
        success: "Performance report fetched successfully",
        error:(err)=>{
            return err?.response.message
        }
     })
     const resp=await response;
     console.log(resp);
     return resp;
    }
    catch(err){
        console.log(err);
        toast.error(err?.response?.data?.message)
    }
})
export const SchoolWiseReports=createAsyncThunk('/schoolreport',async(data)=>{
    //console.log(data);
    try{
     const response=axiosInstance.get(`/v1/schools/${data.schoolId}/reports`,data)
     toast.promise(response,{
        loading:"wait you are getting performance report",
        success: "Performance report fetched successfully",
        error:(err)=>{
            return err?.response.message
        }
     })
     const resp=await response;
     console.log(resp);
     return resp;
    }
    catch(err){
        console.log(err);
        toast.error(err?.response?.data?.message)
    }
})
export const StateWiseReports=createAsyncThunk('/statereport',async(data)=>{
    //console.log(data);
    try{
     const response=axiosInstance.get(`/v1/state/${data.state}/reports`,data)
     toast.promise(response,{
        loading:"wait you are getting performance report",
        success: "Performance report fetched successfully",
        error:(err)=>{
            return err?.response.message
        }
     })
     const resp=await response;
     console.log(resp);
     return resp;
    }
    catch(err){
        console.log(err);
        toast.error(err?.response?.data?.message)
    }
})
export const CityWiseReports=createAsyncThunk('/cityreport',async(data)=>{
    //console.log(data);
    try{
     const response=axiosInstance.get(`/v1/city/${data.city}/reports`,data)
     toast.promise(response,{
        loading:"wait you are getting performance report",
        success: "Performance report fetched successfully",
        error:(err)=>{
            return err?.response.message
        }
     })
     const resp=await response;
     console.log(resp);
     return resp;
    }
    catch(err){
        console.log(err);
        toast.error(err?.response?.data?.message)
    }
})
export const WorkerWiseReports=createAsyncThunk('/workerreport',async(data)=>{
    //console.log(data);
    try{
     const response=axiosInstance.get(`/v1/worker/${data.workerId}/monitor`,data)
     toast.promise(response,{
        loading:"wait you are getting performance report",
        success: "Performance report fetched successfully",
        error:(err)=>{
            return err?.response.message
        }
     })
     const resp=await response;
     console.log(resp);
     return resp;
    }
    catch(err){
        console.log(err);
        toast.error(err?.response?.data?.message)
    }
})
export const RandomQuestionAssignment=createAsyncThunk('/assignSet',async(data)=>{
    //console.log(data);
    try{
     const response=axiosInstance.post(`/v1/exams/${data.examId}/assignSet`,data)
     toast.promise(response,{
        loading:"wait assigning the random question set",
        success: "assignment of random question set to user",
        error:(err)=>{
            return err?.response.message
        }
     })
     const resp=await response;
     console.log(resp);
     return resp;
    }
    catch(err){
        console.log(err);
        toast.error(err?.response?.data?.message)
    }
})
export const StartExamByStudent=createAsyncThunk('/start',async(data)=>{
    //console.log(data);
    try{
     const response=axiosInstance.post(`/v1/exams/${data.examId}/start`,data)
     toast.promise(response,{
        loading:"wait starting the exam",
        success: "exam has started",
        error:(err)=>{
            return err?.response.message
        }
     })
     const resp=await response;
     console.log(resp);
     return resp;
    }
    catch(err){
        console.log(err);
        toast.error(err?.response?.data?.message)
    }
})
export const SubmitExamByStudent=createAsyncThunk('/submit',async(data)=>{
    //console.log(data);
    try{
     const response=axiosInstance.post(`/v1/exams/${data.examId}/submit`,data)
     toast.promise(response,{
        loading:"wait starting the exam",
        success: "exam has started",
        error:(err)=>{
            return err?.response.message
        }
     })
     const resp=await response;
     console.log(resp);
     return resp;
    }
    catch(err){
        console.log(err);
        toast.error(err?.response?.data?.message)
    }
})
export const AutoSubmissionofExam=createAsyncThunk('/submit',async(data)=>{
    //console.log(data);
    try{
     const response=axiosInstance.post(`/v1/exams/${data.examId}/autoSubmit`,data)
     toast.promise(response,{
        loading:"wait starting the exam",
        success: "exam has started",
        error:(err)=>{
            return err?.response.message
        }
     })
     const resp=await response;
     console.log(resp);
     return resp;
    }
    catch(err){
        console.log(err);
        toast.error(err?.response?.data?.message)
    }
})
export const LiveMonitoringofExambyuser=createAsyncThunk('/livemonitor',async(data)=>{
    //console.log(data);
    try{
     const response=axiosInstance.get(`/v1/exams/${data.examId}/liveMonitor`,data)
     toast.promise(response,{
        loading:"wait you are getting live monitoring",
        success: "live monitoring",
        error:(err)=>{
            return err?.response.message
        }
     })
     const resp=await response;
     console.log(resp);
     return resp;
    }
    catch(err){
        console.log(err);
        toast.error(err?.response?.data?.message)
    }
})
const Exampanel=createSlice({
    name:"ExamPanel",
    initialState:intialState
})
export default Exampanel.reducer;
