import React, { useState } from "react";
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { loginaccount } from "../Store/User/userreducer";
import  {useDispatch,useSelector} from "react-redux";
export default function Contactus() {
    const [data, setdata] = useState({ Name:"",Email:"",Message:""});
    const dispatch=useDispatch();
    // async function LoginAccount(){
    //     const loginaccountresponse=await dispatch(loginaccount);
    //     console.log(loginaccountresponse(data));        
    // }

    return (
        <>
            <div className="flex w-1/2 min-h-full flex-1 mx-auto justify-center px-6 py-12 lg:px-8 rounded-lg shadow-2xl">
                <div className="w-full">
                    <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                        <h2 className="mt-10 text-center text-4xl font-bold tracking-tight text-gray-900">Contact us</h2>
                        <h2 className="mt-10 text-center font-bold text-xl  tracking-tight text-gray-900">
                            Some contact information on how to reach out
                        </h2>
                    </div>
                    <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                        <div className="space-y-6">
                            <div>
                                <div className="mt-2">
                                    <input
                                        id="email"
                                        name="email"
                                        type="text"
                                        required
                                        value={data.Name}
                                        onChange={(e) => setdata({ ...data, Name: e.target.value })}
                                        placeholder="Name"
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                                    />
                                </div>
                            </div>
                            <div>
                                <div className="mt-2">
                                    <input
                                        id="email"
                                        name="email"
                                        type="text"
                                        required
                                        value={data.Email}
                                        onChange={(e) => setdata({ ...data, Email: e.target.value })}
                                        placeholder="Email"
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                                    />
                                </div>
                            </div>
                            <div>
                                <div className="mt-2">
                                   <textarea name="" id="" value={data.Message} onChange={(e)=>(setdata({...data,Message:e.target.value}))} placeholder="Message" className="border-2 p-2.5  resize-none rounded-lg w-full h-48">

                                   </textarea>
                                </div>
                            </div>

                            <div>
                                <button
                                    className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                >
                                    Send Message
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
