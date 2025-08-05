import React from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import { SpinnerImg } from '../../components/loader/Loader';
import { RESET, verifyUser } from '../../redux/features/auth/authSlice';

const Verify = () => {
  const dispatch = useDispatch();
  const { isLoading } = useSelector(
    (state) => state.auth
  )
  const { verificationToken } = useParams();

  const verifyAccount = async () => {
    await dispatch(verifyUser(verificationToken));
    await dispatch(RESET());
  };

  return (
    <section>
      {isLoading && <SpinnerImg />}

      <div className='--center-all'>
        <h2>Account Verification</h2>
        <p>To verify your account, please click the button below...</p>
        <br />

        <button className='--btn --btn-primary' onClick={verifyAccount}>
          Verify Account
        </button>
      </div>
    </section>
  )
}

export default Verify