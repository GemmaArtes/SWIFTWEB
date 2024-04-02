import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Createaccount.css';
// import Images from './../../Images/Logo.png';
import { registerUser } from '../../Components/api/api';
import '@fortawesome/fontawesome-free/css/all.min.css';

const Createaccount = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    password: '',
    confirmPassword: '',
    email: '',
    role: 'zadmin',
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

  const handleOnSubmit = async () => {
    if (formData.password === formData.confirmPassword) {
      setMessage('');
      var res = await registerUser(formData);
      alert("Account created successfully");
      navigate('/');
      console.log(res);
    } else if (formData.password !== formData.confirmPassword) {
      setMessage('');
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
          <p className="Registerngatxt">Register</p>
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
              <button className="showpassword" onClick={handleTogglePasswordVisibility}>
                {showPassword ? (
                  <i className="fas fa-eye-slash"></i>
                ) : (
                  <i className="fas fa-eye"></i>
                )}
              </button>
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
          </div>

          <p
            className={`password-do-not-match ${
              message === 'Passwords do not match' ? 'error' : 'success'
            }`}
          >
            {message}
          </p>
          {/* <p className="naakay-account">Already have an account?</p> */}
          {/* <Link to="/" className="logsbalik">
            Login
          </Link> */}
          <button className='register' onClick={handleOnSubmit} type="submit">
            Register
          </button>
        </div>
      </form>
    </div>
  );
};

export default Createaccount;
