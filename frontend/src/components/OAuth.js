import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./OAuth.css";
import { Link } from "react-router-dom";
import google from "../assets/images/google.png"

function OAuth() {
    const [user, setUser] = useState(null);

    const handleLogin =  () => {
		window.open(
			`http://localhost:5001/auth/google/callback`,
			"_self"
		);
	};

    return (
        <div className="login">
            <center>
                <div className="loginDiv">
                    {!user ? (
                        <>
                           	<button className="google_btn" onClick={handleLogin}>
                                <img src={google} alt="google" />
                                <span>Sing in with Google</span>
                            </button>
                        </>
                    ) : (
                        <div>
                        </div>
                    )}
                </div>
            </center>
        </div>
    );
}

export default OAuth;
