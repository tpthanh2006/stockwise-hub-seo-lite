import React from 'react'
import { Link } from 'react-router-dom';
import { RiProductHuntLine } from 'react-icons/ri';

import "./Home.scss";
import heroImg from "../../assets/inv-img.png";
import {ShowOnLogin, ShowOnLogout} from "../../components/protect/hiddenLink";

const Home = () => {
  return (
    <div className='home'>
      <nav className='container --flex-between'>
        <div className='logo'>
          <RiProductHuntLine size={35}/>
        </div>

        <ul className='home-links'>
          <ShowOnLogout>
            <li>
              <Link to='/register'>Register</Link>
            </li>
          </ShowOnLogout>

          <ShowOnLogout>
            <li>
              <button className='--btn --btn-primary'>
                <Link to='/login'>Login</Link>
              </button>
            </li>
          </ShowOnLogout>

          <ShowOnLogin>
            <li>
              <button className='--btn --btn-primary'>
                <Link to='/dashboard'>Dashboard</Link>
              </button>
            </li>
          </ShowOnLogin>
        </ul>
      </nav>

      {/* HERO SECTION */}
      <section className="container hero">
        <div className="hero-text">
          <h2>Inventory and Stock Management Solution</h2>
          <p>
            Optimize your warehouse with our real-time inventory system—efficient, seamless, and built to grow your business.
          </p>

          <div className="hero-buttons">
            <button className='--btn --btn-secondary'>
              <Link to='/dashboard'>Free Trial - 1 Month</Link>
            </button>
          </div>

          <div className="--flex-start">
            <NumberText num="14K" text="Brand Owners"/>
            <NumberText num="18K" text="Active Users"/>
            <NumberText num="600" text="Partners"/>
          </div>
        </div>

        <div className="hero-image">
          <img src={heroImg} alt="Inventory"></img>
        </div>
      </section>
    </div>
  )
}

const NumberText = ({num, text}) => {
  return (
    <div className='--mr'>
      <h3 className='--color-white'>{num}</h3>
      <p className='--color-white'>{text}</p>
    </div>
  )
};

export default Home