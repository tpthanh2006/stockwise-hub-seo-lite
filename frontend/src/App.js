import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {ToastContainer} from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";

import Home from "./pages/Home/Home";
import Login from "./pages/auth/Login";
import Reset from "./pages/auth/Reset";
import Forgot from "./pages/auth/Forgot";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/dashboard/Dashboard";
import Sidebar from "./components/sidebar/Sidebar";
import Layout from "./components/layout/Layout";
import authService from "./services/authService";
import { SET_LOGIN } from "./redux/features/auth/authSlice";
import AddProduct from "./pages/addProduct/AddProduct";
import ProductDetail from "./components/product/productDetail/ProductDetail";
import EditProduct from "./pages/editProduct/EditProduct";
import Profile from "./pages/profile/Profile";
import EditProfile from "./pages/profile/EditProfile";
import Contact from "./pages/contact/Contact";
import LoginWithCode from "./pages/auth/LoginWithCode";
import Verify from "./pages/auth/Verify";
import UserList from "./pages/userList/UserList";

axios.defaults.withCredentials = true;
axios.defaults.headers.common['Content-Type'] = 'application/json';

function App() {
  const dispatch = useDispatch();

  // Fix only "DASHBOARD" shown even while refreshing page after login
  useEffect(() => {
    async function loginStatus() {
      const status = await authService.getLoginStatus();
      dispatch(SET_LOGIN(status));
    };

    loginStatus();
  }, [dispatch]);

  return (
    <BrowserRouter>
      <ToastContainer/>
      <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/register" element={<Register/>} />
          <Route path="/forgot" element={<Forgot/>} />
          <Route path="/resetpassword/:resetToken" element={<Reset/>} />
          <Route path="/loginwithcode/:email" element={<LoginWithCode/>} />
          
          <Route path="/dashboard" element={
              <Sidebar>
                <Layout>
                  <Dashboard/>
                </Layout>
              </Sidebar>
            }
          />

          <Route path="/add-product" element={
              <Sidebar>
                <Layout>
                  <AddProduct/>
                </Layout>
              </Sidebar>
            }
          />

          <Route path="/product-detail/:id" element={
              <Sidebar>
                <Layout>
                  <ProductDetail />
                </Layout>
              </Sidebar>
            }
          />

          <Route path="/edit-product/:id" element={
              <Sidebar>
                <Layout>
                  <EditProduct />
                </Layout>
              </Sidebar>
            }
          />

          <Route path="/profile" element={
              <Sidebar>
                <Layout>
                  <Profile />
                </Layout>
              </Sidebar>
            }
          />

          <Route path="/edit-profile" element={
              <Sidebar>
                <Layout>
                  <EditProfile />
                </Layout>
              </Sidebar>
            }
          />

          <Route path="/verify/:verificationToken" element={
              <Sidebar>
                <Layout>
                  <Verify />
                </Layout>
              </Sidebar>
            }
          />

          <Route path="/contact-us" element={
              <Sidebar>
                <Layout>
                  <Contact />
                </Layout>
              </Sidebar>
            }
          />

          <Route path="/users" element={
              <Sidebar>
                <Layout>
                  <UserList />
                </Layout>
              </Sidebar>
            }
          />
        </Routes>
      </GoogleOAuthProvider>
    </BrowserRouter>
  );
}

export default App;
