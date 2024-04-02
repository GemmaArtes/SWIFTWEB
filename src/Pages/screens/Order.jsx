import React, { useState, useEffect } from "react";
import { fetchData, updateData, fetchOrdersData, deleteData } from "../../Components/api/api2";
import "../css/Order.css";

function Order() {
  const [rows, setRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [images, setImages] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchData("orders", setRows);
    fetchData("images", setImages);
    fetchData("categories", setCategories);
    // fetchOrdersData(setRows);
  }, []);


  const handleCancelClick = async(orderId) => {
    console.log(`Cancel order with id: ${orderId}`);
    await deleteData(`orders/${orderId}`);
    window.location.reload();
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleToggleStatus = async (orderId, payment_id, item_id) => {
    try {
       // Get the order with the specified orderId
       const orderToUpdate = rows.find((row) => row.id === orderId);
       const { item, quantity } = orderToUpdate;
       const { available_stocks } = item;
   
       // Check if there are enough stocks for the order
       if (available_stocks < quantity) {
         alert('There are not enough stocks for this order. Please restock or cancel the order.');
         return; // Exit the function if there are not enough stocks
       }
   
       // Assuming status is a boolean, toggle the status
       const updatedStatus = orderToUpdate.status === 0 ? 1 : 0;
   
       // Update the status in the backend
       await updateData('orders', { id: orderId, status: updatedStatus });
       await updateData('payments', {
         id: payment_id,
         status: updatedStatus,
         item_id,
       });
   
       // Update the status in the local state (optimistic update)
       setRows((prevRows) =>
         prevRows.map((row) =>
           row.id === orderId ? { ...row, status: updatedStatus } : row
         )
       );
   
       console.log(`Status toggled for order with id: ${orderId}`);
    } catch (error) {
       console.error('Error toggling status:', error);
    }
   };
   
   
   

  const handleToggleStatus2 = async (orderId) => {
    try {
      // Get the order with the specified orderId
      const orderToUpdate = rows.find((row) => row.id === orderId)

      // Toggle the status (assuming status is a boolean)
      const updatedStatus = orderToUpdate.is_received == 0 ? 1 : 0

      // Update the status in the backend
      await updateData('orders', { id: orderId, is_received: updatedStatus })

      // Update the status in the local state (optimistic update)
      setRows((prevRows) =>
        prevRows.map((row) =>
          row.id === orderId ? { ...row, is_received: updatedStatus } : row
        )
      )

      console.log(`Status toggled for order with id: ${orderId}`)
    } catch (error) {
      console.error('Error toggling status:', error)
    }
  }

  // Filter rows based on search term
  const filteredRows = rows.filter((row) => {
    const searchTermLower = searchTerm.toLowerCase()

    return (
      (row.id.toString().includes(searchTermLower) ||
        row.created_at.toLowerCase().includes(searchTermLower) ||
        row.username.toLowerCase().includes(searchTermLower) ||
        row.payment_type.toLowerCase().includes(searchTermLower) ||
        (row.status === 0 ? 'Not Approved' : 'Approved')
          .toLowerCase()
          .includes(searchTermLower)) &&
      row.is_received !== 1
    )
  })

  const dateFormatter = (created_at) => {
    // Convert the created_at string to a Date object
    const createdAtDate = new Date(created_at)

    // Define an array to map months
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ]

    // Format the date
    return `${months[createdAtDate.getMonth()]} ${createdAtDate
      .getDate()
      .toString()
      .padStart(2, '0')}, ${createdAtDate.getFullYear()}`
  }

  console.log('filtered rows', filteredRows)

  return (
    <div className='order-container'>
      <div className='searchbarorder'>
        <input
          type='text'
          placeholder='Search...'
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>
      <div className='order-content'>
        <h1 className='order-title'>Order</h1>
        <div className='order-count'>
          <p>Total Orders: {filteredRows.length}</p>
        </div>

        <div className='table-container'>
          <div className='table-and-remove'>
            <div className='table-container'>
              <div className='order-table-wrapper'>
                <table className='order-table'>
                  <thead>
                    <tr>
                      {/* <th>Order Id</th> */}
                      <th>Order date</th>
                      <th>Username</th>
                      <th>Category</th>
                      <th>Item</th>
                      <th>Type</th>
                      <th>Quantity</th>
                      <th>Payment type</th>
                      <th>Amount</th>
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
                        <td>{row.category ? row.category.name : 'N/A'}</td> {/* Check if category exists */}
                        <td>{row.item ? row.item.name : 'N/A'}</td> {/* Check if item exists */}
                        <td>{row.type}</td>
                        <td>{row.quantity}</td>
                        <td>{row.payment_type}</td>
                        <td>{row.quantity * row.item.price}</td>
                        <td>{row.status === 0 ? 'Unpaid' : 'Paid'}</td>
                        <td>
                          {row.is_received === 0
                            ? 'Not yet claimed'
                            : 'Delivered'}
                        </td>
                        <td>
                          <button
                            className='updatebuttonparasaorderpage2'
                            onClick={() =>
                              handleToggleStatus(
                                row.id,
                                row.payment_id,
                                row.item_id
                              )
                            }

                            disabled={row.status === 1}
                          >
                            {row.status === 0
                              ? 'Mark as paid'
                              : 'PAID'}
                          </button>

                          <button
                            className='updatebuttonparasaorderpage'
                            onClick={() => handleToggleStatus2(row.id)}
                          >
                            {row.is_received === 0
                              ? 'Mark as claimed'
                              : 'Mark as not yet claimed'}
                          </button>
                          {/* <button className="updatebuttonparasaorderpage" onClick={() => handleUpdateClick(row.id)}>
                        Update
                      </button> */}
                          <button
                            className='removebuttonsaorderpage'
                            onClick={() => handleCancelClick(row.id)}
                          >
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
      </div>
    </div>
  )
}

export default Order;