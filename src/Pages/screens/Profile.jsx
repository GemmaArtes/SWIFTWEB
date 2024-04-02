// src/components/Profile.js
import React, { useState, useEffect } from "react";
import "../css/Profile.css";
import { fetchProfile, updateProfile } from "../../Components/api/api";

function Profile() {
  // Define state variables for user information
  const [profile, setProfile] = useState({
    email: '',
    name: '',
    password: '',
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setProfile({
      ...profile,
      [name]: value,
    });
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // You can do something with the user information here (e.g., send it to a server)
      var res = await updateProfile(profile);
      console.log("User Information:", profile);
      console.log(res);
      alert("Profile saved successfully!");
  
      // Reload the web page after successful save
      window.location.reload();
    } catch (error) {
      console.error("Error saving profile:", error);
      // If there's an error, you might want to handle it or display a different alert
    }
  }


  useEffect(() => {
    // Fetch the list of categories from your API
    fetchProfile(setProfile);
  }, []);

  return (
    <div className="profilecontainer">
      <div className="profile-content">
        <h1 className="profile-title">User Profile</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-name">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="Name"
              name="name"
              // value={name}
              // onChange={(e) => setName(e.target.value)}
              value={profile.name}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-type">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={profile.email}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-password">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={profile.password}
              onChange={handleInputChange}
            />
          </div>
          {/* <div className="form-type">
            <label htmlFor="userType">User Type:</label>
            <input
              type="text"
              id="userType"
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
            />
          </div> */}
          <button type="submit">Save</button>
        </form>
      </div>
    </div>
  );
}

export default Profile;