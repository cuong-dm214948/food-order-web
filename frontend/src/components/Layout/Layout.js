import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../Header/Header.jsx";
import Footer from "../Footer/Footer.jsx";
import Routes from "../../routes/Routers";
import Carts from "../UI/cart/Carts.jsx";
import { useSelector } from "react-redux";
import Dashboard from "../Dashboard.jsx";

const Layout = () => {
  const showCart = useSelector((state) => state.cartUi.cartIsVisible);
  const [userName, setUserName] = useState('');

  const getUser = async () => {
    try {
      const url = `http://localhost:5001/auth/google/success`;
      const { data } = await axios.get(url, { withCredentials: true });
      console.log(data)
      if (data && data.user && data.user.givenName) {
        setUserName(data.user.givenName);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const checkAuthStatus = async () => {
    try {
      const { data } = await axios.get('http://localhost:5001/login', { withCredentials: true });
      console.log(data)
      if (data.Status === "Success" && data.username) {
        setUserName(data.username);
     
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await getUser();
      await checkAuthStatus();
      
    };
    fetchData();
  }, []);

  return (
    <div className="d-flex flex-column vh-100 justify-content-between">
          {userName === 'admin' ? (
            <Routes path="/dashboard" element={<Dashboard />} />
          ) : (
            <div className="d-flex flex-column vh-100 justify-content-between">
              <Header userName={userName} />
              {showCart && <Carts />}
              <div>
                <Routes />
              </div>
              <Footer />
            </div>
          )}
    </div>

  );
};

export default Layout;
