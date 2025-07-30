import React from 'react'
import Layout from '../../components/layout/Layout'
import { Link } from "react-router-dom";
import "./Home.scss";
import loginImg from "../../assets/login.svg";

const Home = () => {
  return (
    <Layout>
      <section className='container hero'>
        <div className="hero-text">
          <h2>Ultimate MERN Stack Authentication System</h2>
          <p>Learn and Master Authentication & Authorization using MERN Stack</p>
          <p>Implement User Registration, Login, Password Reset, Social Login, User Permission, Email Notifications, etc.</p>
          <div className='hero-buttons --flex-start'>
            <button className='--btn --btn-danger'>
              <Link to="/register">Register</Link>
            </button>
            <button className='--btn --btn-primary'>
              <Link to="/login">Login</Link>
            </button>
          </div>
        </div>

        <div className="hero-image">
          <img src={loginImg} alt="Auth"/>
        </div>
      </section>
    </Layout>
  )
}

export default Home