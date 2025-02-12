import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Images from './../../Images/Logo.png';
import './Login.css';
import { loginUser } from '../../Components/api/api';


function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [rememberMe, setRememberMe] = useState(false); // State for "Remember Me" checkbox

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleRememberMeChange = () => {
    setRememberMe(!rememberMe);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    loginUser(formData, navigate)


    // Perform your login logic here using the formData state

    // After successful login, check if "Remember Me" is selected
    if (rememberMe) {
      // Save user data for remembering (e.g., using cookies or local storage)
    }

    
  };

  return (
    <div className="login-background login-pinakauna">
      <form onSubmit={handleSubmit}>
        {/* <div>
          <img className="maonianglogosaustp" src={Images} alt="" />
        </div> */}
        <div className="form-group">
          <p className="loginngatxt">Login</p>
          <label htmlFor="email">Email:</label>
          <input
            type="text"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />

          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
          <button className='login' type="submit">Login</button>

          {/* <p className='forgotpass'>Don't have an account please click the </p>
          <Link to="/register" className="reg"> 
            Register
          </Link> */}

          {/* <p className='forgotpass'>To reset your password please click the </p>
          <Link to="/forgotpass" className="forg">
            Forgot Password 
          </Link>
          */}

          
        </div>
      </form>
    </div>
  );
}

export default Login;
