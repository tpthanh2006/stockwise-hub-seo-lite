import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { GrInsecure } from 'react-icons/gr'

import styles from './auth.module.scss'
import Card from '../../components/card/Card'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { loginWithCode, RESET, sendCode2FA } from '../../redux/features/auth/authSlice'
import Loader from '../../components/loader/Loader'

const LoginWithCode = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { email } = useParams();
  const [loginCode, setLoginCode] = useState("");
  
  const { isLoading, isLoggedIn, isSuccess} = useSelector(
    (state) => state.auth
  )

  const loginByCode = async (e) => {
    e.preventDefault();

    if (loginCode.length !== 6) {
      return toast.error("Please fill in a valid 6-digit login code");
    };

    const code = { loginCode };

    await dispatch(loginWithCode({code, email}));
  };
  
  const resendLoginCode = async () => {
    await dispatch(sendCode2FA(email));
    await dispatch(RESET());
  };

  useEffect(() => {
    if (isSuccess && isLoggedIn) {
      navigate("/dashboard");
    };

    dispatch(RESET());
  }, [isLoggedIn, isSuccess, dispatch, navigate]);

  return (
    <div className={`container ${styles.auth}`}>
      {isLoading && <Loader/>}
      <Card>
        <div className={styles.form}>
          <div className="--flex-center">
            <GrInsecure size={35} color="#999" />
          </div>
          <h2>Enter Access Code</h2>
          <form onSubmit={loginByCode}>
            <input
              type="text"
              placeholder="Access Code"
              required
              name="loginCode"
              value={loginCode}
              onChange={(e) => setLoginCode(e.target.value)}
            />
            <button type="submit" className="--btn --btn-primary --btn-block">
              Proceed To Login
            </button>
            
            <span className='--flex-center'>
              Check your email for access code
            </span>

            <div className={styles.links}>
              <p>
                <Link to='/'>- Home</Link>
              </p>

              <p onClick={resendLoginCode} className='v-link --color-primary'>
                Resend Code
              </p>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
}

export default LoginWithCode;