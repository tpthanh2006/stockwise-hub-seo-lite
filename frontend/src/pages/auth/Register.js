import {toast} from "react-toastify"
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { FaTimes } from 'react-icons/fa'
import { BsCheck2All } from 'react-icons/bs'
import { TiUserAddOutline } from 'react-icons/ti'

import styles from './auth.module.scss'
import Card from '../../components/card/Card'
import authService from '../../services/authService'
import {loginWithGoogle, RESET, sendCode2FA, sendVerificationEmail, SET_LOGIN, SET_NAME} from "../../redux/features/auth/authSlice"
import Loader from "../../components/loader/Loader"
import PasswordInput from "../../components/passwordInput/PasswordInput"
import { GoogleLogin } from "@react-oauth/google"

const initialState = {
  name: "",
  email: "",
  password: "",
  password2: "",
}

const Register = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { isLoggedIn, isSuccess, isError, twoFactor } = useSelector((state) => state.auth)

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState(initialState);
  const {name, email, password, password2} = formData;
  
  const [uCase, setUCase] = useState(false);
  const [num, setNum] = useState(false);
  const [sChar, setSChar] = useState(false);
  const [passLength, setPassLength] = useState(false);

  const timesIcon = <FaTimes color="red" size={15} />;
  const checkIcon = <BsCheck2All color="green" size={15} />;

  const switchIcon = (condition) => {
    if (condition) {
      return checkIcon;
    };

    return timesIcon;
  };

  const handleInputChange = async (e) => {
    const {name, value} = e.target;
    setFormData({...formData, [name]: value});
  };

  const googleLogin = async (credentialResponse) => {
    console.log(credentialResponse);
    await dispatch(
      loginWithGoogle({ userToken: credentialResponse.credential })
    );
  }

  const register = async (e) => {
    e.preventDefault();
    
    if (!name || !email || !password) {
      return toast.error("All fields are required");
    }
    
    if (!authService.validateEmail(email)) {
      return toast.error("Please enter a valid email");
    }

    if (password.length < 6) {
      return toast.error("Passwords must be at least 6 characters long");
    }

    if (password !== password2) {
      return toast.error("Passwords do not match");
    }

    const userData = {
      name,
      email,
      password
    };

    setIsLoading(true);
    try {
      const data = await authService.registerUser(userData);
      
      await dispatch(SET_LOGIN(true));
      await dispatch(SET_NAME(data.name));
      await dispatch(sendVerificationEmail());

      navigate("/dashboard");

      setIsLoading(false);
      //console.log(data);
    } catch (error) {
      setIsLoading(false);
      console.log(error.message);
    }
    //console.log(formData);
  };

  // Handle Google login and password validation
  useEffect(() => {
    // Check for Google OAuth sign-in
    if (isSuccess && isLoggedIn) {
      navigate("/dashboard");
    }

    if (isError && twoFactor) {
      dispatch(sendCode2FA(email));
      navigate(`/loginWithCode/${email}`);
    }
    
    dispatch(RESET());

    // Check lower & upper case
    if (password.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/)) {
      setUCase(true);
    } else {
      setUCase(false);
    }

    //  Check numbers
    if (password.match(/([0-9])/)) {
      setNum(true);
    } else {
      setNum(false);
    }

    //  Check special characters
    if (password.match(/([!,%,&,@,#,$,^,*,?,_,~])/)) {
      setSChar(true);
    } else {
      setSChar(false);
    }

    //  Check password length
    if (password.length > 5) {
      setPassLength(true);
    } else {
      setPassLength(false);
    }
  }, [password, isLoggedIn, isSuccess, isError, twoFactor, email, dispatch, navigate])

  return (
    <div className={`container ${styles.auth}`}>
      {isLoading && <Loader/>}
      <Card>
        <div className={styles.form}>
          <div className="--flex-center">
            <TiUserAddOutline size={35} color="#999" />
          </div>
          <h2>Register</h2>

          <div className='--flex-center'>
            <GoogleLogin
              onSuccess={googleLogin}
              onError={() => {
                //console.log("Login Failed");
                toast.error("Login Failed");
              }}
            />
          </div>

          <br />
          <p className="--text-center --fw-bold">or</p>

          <form onSubmit={register}>
            <input
              type='text'
              placeholder='Name'
              required
              name="name"
              value={name}
              onChange={handleInputChange}
            />

            <input
              type="email"
              placeholder="Email"
              required
              name="email"
              value={email}
              onChange={handleInputChange}
            />

            <PasswordInput 
              type="password"
              placeholder="Password"
              required
              name="password"
              value={password}
              onChange={handleInputChange}
            />

            <PasswordInput 
              type="password"
              placeholder="Confirm Password"
              required
              name="password2"
              value={password2}
              onChange={handleInputChange}
              onPaste={(e) => {
                e.preventDefault();
                toast.error("Cannot paste into this field");
                return false;
              }}
            />

            {/* Password Strength */}
            <Card cardClass={styles.group}>
              <ul className="form-list"> 
                <li>
                  <span className={styles.indicator}>
                    {switchIcon(uCase)}
                    &nbsp; Lowercase & Uppercase
                  </span>
                </li>

                <li>
                  <span className={styles.indicator}>
                    {switchIcon(num)}
                    &nbsp; Numbers (0 - 9)
                  </span>
                </li>

                <li>
                  <span className={styles.indicator}>
                    {switchIcon(sChar)}
                    &nbsp; Special Characters (!@#$%^&*)
                  </span>
                </li>

                <li>
                  <span className={styles.indicator}>
                    {switchIcon(passLength)}
                    &nbsp; At least 6 Characters
                  </span>
                </li>
              </ul>
            </Card>

            <button type="submit" className="--btn --btn-primary --btn-block">
              Register
            </button>
          </form>

          <span className={styles.register}>
            <Link to='/'>Home</Link>
            <p> &nbsp; Already had an account? &nbsp;</p>
            <Link to='/login'>Login</Link>
          </span>
        </div>
      </Card>
    </div>
  );
}

export default Register