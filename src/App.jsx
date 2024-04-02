
import React, { useState, useEffect } from 'react';

import { HashRouter , Route, Routes } from 'react-router-dom';
import Login from './Authentication/Login/Login';
// import Createaccount from "./Authentication/Createaccounts/createaccount";
import Dashboard from './Pages/Dashboard/Dashboard';
import Cashdashboard from './Pages/Cashierpage/Cashdashboard';
// import OrderRequest from './Pages/screens/OrderRequest';
// import RentalRequest from './Pages/screens/Rentalrequest';
// import Cashrental from './Pages/Cashierpage/Cashrental';
// import Claimed from './Pages/screens/Claimed';
import Order from './Pages/screens/Order';
import Cashorder from './Pages/screens/Cashorder'; 
import Stocks from './Pages/screens/Stocks';
import ReferencePage from './Pages/screens/ReferencePage';
import Inventory from './Pages/screens/Inventory';
import Sales from './Pages/screens/Sales';
import Preloader from './Components/preloader/preloader';



function App() {
  const [isLoading, setIsLoading] = useState(true);
 
  useEffect(() => {
     // Simulate fetching data
     setTimeout(() => {
       setIsLoading(false);
     }, 1000); // Remove this timeout and replace with your actual data fetching logic
  }, []);
 
  return (
     <HashRouter>
       <div className="App">
         {isLoading ? (
           <Preloader />
         ) : (
           <Routes>
             <Route path="/" element={<Login />} />
             <Route path="/dashboard/*" element={<Dashboard />} />
             <Route path="/cashdashboard/*" element={<Cashdashboard />} />
             <Route path="/cashorder" element={<Cashorder />} />
             <Route path="/order/*" element={<Order />} />
             <Route path="/stocks/*" element={<Stocks />} />
             <Route path="/reference" element={<ReferencePage />} />
             <Route path="/inventory" element={<Inventory />} />
             <Route path="/sales" element={<Sales />} />
           </Routes>
         )}
       </div>
     </HashRouter>
  );
 }
 
 export default App;