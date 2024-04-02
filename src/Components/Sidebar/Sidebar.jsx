import React, { useState, useEffect }  from 'react';
import { 
  FaHome, 
  FaClipboardList, 
  FaFileInvoice, 
  FaFolder, 
  FaFolderOpen,
  FaUserCircle } from 'react-icons/fa';
import { BiLogOut,BiSolidUserDetail } from 'react-icons/bi';
import { NavLink } from 'react-router-dom';
import './sidebar.css';
import { fetchProfile} from "../api/api";
import { MdOutlineInventory } from "react-icons/md";
import { LuFileText } from "react-icons/lu";
import { BiSolidCategory } from "react-icons/bi";
import { TbReportAnalytics } from "react-icons/tb";
import { IoPersonAddSharp } from "react-icons/io5";


const handleLogout = (event) => {
  if (!window.confirm('Are you sure you want to logout?')) {
    // Prevent the default navigation behavior if the user clicks "Cancel"
    event.preventDefault();
  } else {
    // Perform the actual logout action here
    // For example, redirecting to the login page or clearing authentication tokens
    // window.location.href = '/login'; // Replace this with your actual logout logic
  }
};


  const menuItem = [
    {
      path: '/dashboard/home',
      name: 'Dashboard',
      icon: <FaHome />,
    },
    {
      path: '/dashboard/order',
      name: 'Order',
      icon: <FaClipboardList />,
    },
    {
      path: '/dashboard/reports',
      name: 'Reports',
      icon: <TbReportAnalytics />,
    },
    {
      path: '/dashboard/inventory',
      name: 'Inventory',
      icon: <MdOutlineInventory />,
    },
    {
      path: '/dashboard/sales',
      name: 'Sales',
      icon: <LuFileText />,
    },
    {
      path: '/dashboard/categories',
      name: 'Categories',
      icon: <BiSolidCategory />,
    },
    {
      path: '/dashboard/ImageUploadForm',
      name: 'Item',
      icon: <FaClipboardList />,
    },
    {
      path: '/dashboard/item',
      name: 'Stocks',
      icon: <FaFolderOpen />,
    },
    {
      path: '/dashboard/reference',
      name: 'Reference',
      icon: <FaFolderOpen />,
    },
    {
      path: '/dashboard/profile',
      name: 'Profile',
      icon: <FaUserCircle />,
    },
    {
      path:'/dashboard/Add_Account',
      name: 'Add account',
      icon: <IoPersonAddSharp />,
      
    },
    {
      path: '/dashboard/Listofuser',
      name: 'List of Users',
      icon: <BiSolidUserDetail />,
    },
    {
      path: '/',
      name: 'Logout',
      icon: <BiLogOut />,
    },
  ];
  
  const Sidebar = ({ children }) => {
    // Define state variables for user information
    const [profile, setProfile] = useState({ roles: [{}] });
  
    useEffect(() => {
      // Fetch the list of categories from your API
      fetchProfile(setProfile);
    }, []);
  
    const filteredMenuItems = menuItem.filter(
      (e) =>
        (profile.roles[0].slug === 'super-admin' &&
          (e.name === 'List of Users' || e.name === 'Add staff acc')) ||
        (e.name !== 'List of Users' && e.name !== 'Add staff acc')
    );
  
    return (
      <div className="container">
        <div className="sidebar">
          <div className='Swiftorderlogo'></div>
          <div className="top_section"></div>
          {filteredMenuItems.map((item, index) => (
             <NavLink
             to={item.path}
             key={index}
             className="link"
             onClick={item.name === 'Logout' ? handleLogout : undefined}
           >
              <div className="icon">{item.icon}</div>
              <div className="link_text">{item.name}</div>
            </NavLink>
          ))}
        </div>
        <main className="main-content">{children}</main>
      </div>
    );
  };
  
  export default Sidebar;