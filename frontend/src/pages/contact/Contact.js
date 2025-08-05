import axios from 'axios'
import { toast } from 'react-toastify'
import { useState } from 'react'
import {GoLocation} from 'react-icons/go'
import {FaPhoneAlt, FaEnvelope} from 'react-icons/fa'

import './Contact.scss'
import Card from '../../components/card/Card'

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const Contact = () => {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const data = {
    subject,
    message
  }

  const sendEmail = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${BACKEND_URL}/api/contactus`, data, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      setSubject("");
      setMessage("");

      toast.success(response.data.message); // Fix to access message from response.data
    } catch (error) {
      toast.error(error.message);
    };
  };

  return (
    <div className='contact'>
      <h3 className='--mt'>Contact Us</h3>
      
      <div className='section'>
        <form onSubmit={sendEmail}>
          <Card cardClass='card'>
            <label>Subject <span style={{ color: "red "}}>*</span></label>
            <input
              type="text"
              name="subject"
              placeholder='Subject'
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />

            <label>Message <span style={{ color: "red "}}>*</span></label>
            <textarea
              rows="10"
              cols="30"
              name="message"
              placeholder='Let us know your thoughts'
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            ></textarea>

            <button className='--btn --btn-primary'>
              Send Message
            </button>
          </Card>
        </form>

        <div className='details'>
          <Card cardClass={"card2"}>
            <h3>Our Contact Information</h3>
            <p>Fill the form or contact us via other channels listed below</p>

            <div className="icons">
              <span>
                <FaPhoneAlt />
                <p>(504)-666-8888</p>
              </span>
              <span>
                <FaEnvelope />
                <p>tpt06@gmail.com</p>
              </span>
              <span>
                <GoLocation />
                <p>New Orleans, United States</p>
              </span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Contact