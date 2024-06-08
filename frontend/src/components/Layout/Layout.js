import React, { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import UserLayout from "./UserLayout.js";
import AdminLayout from "./AdminLayout.js";
import { signInSuccess, signInFailure } from '../../store/user/userSlice.js';

const Layout = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user.currentUser);

  const fetchUser = async () => {
    try {
      const url = `http://localhost:5001/auth/google/success`;
      const { data } = await axios.get(url, { withCredentials: true });
      if (data && data.user) {
        dispatch(signInSuccess(data.user));
      }
    } catch (err) {
      dispatch(signInFailure(err.message));
      console.log(err);
    }
  };

  const checkAuthStatus = async () => {
    try {
      const { data } = await axios.get('http://localhost:5001/login', { withCredentials: true });
      if (data.Status === "Success" && data.username) {
        dispatch(signInSuccess(data.username));
      }
    } catch (err) {
      dispatch(signInFailure(err.message));
      console.log(err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchUser();
      await checkAuthStatus();
    };
    fetchData();
  }, [dispatch, fetchUser, checkAuthStatus]);
  

  return (
    <>
      {currentUser && currentUser === 'admin' ? (
        <AdminLayout />
      ) : (
        <UserLayout />
      )}
    </>
  );
};

export default Layout;
