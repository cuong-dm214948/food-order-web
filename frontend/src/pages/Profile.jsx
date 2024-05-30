import { Container, Row, Col } from "reactstrap";
import "../styles/register.css";
import React, { useState, useEffect } from 'react';

const Profile = () =>{
  const [fullName, setFullName] = useState('');
  const [mobileNo, setMobileNo] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [csrfToken, setCsrfToken] = useState('');
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await fetch('https://localhost:5001/csrf-token', {
          credentials: 'include',
        });
        const data = await response.json();
        setCsrfToken(data.csrfToken);
      } catch (error) {
        console.error('Error fetching CSRF token:', error);
      }
    };

    fetchCsrfToken();
  }, []);

  const validateInputs = () => {
    const errors = {};

    if (!/^[A-Za-z\s]+$/.test(fullName)) {
      errors.fullName = 'Full name should contain only alphabets and spaces.';
    }

    if (!/^\d{10}$/.test(mobileNo)) {
      errors.mobileNo = 'Mobile number should contain exactly 10 digits.';
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Email is invalid.';
    }

    if (!/\d/.test(address) || !/[A-Za-z]/.test(address)) {
      errors.address = 'Address should contain both numbers and text.';
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateInputs();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      setErrors({});
      try {
        const response = await fetch('https://localhost:5001/profile', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'CSRF-Token': csrfToken,  // Include CSRF token in headers
          },
          credentials: 'include',
          body: JSON.stringify({ fullName, mobileNo, email, address }),
        });

        if (response.ok) {
          const data = await response.json();
          setSuccessMessage('Profile updated successfully!');
          console.log(data);
        } else {
          const errorData = await response.json();
          setErrors({ submit: errorData.message || 'An error occurred' });
        }
      } catch (error) {
        setErrors({ submit: 'An error occurred' });
      }
    }
  };

  return(
    <div className='w-full max-w-md mx-auto py-3 py-md-4 flex flex-col justify-center items-center h-screen'>

    <div className="title flex flex-col items-center text-center mb-3">
      <h4 className='text-5xl font-bold'>Profile</h4>
    </div>
    <Row>
                <Col lg="6" md="6" sm="12" className="m-auto text-center">
                  <form className="form__group mb-5" >
<div className="form__group">
              <input
                type="text"
                placeholder="Full name"
                className="items-center border-2 p-2 rounded-md w-full"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
              {errors.fullName && <p className="text-red-500">{errors.fullName}</p>}
              <input
                type="text"
                placeholder="Mobile No."
                className="border-2 p-2 rounded-md w-full"
                value={mobileNo}
                onChange={(e) => setMobileNo(e.target.value)}
              />
              {errors.mobileNo && <p className="text-red-500">{errors.mobileNo}</p>}
              <input
                type="text"
                placeholder="Email*"
                className="border-2 p-2 rounded-md w-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && <p className="text-red-500">{errors.email}</p>}
              <input
                type="text"
                placeholder="Address"
                className="border-2 p-2 rounded-md w-full"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
              {errors.address && <p className="text-red-500">{errors.address}</p>}
              <button className="addTOCart__btn w-full py-2 mt-3" type="submit">
                Update
              </button>
              {errors.submit && <p className="text-red-500">{errors.submit}</p>}
              {successMessage && <p className="text-green-500">{successMessage}</p>}
            </div>

    </form>

    </Col>
    </Row>
    </div>
 )
}

export default Profile;