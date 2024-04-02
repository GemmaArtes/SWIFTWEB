import React from "react"; 
import { Routes, Route } from "react-router-dom";
import Home from '../screens/Home';
import Order from '../screens/Order';
import Reports from '../screens/Reports';
import Categories from '../screens/Categories';
import AddCategories from '../screens/AddCategories';
import Item from '../screens/Item';
import Profile from '../screens/Profile';
import Sidebar from "../../Components/Sidebar/Sidebar";
import Header from "../../Components/Header/Header";
import Listofuser from "../../Pages/screens/Listofuser";
import Stocks from "../screens/Stocks";
import ReferencePage from "../screens/ReferencePage";
import Inventory from "../screens/Inventory";
import Sales from "../../Pages/screens/Sales";
import Register from "../screens/Register";
import './dashboard.css';
import ImageUploadForm from "../screens/ImageUploadForm";




function Dashboard() {

 return (
    <div className="dashboardheader">
      <Header /> {/* Add the Navbar component at the top */}
      <div className="dashboard-container">  
        <Sidebar />
        <div className="dashboard-background">
          <div className="dashcontainer">
            <div className="dashboard">
              
                <Routes>
                 <Route path="" element={<Home />} />
                 <Route path="home" element={<Home />} />
                 <Route path="order" element={<Order />} />
                 <Route path="reports" element={<Reports />} />
                 <Route path="categories" element={<Categories />} />
                 <Route path="addcategories" element={<AddCategories />} />
                 <Route path="ImageUploadForm" element={<ImageUploadForm/>} />
                 <Route path="item" element={<Item />} />
                 <Route path="profile" element={<Profile />} />
                 <Route path="reference" element={<ReferencePage />} />
                 <Route path="Listofuser" element={<Listofuser />} />
                 <Route path="stocks/:itemId" element={<Stocks/>} />
                 <Route path="inventory" element={<Inventory/>} />
                 <Route path="sales" element={<Sales/>} />
                 <Route path="Add_Account" element={<Register/>} />
                </Routes>
            
            </div>
          </div>
        </div>
      </div>
    </div>
 );
}

export default Dashboard;
