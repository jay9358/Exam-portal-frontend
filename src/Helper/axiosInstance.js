import axios from "axios"
const Base_URL = "http://localhost:4000";
const axiosInstance=axios.create();
axiosInstance.defaults.baseURL=Base_URL;
axiosInstance.defaults.withCredentials=true;

  


// Set token in axios headers
const token = localStorage.getItem('token');
if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}
export default axiosInstance;
