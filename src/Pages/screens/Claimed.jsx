import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchData } from "../../Components/api/api2";
import "../css/Order.css";

function Claimed() {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchData("orders", setRows);
    // fetchOrdersData(setRows);
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };


  // Filter rows based on search term
  const filteredRows = rows.filter((row) => {
    const searchTermLower = searchTerm.toLowerCase();
    
    return (
      (row.id.toString().includes(searchTermLower) ||
      row.created_at.toLowerCase().includes(searchTermLower) ||
      row.username.toLowerCase().includes(searchTermLower) ||
      row.payment_type.toLowerCase().includes(searchTermLower) ||
      (row.status === 0 ? "Not Approved" : "Approved").toLowerCase().includes(searchTermLower)) && (row.is_received === 1) 
    );
  });

  const dateFormatter = (created_at) => {
    // Convert the created_at string to a Date object
    const createdAtDate = new Date(created_at);

    // Define an array to map months
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    // Format the date
    return `${months[createdAtDate.getMonth()]} ${createdAtDate.getDate().toString().padStart(2, '0')}, ${createdAtDate.getFullYear()}`;
  }

  return (
    <div className="order-container">
      <div className="searchbarorder">
        <input type="text" placeholder="Search..." value={searchTerm} onChange={handleSearchChange} />
      </div>

      <div className="order-content">
        <h1 className="order-title">Claimed</h1>

        <div className="table-container">
          <div className="table-toolbar">
            {/* <button className="saorderrequestngabutton" onClick={handleOrderRequestClick}>
              Order Request
            </button> */}
          </div>

          <div className="table-and-remove">
            {/* <button className="removebuttonsaorderpage" onClick={handleRemoveClick}>
              Remove
            </button> */}

            <table className="order-table">
              <thead>
                <tr>
                  {/* <th>Order Id</th> */}
                  <th>Order date</th>
                  <th>Username</th>
                  <th>Category</th>
                  <th>Item</th>
                  <th>Quantity</th>
                  <th>Payment type</th>
                </tr>
              </thead>
              <tbody>
                {filteredRows.map((row) => (
                  <tr key={row.id}>
                    {/* <td>
                      <input
                        type="checkbox"
                        onChange={() => handleCheckboxChange(row.id)}
                        checked={selectedRows.includes(row.id)}
                      />
                      {row.id}
                    </td> */}
                    <td>{dateFormatter(row.created_at)}</td>
                    <td>{row.username}</td>
                    <td>{row.item.category.name}</td>
                    <td>{row.item.name}</td>
                    <td>{row.quantity}</td>
                    <td>{row.payment_type}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Claimed;
