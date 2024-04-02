import React from "react";
import { Routes, Route } from "react-router-dom";
import Cashorder from '../screens/Cashorder';
// import Cashrental from '../Cashierpage/Cashrental';
import Cashsidebar from "./Cashsidebar/Cashsidebar";
import Header from "../../Components/Header/Header";
import './cashier.css';
import ReferencePage from "../screens/ReferencePage";

function Cashdashboard() {
    return (
      <div className="cashierheader">
        <Header />
        <div className="cashier-container">
          <Cashsidebar />
          <div className="cashier-background">
            <div className="cashcontainer">
              <div className="cashier" style={{width: "100%"}}>
                <Routes>
                  <Route path="" element={<Cashorder />} />
                  <Route path="cashorder" element={<Cashorder />} />
                  <Route path="reference" element={<ReferencePage />} />
                  {/* <Route path="cashrental" element={<Cashrental />} /> */}
                </Routes>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
}

export default Cashdashboard;
