import axios from "axios"
import {toast} from "react-toastify"

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL

const validateEmail = (email) => {
  return email.match(
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
};

// Register User
const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${BACKEND_URL}/api/users/register`, userData);
    if (response.statusText === "OK") {
      toast.success("User registered successfully");
    }

    return response.data;
  } catch (error) {
    const message = (
      error.response && error.response.data && error.response.data.message
    ) || error.message || error.toString();

    toast.error(message);
  }
};

// Login User
const loginUser = async (userData) => {
  try {
    const response = await axios.post(`${BACKEND_URL}/api/users/login`, userData);

    // Remove duplicate toast message

    return response.data;
  } catch (error) {
    const message = (
      error.response && error.response.data && error.response.data.message
    ) || error.message || error.toString();

    throw new Error(message); // Let the slice handle the error
  }
};

// Logout User
const logoutUser = async () => {
  try {
    const response = await axios.get(`${BACKEND_URL}/api/users/logout`);
    if (response.statusText === "OK") {
      toast.success("Logout successful");
    }
  } catch (error) {
    const message = (
      error.response && error.response.data && error.response.data.message
    ) || error.message || error.toString();

    toast.error(message);
  }
};

// Forgot Password
const forgotPassword = async (userData) => {
  try {
    const response = await axios.post(`${BACKEND_URL}/api/users/forgotpassword`, userData);
    toast.success(response.data.message);
  } catch (error) {
    const message = (
      error.response && error.response.data && error.response.data.message
    ) || error.message || error.toString();

    toast.error(message);
  }
};

// Reset Password
const resetPassword = async (userData, resetToken) => {
  try {
    const response = await axios.put(`${BACKEND_URL}/api/users/resetpassword/${resetToken}`, userData);
    
    return response.data;
  } catch (error) {
    const message = (
      error.response && error.response.data && error.response.data.message
    ) || error.message || error.toString();

    toast.error(message);
  }
};

// Get Login Status
const getLoginStatus = async () => {
  try {
    const response = await axios.get(`${BACKEND_URL}/api/users/loggedin`);
    
    return response.data;
  } catch (error) {
    const message = (
      error.response && error.response.data && error.response.data.message
    ) || error.message || error.toString();

    toast.error(message);
  }
};

// Get User Profile
const getUser = async () => {
  try {
    const response = await axios.get(`${BACKEND_URL}/api/users/getuser`);
    
    return response.data;
  } catch (error) {
    const message = (
      error.response && error.response.data && error.response.data.message
    ) || error.message || error.toString();

    toast.error(message);
  }
};

// Get All Users
const getUsers = async() => {
  try {
    const response = await axios.get(`${BACKEND_URL}/api/users/getusers`);
    
    return response.data;
  } catch (error) {
    const message = (
      error.response && error.response.data && error.response.data.message
    ) || error.message || error.toString();

    toast.error(message);
  };
}

// Update User Profile
const updateUser = async (formData) => {
  try {
    const response = await axios.patch(`${BACKEND_URL}/api/users/updateuser`, formData);
    
    return response.data;
  } catch (error) {
    const message = (
      error.response && error.response.data && error.response.data.message
    ) || error.message || error.toString();

    toast.error(message);
  }
};

// Change Password
const changePassword = async (formData) => {
  try {
    const response = await axios.patch(`${BACKEND_URL}/api/users/changepassword`, formData);
    
    return response.data;
  } catch (error) {
    const message = (
      error.response && error.response.data && error.response.data.message
    ) || error.message || error.toString();

    toast.error(message);
  }
};

// Send Verification Email
const sendVerificationEmail = async () => {
  try {
    const response = await axios.post(`${BACKEND_URL}/api/users/sendverificationemail`);
    
    return response.data.message;
  } catch (error) {
    const message = (
      error.response && error.response.data && error.response.data.message
    ) || error.message || error.toString();

    toast.error(message);
  }
};

// Verify User
const verifyUser = async (verificationToken) => {
  try {
    const response = await axios.patch(`${BACKEND_URL}/api/users/verifyuser/${verificationToken}`);
    
    return response.data.message;
  } catch (error) {
    const message = (
      error.response && error.response.data && error.response.data.message
    ) || error.message || error.toString();

    toast.error(message);
  }
};

// Delete User
const deleteUser = async (id) => {
  try {
    const response = await axios.delete(`${BACKEND_URL}/api/users/${id}`);
    
    return response.data.message;
  } catch (error) {
    const message = (
      error.response && error.response.data && error.response.data.message
    ) || error.message || error.toString();

    toast.error(message);
  }
};

// Upgrade Role
const upgradeRole = async (userData) => {
  try {
    const response = await axios.post(`${BACKEND_URL}/api/users/changerole`, userData);
    
    return response.data.message;
  } catch (error) {
    const message = (
      error.response && error.response.data && error.response.data.message
    ) || error.message || error.toString();

    toast.error(message);
  }
};

// Send Login Code
const sendLoginCode = async (email) => {
  const response = await axios.post(`${BACKEND_URL}/api/users/sendLoginCode/${email}`);

  return response.data.message;
};

// Login With Code
const loginWithCode = async (code, email) => {
  const response = await axios.post(`${BACKEND_URL}/api/users/loginWithCode/${email}`, code);

  return response.data.message;
};

const loginWithGoogle = async (userToken) => {
  const response = await axios.post(`${BACKEND_URL}/api/users/google/callback`, userToken);

  return response.data;
};

const authService = {
  sendVerificationEmail,
  changePassword, 
  updateUser,
  getUser,
  getUsers,
  getLoginStatus,
  resetPassword,
  forgotPassword,
  loginUser,
  logoutUser,
  verifyUser,
  deleteUser,
  upgradeRole,
  registerUser,
  validateEmail,
  sendLoginCode,
  loginWithCode,
  loginWithGoogle
};

export default authService;