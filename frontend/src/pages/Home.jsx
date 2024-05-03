import React from "react";
import Helmet from "../components/Helmet/Helmet.js";
import { Container, Row, Col } from "reactstrap";
import { useRef, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import guyImg from "../assets/images/delivery-guy.png";
import "../styles/hero-section.css";
import { Link, useNavigate } from "react-router-dom";
const Home = () => {
  const navigate = useNavigate();
  const [auth, setAuth] = useState(false)
  const [message, setMessage] = useState('')
  const [name, setName] =useState('')
  
  useEffect(()=>{
    axios.get('/')
        .then(res => {
            if (res.data.Status === "Success") {
              setAuth(true)  
              setName(res.data.name)
              navigate('/login')
            } else {
              setAuth(false)
              setMessage(res.data.Error)
            }
        })
        .then (err => console.log(err));
  })
  return (
    <Helmet title="Home">
        <section>
          <Container>
            <Row>
              <Col lg="6" md="6">
                <div className="hero__content">
                  <h5 className="mb-3">Easy order & fast delivery</h5>
                  <h1 className="mb-4 hero__title">
                    <span>Enjoy</span> your favorite Pizza
                  </h1>

                  <button className="order__btn d-flex align-items-center justify-content-between ">
                    <Link to="/menu">
                      Menu <i className="ri-arrow-right-s-line"></i>
                    </Link>
                  </button>
                </div>
              </Col>

              <Col lg="6" md="6">
                <div className="hero__img">
                  <img src={guyImg} alt="delivery-guy" className="w-100" />
                </div>
              </Col>
            </Row>
          </Container>
        </section>
    </Helmet>
  );
};

export default Home;
