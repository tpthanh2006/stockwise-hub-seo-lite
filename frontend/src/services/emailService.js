import axios from "axios"

// Send Automated Email
const sendAutomatedEmail = async (emailData) => {
  const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/users/sendAutomatedEmail`, emailData);
  return response.data.message;
};

const emailService = {
  sendAutomatedEmail,
};

export default emailService;