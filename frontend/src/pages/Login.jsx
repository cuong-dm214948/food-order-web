import React from "react";
import { useState, useEffect} from 'react';
// import AuthContext from "./context/AuthProvider";
import axios from 'axios';
import Helmet from "../components/Helmet/Helmet";
import CommonSection from "../components/UI/common-section/CommonSection";
import { Container, Row, Col } from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import "../styles/login.css";

const Login = () => {
  const [user, setUser] = useState('');
  const [pwd, setPwd] = useState('');

  const navigateTo = useNavigate();

  const[loginStatus, setLoginStatus] =useState(false)
  const[statusHolder, setStatusHolder] = useState('message')

  axios.defaults.withCredentials = true;
  const handleSubmit = (e) => {
      e.preventDefault();   
      axios.post('http://localhost:5001/login',{
      username: user,
      password: pwd
    })
    .then((res)=>{
      console.log(res)
      if(res.data.Status === 'Success'){
        navigateTo('/')
        setLoginStatus(true)
      }

      else{
        alert("Error")
      }
    })
    .then(err => console.log(err));
  }

  useEffect(()=>{
    if (loginStatus !== ''){
      setStatusHolder('showMessage')
      setTimeout(()=>{
        setStatusHolder('message')
      }, 4000)
    }

  }, [loginStatus])

  return (
    <Helmet title="Login">
      <CommonSection title="Login" />
      <section>
        <Container>
          <Row>
            <Col lg="6" md="6" sm="12" className="m-auto text-center">         
                      <section>
                          {/* <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p> */}
                          <form className="form mb-5" onSubmit={handleSubmit}>

                            <span clssname={statusHolder}>{loginStatus} </span>
                            <div className="form__group">
                                <label htmlFor="username">Username:</label>
                                <input
                                    type="text"
                                    placeholder="username"
                                    // id="username"
                                    // ref={userRef}
                                    // autoComplete="off"
                                    onChange={(e) => setUser(e.target.value)}
                                    // value={user}
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
                                    // value={pwd}
                                    required
                                />
                            </div>

                            <div>
                                <p>Oauthen2</p>
                            </div>

                            <button type="submit" className="addTOCart__btn">Sign In</button>
                          </form>
                      </section>
                  {/* /)}
              </> */}

              <Link to="/register">CAN'T SIGN IN? CREATE ACCOUNT</Link>
              {/* //edit */}
            </Col>
          </Row>
        </Container>
      </section>
    </Helmet>
  );
};

export default Login;