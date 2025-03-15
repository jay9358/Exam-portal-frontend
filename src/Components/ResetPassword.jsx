import React, { useState } from "react";
import { loginaccount } from "../Store/User/userreducer";
import  {useDispatch,useSelector} from "react-redux";
import { Link } from "react-router-dom";
export default function ResetPassword() {
    const [data, setdata] = useState({ email: ""});
    const dispatch=useDispatch();
    return (
        <>
            <div className="flex w-1/2 min-h-full flex-1 mx-auto justify-center px-6 py-12 lg:px-8 rounded-lg shadow-2xl">
                <div className="w-full">
                    <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                        <h2 className="mt-10 text-center text-4xl font-bold tracking-tight text-gray-900">Reset Password</h2>
                        <h2 className="mt-10 text-center text-xl font-bold tracking-tight text-gray-900">
                            Enter your email for a password reset link
                        </h2>
                    </div>
                    <hr className="mx-auto mt-4 w-1/2 border-2"/>
                    <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                        <div className="space-y-6">
                            <div>
                                <div className="mt-2 w-full ">
                                    <input
                                        id="email"
                                        name="email"
                                        type="text"
                                        required
                                        value={data.email}
                                        onChange={(e) => setdata({ ...data, email: e.target.value })}
                                        placeholder="Email, Phone, or Username"
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                                    />
                                </div>
                            </div>
                            <div className="text-m mt-2 text-left">
                                    <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
                                        Forgot Email?
                                    </a>
                                </div>
                            <div>
                                <button
                                    className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                >
                                    Send Reset Link
                                </button>
                            </div>
                        </div>
                        <p className="mt-10 text-center text-sm text-gray-500">
                            <Link to={"/signin"} className="font-semibold text-black hover:text-gray-700">
                                Back to Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
