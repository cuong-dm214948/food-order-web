// src/utils/validation.js

export const profileValidation = (values) => {
    const errors = {};
  
    if (!values.firstName) {
      errors.firstName = 'First Name is required';
    }
    if (!values.lastName) {
      errors.lastName = 'Last Name is required';
    }
    if (!values.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
      errors.email = 'Email is invalid';
    }
    if (!values.mobile) {
      errors.mobile = 'Mobile Number is required';
    } else if (!/^\d{10}$/.test(values.mobile)) {
      errors.mobile = 'Mobile Number is invalid';
    }
  
    return errors;
  };
  