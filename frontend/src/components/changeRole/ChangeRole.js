import { toast } from 'react-toastify'
import { useState } from 'react'
import { FaCheck } from 'react-icons/fa'
import { useDispatch } from 'react-redux'

import {
  getUsers,
  upgradeUser 
} from '../../redux/features/auth/authSlice'
import {
  automateEmail,
  EMAIL_RESET,
} from "../../redux/features/email/emailSlice"

const ChangeRole = ({_id, email}) => {
  const dispatch = useDispatch();
  const [userRole, setUserRole] = useState("");

  // Change User Role
  const changeUserRole = async (e) => {
    e.preventDefault();

    if (!userRole) {
      toast.error("Please select a role");
    }

    const userData = {
      id: _id,
      role: userRole,
    };

    const emailData = {
      subject: "User Role Changed - Inventory Pilot",
      send_to: email,
      reply_to: "williamtran26@outlook.com",
      templateId: "d-dab8cf7a2ab744d68be8a7bb4f010e2a",
      url: "/login",
    };

    await dispatch(upgradeUser(userData));
    await dispatch(automateEmail(emailData));
    await dispatch(getUsers());
    dispatch(EMAIL_RESET());
  };

  return (
    <div className='sort'>
      <form className='--flex-start' onSubmit={(e) => changeUserRole(e, _id, userRole)}>
        <select value={userRole} onChange={(e) => setUserRole(e.target.value)}>
          <option value="">-- Select --</option>
          <option value="subscriber">Subscriber</option>
          <option value="staff">Staff</option>
          <option value="admin">Admin</option>
          <option value="suspended">Suspended</option>
        </select>

        <button className='--btn --btn-primary'>
          <FaCheck size={15} />
        </button>
      </form>
    </div>
  );
}

export default ChangeRole