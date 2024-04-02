import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchData, updateData, fetchOrdersData, deleteData } from "../../Components/api/api2";
import "../css/Order.css";

function Cashorder() {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchData("orders", setRows);
    // fetchOrdersData(setRows);
  }, []);

  const handleCheckboxChange = (orderId) => {
    if (selectedRows.includes(orderId)) {
      setSelectedRows(selectedRows.filter((id) => id !== orderId));
    } else {
      setSelectedRows([...selectedRows, orderId]);
    }
  };

  const handleRemoveClick = () => {
    console.log("Remove clicked. Selected rows:", selectedRows);
    // Implement logic to remove selected orders
  };

  const handleUpdateClick = (orderId) => {
    navigate(`/order/update/${orderId}`);
  };

  const handleCancelClick = async(orderId) => {
    console.log(`Cancel order with id: ${orderId}`);
    await deleteData(`orders/${orderId}`);
    window.location.reload();
  };

  const handleOrderRequestClick = () => {
    navigate("/OrderRequest");
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleToggleStatus = async (orderId) => {
    try {
      // Get the order with the specified orderId
      const orderToUpdate = rows.find((row) => row.id === orderId);

      // Toggle the status (assuming status is a boolean)
      const updatedStatus = orderToUpdate.status == 0 ? 1 : 0;

      // Update the status in the backend
      await updateData("orders", { id: orderId, status: updatedStatus });

      // Update the status in the local state (optimistic update)
      setRows((prevRows) =>
        prevRows.map((row) =>
          row.id === orderId ? { ...row, status: updatedStatus } : row
        )
      );

      console.log(`Status toggled for order with id: ${orderId}`);
    } catch (error) {
      console.error("Error toggling status:", error);
    }
  };


  const handleToggleStatus2 = async (orderId) => {
    try {
      // Get the order with the specified orderId
      const orderToUpdate = rows.find((row) => row.id === orderId);

      // Toggle the status (assuming status is a boolean)
      const updatedStatus = orderToUpdate.is_received == 0 ? 1 : 0;

      // Update the status in the backend
      await updateData("orders", { id: orderId, is_received: updatedStatus });

      // Update the status in the local state (optimistic update)
      setRows((prevRows) =>
        prevRows.map((row) =>
          row.id === orderId ? { ...row, is_received: updatedStatus } : row
        )
      );

      console.log(`Status toggled for order with id: ${orderId}`);
    } catch (error) {
      console.error("Error toggling status:", error);
    }
  };

  // Filter rows based on search term
  const filteredRows = rows.filter((row) => {
    const searchTermLower = searchTerm.toLowerCase();
    
    return (
      (row.id.toString().includes(searchTermLower) ||
      row.created_at.toLowerCase().includes(searchTermLower) ||
      row.username.toLowerCase().includes(searchTermLower) ||
      row.payment_type.toLowerCase().includes(searchTermLower) ||
      (row.status === 0 ? "Not Approved" : "Approved").toLowerCase().includes(searchTermLower)) && (row.is_received !== 1)
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
        <h1 className="order-title">Order</h1>

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
                  <th>Item</th>
                  <th>Payment type</th>
                  <th>Paid Status</th>
                  <th>Delivered Status</th>
                  <th>Action</th>
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
                    <td>{row.item.name}</td>
                    <td>{row.payment_type}</td>
                    <td>{row.status === 0 ? "Unpaid" : "Paid"}</td>
                    <td>{row.is_received === 0 ? "Not yet claimed" : "Delivered"}</td>
                    <td>
                      <button
                        className="updatebuttonparasaorderpage2"
                        onClick={() => handleToggleStatus(row.id)}
                      >
                        {row.status === 0 ? "Mark as paid" : "Mark as unpaid"}
                      </button>

                      <button
                        className="updatebuttonparasaorderpage"
                        onClick={() => handleToggleStatus2(row.id)}
                      >
                        {row.is_received === 0 ? "Mark as claimed" : "Mark as not yet claimed"}
                      </button>
                      {/* <button className="updatebuttonparasaorderpage" onClick={() => handleUpdateClick(row.id)}>
                        Update
                      </button> */}
                      <button className="removebuttonsaorderpage" onClick={() => handleCancelClick(row.id)}>
                        Cancel
                      </button>
                    </td>
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

export default Cashorder;
