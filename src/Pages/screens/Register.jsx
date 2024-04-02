import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/Register.css';
// import Images from './../../Images/Logo.png';
import { registerUser } from '../../Components/api/api';
import '@fortawesome/fontawesome-free/css/all.min.css';

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    password: '',
    confirmPassword: '',
    email: '',
    role: 'staff',
  });

  const [passwordsMatch, setPasswordsMatch] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // To toggle password visibility
  const [message, setMessage] = useState('');
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Check if passwords match on input change
    if (name === 'confirmPassword') {
      if (formData.password !== value) {
        setPasswordsMatch(false);
      } else {
        setPasswordsMatch(true);
      }
    }
  };

  const handleTogglePasswordVisibility = (event) => {
    event.preventDefault();  // Prevent the default behavior of the button click
    setShowPassword(!showPassword);
  };

  const handlePasswordFocus = () => {
    setIsPasswordFocused(true);
  };

  const handlePasswordBlur = () => {
    setIsPasswordFocused(false);
  };

  const handleRegistration = (event) => {
    event.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Password didn't match");
      setPasswordsMatch(false);
    } else {
      setPasswordsMatch(true);

      console.log('Registration Data:', formData);

    }
  };

  const handleOnSubmit = async (event) => {
    event.preventDefault(); // Prevent the default form submission behavior
  
    // Check if any input field is blank
    if (Object.values(formData).some(value => value.trim() === '')) {
      alert('Please fill in all the fields');
      return;
    }
  
    // Check if the email is properly formatted
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert('Invalid email format');
      return;
    }
  
    try {
      // Attempt to register the user
      const res = await registerUser(formData);
  
      // Check the status code of the response
      if (res && res.status ===   201) {
        // Successful registration
        alert('Account created successfully');
        console.log(res.data);
        setFormData({
          name: '',
          password: '',
          confirmPassword: '',
          email: '',
          role: 'staff',
        }); // Reset the form fields
      } else if (res && res.status ===   409) {
        // Conflict: Email already exists
        // alert('Email already in use. Please choose another email or log in.');
      }
    } catch (error) {
      console.error(error);
      alert('Email already in use. Please choose another email');
    }
  };
  
 
    

  return (
    // <div className="Registerni-pinakauna">
    <div>
      <form onSubmit={handleRegistration}>
        {/* <div>
          <img className="saregisterlogoustp" src={Images} alt="" />
        </div> */}
        <div className="Register-form-group">
          <p className="Registerngatxt">Add new staff account</p>
          <div className="form-field">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-field">
            <label htmlFor="email">Email:</label>
            <input
              type="text"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-field">
            <label htmlFor="password">Password:</label>
            <div className={`password-input ${isPasswordFocused ? 'focused' : ''}`}>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                onFocus={handlePasswordFocus}
                onBlur={handlePasswordBlur}
                required
              />
            </div>
          </div>
          <div className="form-field">
            <label htmlFor="confirmPassword">Confirm Password:</label>
            <div className="password-input">
              <input
                type={showPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
              />
            </div>
            <button className="showpassword" onClick={handleTogglePasswordVisibility}>
            {showPassword ? (
                <>
                <i className="fas fa-eye-slash"></i> <p className='show'>Show_password</p>
                </>
            ) : (
                <>
                <i className="fas fa-eye"></i><p className='show'>Hide_password</p>
                </>
            )}
            </button>
          </div>
          {/* <p className="naakay-account">Already have an account?</p> */}
          {/* <Link to="/" className="logsbalik">
            Login
          </Link> */}
          <button className='register' onClick={handleOnSubmit} type="submit">
            Add Account
          </button>
        </div>
      </form>
    </div>
  );
};

export default Register;
