import {configureStore} from "@reduxjs/toolkit"
import userreducer from "./User/userreducer"
import examreducer from "./Exam/examreducer"
import adminreducer from "./Admin/adminreducer"
const store=configureStore({
    reducer:{
        user:userreducer,
        exam:examreducer,
        admin:adminreducer,
    }
})
export default store;