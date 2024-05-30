import React, { useState } from 'react';
import { GoogleLogin, GoogleLogout } from 'react-google-login';

function Login() {
    const clientId = "354174433221-igoq9iflc7peqgkk168qc92gr1552ro4.apps.googleusercontent.com"
    const [showloginButton, setShowloginButton] = useState(true);
    const [showlogoutButton, setShowlogoutButton] = useState(false);
    const onLoginSuccess = (res) => {
        console.log('Login Success:', res.profileObj);
        setShowloginButton(false);
        setShowlogoutButton(true);
    };

    const onLoginFailure = (res) => {
        console.log('Login Failed:', res);
    };

    const onSignoutSuccess = () => {
        alert("You have been logged out successfully");
        console.clear();
        setShowloginButton(true);
        setShowlogoutButton(false);
    };

    return (
        <div className="login">
           <center>
               
            <div className="loginDiv">
            { showloginButton ?
                <>
                {/* <h2>Sign in With Google</h2>/ */}
                <GoogleLogin
                    clientId={clientId}                  
                    onSuccess={onLoginSuccess}
                    onFailure={onLoginFailure}
                    cookiePolicy={'single_host_origin'}
                    isSignedIn={true}
                  
                />
                </>: null}
            </div>
           </center>

            <div className="logoutDiv">
            { showlogoutButton ?
                <>

                <GoogleLogout
                    clientId={clientId}
                    buttonText="Sign Out"
                    onLogoutSuccess={onSignoutSuccess}
                    className="logoutbtn"
                >
                    Sign out
                </GoogleLogout><br/>
                
                </> : null
            }
            </div>
            
        </div>
    );
}
export default Login;