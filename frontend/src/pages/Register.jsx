import React, { useRef, useState, useEffect } from "react";
import Helmet from "../components/Helmet/Helmet";
import CommonSection from "../components/UI/common-section/CommonSection";
import { Container, Row, Col } from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from 'axios';
import "../styles/register.css";

const USER_REGEX = /^[a-z]{2,24}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

const Register = () => {
    const [name, setName] = useState('');
    const [user, setUser] = useState('');
    const [pwd, setPwd] = useState('');
    const navigate =useNavigate()
    const handleSubmit = (e) => {
        e.preventDefault();
        // const v1 = USER_REGEX.test(user);
        // const v2 = PWD_REGEX.test(pwd);
        // if (!v1 || !v2) {
        //     setErrMsg("Invalid Entry");
        //     return;
        // }
        axios.post('http://localhost:5001/register',{
          name: name,
          username: user,
          password: pwd
        })
        .then(res => {
            if (res.data.Status === "Success") {
                navigate('/login')
            } else {
                alert("Error")
            }
        })
        
        //     setSuccess(true);
        //     setUser('');
        //     setPwd('');
        //     setMatchPwd('');
        
    }
    


  return (
    <Helmet title="Signup">
      <CommonSection title="Signup" />
      {/* <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p> */}
                    
              
      <section>
        <Container>
          <Row>
            <Col lg="6" md="6" sm="12" className="m-auto text-center">
              <form className="form mb-5" onSubmit={handleSubmit}>
                <div className="form__group">
                    <label htmlFor="name">
                                Name:                           
                    </label>
                    <input
                                type="text"
                                name='name'
                                id="username"
                                //ref={userRef}
                                autoComplete="off"
                                onChange={(e) => setName( e.target.value)}
                                //value={user}
                                placeholder="Enter name"
                                required
                                aria-describedby="uidnote" 
                    />
                </div>

                <div className="form__group">
                    <label htmlFor="username">
                                Username:
                                {/* <FontAwesomeIcon icon={faCheck} className={validName ? "valid" : "hide"} />
                                <FontAwesomeIcon icon={faTimes} className={validName || !user ? "hide" : "invalid"} /> */}
                    </label>
                    <input
                                type="text"
                                // id="username"
                                // ref={userRef}
                                // autoComplete="off"
                                onChange={(e) => setUser(e.target.value)}
                                // value={user}
                                placeholder="Enter username"
                                name ="username"
                                // required
                                // aria-invalid={validName ? "false" : "true"}
                                // aria-describedby="uidnote"
                                // onFocus={() => setUserFocus(true)}
                                // onBlur={() => setUserFocus(false)}
                    />

                    {/* <p id="uidnote" className={userFocus && user && !validName ? "instructions" : "offscreen"}>
                        <FontAwesomeIcon icon={faInfoCircle} />
                        
                        Letters, (2,24)
                    </p> */}
                </div>

                <div className="form__group">
                        <label htmlFor="password">
                            Password:
                            {/* <FontAwesomeIcon icon={faCheck} className={validPwd ? "valid" : "hide"} />
                            <FontAwesomeIcon icon={faTimes} className={validPwd || !pwd ? "hide" : "invalid"} /> */}
                        </label>
                        <input
                            type="password"
                            // id="password"
                            onChange={(e) => setPwd(e.target.value)}
                            // value={pwd}
                            placeholder="Enter password"
                            name = 'password'
                            // required
                            // aria-invalid={validPwd ? "false" : "true"}
                            // aria-describedby="pwdnote"
                            // onFocus={() => setPwdFocus(true)}
                            // onBlur={() => setPwdFocus(false)}
                        />
                        {/* <p id="pwdnote" className={pwdFocus && !validPwd ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            8 to 24 characters.<br />
                            Must include uppercase and lowercase letters, number and special character.<br />
                            Allowed special characters: <span aria-label="exclamation mark">!</span> <span aria-label="at symbol">@</span> <span aria-label="hashtag">#</span> <span aria-label="dollar sign">$</span> <span aria-label="percent">%</span>
                        </p> */}
                </div>

                {/* <div className="form__group">
                        <label htmlFor="confirm_pwd">
                            Confirm Password:
                            <FontAwesomeIcon icon={faCheck} className={validMatch && matchPwd ? "valid" : "hide"} />
                            <FontAwesomeIcon icon={faTimes} className={validMatch || !matchPwd ? "hide" : "invalid"} />
                        </label>
                        <input
                            type="password"
                            placeholder="Enter password again"
                            id="confirm_pwd"
                            onChange={(e) => setMatchPwd(e.target.value)}
                            value={matchPwd}
                            required
                            aria-invalid={validMatch ? "false" : "true"}
                            aria-describedby="confirmnote"
                            onFocus={() => setMatchFocus(true)}
                            onBlur={() => setMatchFocus(false)}
                        />
                        <p id="confirmnote" className={matchFocus && !validMatch ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            Must match the first password input field.
                        </p>

                        <button disabled={!validName || !validPwd || !validMatch ? true : false}>Sign Up</button>
                </div> */}
                <button>Sign Up</button>
              </form>
              <Link to="/login">Already have an account? Login</Link>
            </Col>
          </Row>
        </Container>
      </section>
    </Helmet>
  );
};

export default Register;