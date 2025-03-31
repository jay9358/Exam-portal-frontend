import { useState, useEffect } from 'react';
import axios from '../../Helper/axiosInstance';
import toast, { Toaster } from 'react-hot-toast';

function GeneratePassword() {
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch existing password when component mounts
  useEffect(() => {
    const fetchExistingPassword = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/v1/admin/getPassword`, {
          headers: { Authorization: localStorage.getItem("token") }
        });
        if (response.data.success) {
            console.log(response.data)
          setGeneratedPassword(response.data.defaultPassword);
        }
      } catch (error) {
        toast.error('Failed to fetch existing password');
      } finally {
        setLoading(false);
      }
    };

    fetchExistingPassword();
  }, []);

  // Generate random password
  const generateRandomPassword = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  };

  const handleGeneratePassword = async () => {
    try {
      setLoading(true);
      const newPassword = generateRandomPassword();
      
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/v1/admin/updatePassword`, {
        newPassword: newPassword,
        userId:localStorage.getItem("userId")
      },	{ headers: { Authorization: localStorage.getItem("token") } });

      if (response.data.success) {
        setGeneratedPassword(newPassword);
        toast.success('Password updated successfully');
      } else {
        toast.error('Failed to update password');
      }
    } catch (error) {
      toast.error('Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Generate Password</h2>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <p className="text-lg font-semibold">Current Generated Password:</p>
          <p className="text-xl bg-gray-100 p-3 rounded mt-2">
            {generatedPassword || 'No password generated yet'}
          </p>
        </div>
        
        <button
          onClick={handleGeneratePassword}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Generate New Password
        </button>
      </div>

      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded">
            Processing...
          </div>
        </div>
      )}
      
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

export default GeneratePassword;
