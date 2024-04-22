import React from "react";
import { useRef, useState, useEffect, useContext } from 'react';
// import AuthContext from "./context/AuthProvider";
import axios from 'axios';
import Helmet from "../components/Helmet/Helmet";
import CommonSection from "../components/UI/common-section/CommonSection";
import { Container, Row, Col } from "reactstrap";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
    // const[values, setValues]= useState({
    //     username:'',
    //     password:''
    // })
  //const { setAuth } = useContext(AuthContext);
//   const userRef = useRef();
//   const errRef = useRef();

  const [user, setUser] = useState('');
  const [pwd, setPwd] = useState('');
//   const [errMsg, setErrMsg] = useState('');
//   const [success, setSuccess] = useState(false);

//   useEffect(() => {
//       userRef.current.focus();
//   }, [])

//   useEffect(() => {
//       setErrMsg('');
//   }, [user, pwd])
  const navigate = useNavigate();
//   axios.default.withCredential = true;
  const handleSubmit = (e) => {
      e.preventDefault();   
      axios.post('http://localhost:8081/login',{
      username: user,
      password: pwd
    })
    .then((res)=>{
      console.log(res)
    })
    //  })
    //       .then(res => {
    //         if (res.data.Status === "Success") {
    //             navigate('/')
    //         } else {
    //             alert(res.data.Error)
    //         }
    //     })
    //     .then (err => console.log(err));
//           console.log(JSON.stringify(response?.data));
//           //console.log(JSON.stringify(response));
//           const accessToken = response?.data?.accessToken;
//           const roles = response?.data?.roles;
//           //setAuth({ user, pwd, roles, accessToken });
//           setUser('');
//           setPwd('');
//           setSuccess(true);    
  }

  return (
    <Helmet title="Login">
      <CommonSection title="Login" />
      <section>
        <Container>
          <Row>
            <Col lg="6" md="6" sm="12" className="m-auto text-center">         
              {/* <>
                  {success ? (
                      <section>
                          <h1>You are logged in!</h1>
                          <br />
                          <p>
                              <a href="#">Go to Home</a>
                          </p>
                      </section>
                  ) : ( */}
                      <section>
                          {/* <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p> */}
                          <form className="form mb-5" onSubmit={handleSubmit}>

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

                            <button type="submit" className="addTOCart__btn">Sign In</button>
                          </form>
                      </section>
                  {/* /)}
              </> */}
              <div>
                  <p>Oauthen2</p>
              </div>
              <Link to="/register">CAN'T SIGN IN? CREATE ACCOUNT</Link>
            </Col>
          </Row>
        </Container>
      </section>
    </Helmet>
  );
};

export default Login;