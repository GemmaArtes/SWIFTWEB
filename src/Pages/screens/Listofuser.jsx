import React, { useState, useEffect } from 'react';
import "../css/Listofuser.css";
import { fetchAccountRequest } from '../../Components/api/api';
import {  updateData, deleteData } from "../../Components/api/api2";

const UserList = () => {
  const [accountRequests, setAccountRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");


  useEffect(() => {
    fetchAccountRequest(setAccountRequests);
  }, []);

  const handleAccept = async(id) => {
    await updateData("users", {id: id, status: 1});
    alert("Added Succesfully");
    window.location.reload();
  };

  
  const handleDecline = async (id) => {
    try {
      await deleteData("users/" + id);
      // Update the state to remove the declined user
      setAccountRequests(prevRequests => prevRequests.filter(user => user.id !== id));
      alert("Declined Succesfully");
    } catch (error) {
      console.error('Error during decline:', error);
      
    }
  };

  const handleActivate = async(id) => {
    await updateData("users", {id: id, is_active: 1});
    window.location.reload();
  };

  const handleDeactivate = async(id) => {
    await updateData("users", {id: id, is_active: 0});
    alert("Deactivate Account");
    window.location.reload();

  };

  const filteredAccountRequests = accountRequests
    .filter((user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((user) =>
      roleFilter === "" || user.role.toLowerCase().includes(roleFilter.toLowerCase())
    );

  return (
    <div className="containersaaccountrequest">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <input
          type="text"
          placeholder="Filter by role..."
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        />
      </div>

      <div className='listusertable'>
        <h2>Account Requests</h2>
        <table className="list-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAccountRequests
              .filter((e) => e.role === "staff" && !e.status)
              .map((user, index) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>
                    <button className='salistuserbutton' onClick={() => handleAccept(user.id)}>Accept</button>
                    <button className='salistuserdeclinebutton' onClick={() => handleDecline(user.id)}>Decline</button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <div>       
        <h2>Registered Accounts</h2>
        <table className="list-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAccountRequests
              .filter((e) => (e.role === "staff" && e.status) || (e.role !== "staff" && e.role !== "super-admin" && e.role !== "cashier"))
              .map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>{user.is_active ? 'Active' : 'Inactive'}</td>
                  <td>
                    {(user.is_active) ? <button className='btremove' onClick={() => handleDeactivate(user.id)}>Deactivate</button> : <button className='salistuserbutton' onClick={() => handleActivate(user.id)}>Activate</button> }
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserList;
