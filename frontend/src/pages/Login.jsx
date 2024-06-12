import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import ReCAPTCHA from "react-google-recaptcha";
import Helmet from "../components/Helmet/Helmet";
import CommonSection from "../components/UI/common-section/CommonSection";
import { Container, Row, Col } from "reactstrap";
import OAuth from '../components/oauth/OAuth';
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from '../store/user/userSlice';
import { cartActions } from '../store/shopping-cart/cartSlice'; // Import clearCart action
import "../styles/login.css";

const Login = () => {
  const [user, setUser] = useState('');
  const [pwd, setPwd] = useState('');
  const [captchaToken, setCaptchaToken] = useState('');
  const [csrfToken, setCsrfToken] = useState('');
  const dispatch = useDispatch();
  const navigateTo = useNavigate();
  const { loading, error } = useSelector((state) => state.user);
  const [loginStatus, setLoginStatus] = useState('');
  const [statusHolder, setStatusHolder] = useState('message');

  useEffect(() => {
    // Fetch CSRF token when the component mounts
    const fetchCsrfToken = async () => {
      try {
        const response = await axios.get('http://localhost:5001/csrf-token', { withCredentials: true });
        setCsrfToken(response.data.csrfToken);
      } catch (err) {
        console.error('Error fetching CSRF token', err);
      }
    };

    fetchCsrfToken();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!captchaToken) {
      setLoginStatus('Please complete the CAPTCHA');
      return;
    }

    dispatch(signInStart());
    try {
      const res = await axios.post('http://localhost:5001/auth/login', {
        username: user,
        password: pwd,
        captchaToken: captchaToken,
      }, {
        headers: {
          'CSRF-Token': csrfToken
        },
        withCredentials: true,
      });

      if (res.data.Status === 'Success') {
        const userData = {
          username: user,
          role: res.data.Role.role,
          token: res.data.token,
          refreshToken: res.data.refreshToken
        };

        // Dispatch clearCart action on login
        dispatch(cartActions.clearCart());

        dispatch(signInSuccess(userData.username));

        if (res.data.Role.role === "user") {
          setLoginStatus('Login successful!');
          navigateTo('/');
        } else {
          setLoginStatus('Admin login successful!');
          navigateTo('/dashboard');
        }
        window.location.reload(true);
      } else {
        console.log("data", res.data);
        dispatch(signInFailure(res.data));
        setLoginStatus('Invalid username or password!');
      }
    } catch (err) {
      console.log(err);
      dispatch(signInFailure(err));
      setLoginStatus('Invalid username or password!');
      console.error(err);
    }
  };

  useEffect(() => {
    if (loginStatus !== '') {
      setStatusHolder('showMessage');
      const timer = setTimeout(() => {
        setStatusHolder('message');
        setLoginStatus('');
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [loginStatus]);

  const onCaptchaChange = (token) => {
    setCaptchaToken(token);
  };

  return (
    <Helmet title="Login">
      <CommonSection title="Login" />
      <section>
        <Container>
          <Row>
            <Col lg="6" md="6" sm="12" className="m-auto text-center">
              <form className="form" onSubmit={handleSubmit}>
                <span className={statusHolder}>{loginStatus}</span>
                <div className="form__group">
                  <label htmlFor="username">Username:</label>
                  <input
                    type="text"
                    placeholder="username"
                    onChange={(e) => setUser(e.target.value)}
                    required
                  />
                </div>

                <div className="form__group">
                  <label htmlFor="password">Password:</label>
                  <input
                    type="password"
                    id="password"
                    placeholder="password"
                    onChange={(e) => setPwd(e.target.value)}
                    required
                  />
                </div>

                <div className="form__group">
                  <ReCAPTCHA
                    sitekey="6Le4pd8pAAAAAHcnu7JFxKnY3tbhm6r2jH_hcMms"
                    onChange={onCaptchaChange}
                  />
                </div>

                <button type="submit" className="addTOCart__btn" disabled={loading}>
                  {loading ? 'Signing In...' : 'Sign In'}
                </button>
              </form>

              <OAuth />
              <Link to="/register">CAN'T SIGN IN? CREATE ACCOUNT</Link>
              <p className="text-red-700 mt-5">
                {error ? error.message || 'Something went wrong!' : ''}
              </p>
            </Col>
          </Row>
        </Container>
      </section>
    </Helmet>
  );
};

export default Login;
