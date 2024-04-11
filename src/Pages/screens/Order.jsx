import React, { useState, useEffect } from "react";
import { fetchData, updateData, deleteData } from "../../Components/api/api2";
import "../css/Order.css";

function Order() {
  const [rows, setRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [images, setImages] = useState([]);
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [modalOpen, setModalOpen] = useState(false); // State to control modal visibility
  const [selectedOrder, setSelectedOrder] = useState(null); // State to store selected order details
  const [or_number, setOrNumber] = useState("");

  useEffect(() => {
    fetchData("orders", setRows);
    fetchData("images", setImages);
    fetchData("items", setItems);
    fetchData("categories", setCategories);
  }, []);

  const getImageName = (itemId) => {
    const image = images.find((image) => image.id === itemId);
    return image ? image.name : "No Image";
  };

  const handleOpenModal = (orderId) => {
    const orderDetails = rows.find((row) => row.id === orderId);
    setSelectedOrder(orderDetails);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedOrder(null);
    setOrNumber("");
    setModalOpen(false);
  };

  const getCategory = (itemId) => {
    const item = items.find((item) => item.id === itemId);
    if (item) {
      const image = images.find((image) => image.id === item.name);
      if (image) {
        return getCategoryNameById(image.category_id);
      }
    }
    return "No Category";
  };

  const getCategoryNameById = (categoryId) => {
    const category = categories.find((category) => category.id === categoryId);
    return category ? category.name : "No Category";
  };

  const handleUpdateOR = async (order) => {
    try {
      if (!or_number) {
        alert("Please enter an OR Number.");
        return;
      }

      const updatedOrder = {
        id: order.id,
        or_number: or_number,
      };

      await updateData("orders", updatedOrder);
      setRows((prevRows) =>
        prevRows.map((row) =>
          row.id === order.id ? { ...row, or_number: or_number } : row
        )
      );

      handleCloseModal();
      setOrNumber("");

      alert("OR Number updated successfully!");
    } catch (error) {
      console.error("Error updating OR Number:", error);
      alert("Failed to update OR Number. Please try again.");
    }
  };

  const handleCancelClick = async (orderId) => {
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
        alert(
          "There are not enough stocks for this order. Please restock or cancel the order."
        );
        return; // Exit the function if there are not enough stocks
      }

      // Assuming status is a boolean, toggle the status
      const updatedStatus = orderToUpdate.status === 0 ? 1 : 0;

      // Update the status in the backend
      await updateData("orders", { id: orderId, status: updatedStatus });
      await updateData("payments", {
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
      console.error("Error toggling status:", error);
    }
    window.location.reload();
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
        row.item.image.category.name.toLowerCase().includes(searchTermLower) ||
        row.item.image.name.toLowerCase().includes(searchTermLower) ||
        row.type.toLowerCase().includes(searchTermLower) ||
        row.payment_type.toLowerCase().includes(searchTermLower) ||
        (row.status === 0 ? "Not Approved" : "Approved")
          .toLowerCase()
          .includes(searchTermLower)) &&
      row.is_received !== 1
    );
  });

  const dateFormatter = (created_at) => {
    // Convert the created_at string to a Date object
    const createdAtDate = new Date(created_at);

    // Define an array to map months
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    // Format the date
    return `${months[createdAtDate.getMonth()]} ${createdAtDate
      .getDate()
      .toString()
      .padStart(2, "0")}, ${createdAtDate.getFullYear()}`;
  };

  console.log("filtered rows", filteredRows);

  return (
    <div className="order-container">
      <div className="searchbarorder">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>
      <div className="order-content">
        <h1 className="order-title">Order</h1>
        <div className="order-count">
          <p>Total Orders: {filteredRows.length}</p>
        </div>

        <div className="table-container">
          <div className="table-and-remove">
            <div className="table-container">
              <div className="order-table-wrapper">
                <table className="order-table">
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
                        <td>{getCategory(row.item.id)}</td>
                        <td>{getImageName(row.item.name)}</td>
                        <td>{row.type}</td>
                        <td>{row.quantity}</td>
                        <td>{row.payment_type}</td>
                        <td>{row.quantity * row.item.price}</td>
                        <td>{row.status === 0 ? "Unpaid" : "Paid"}</td>
                        <td>
                          {row.is_received === 0
                            ? "Not yet claimed"
                            : "Delivered"}
                        </td>
                        <td>
                          <button
                            className="updatebuttonparasaorderpage2"
                            onClick={() =>
                              handleToggleStatus(
                                row.id,
                                row.payment_id,
                                row.item_id
                              )
                            }
                            disabled={row.status === 1}
                          >
                            {row.status === 0 ? "Mark as paid" : "PAID"}
                          </button>

                          <button
                            className="updatebuttonparasaorderpage"
                            onClick={() => handleToggleStatus2(row.id)}
                          >
                            {row.is_received === 0
                              ? "Mark as claimed"
                              : "Mark as not yet claimed"}
                          </button>
                          {/* <button className="updatebuttonparasaorderpage" onClick={() => handleUpdateClick(row.id)}>
                        Update
                      </button> */}
                          <button
                            className="removebuttonsaorderpage"
                            onClick={() => handleOpenModal(row.id)}
                          >
                            OR Number
                          </button>
                          <button
                            className="removebuttonsaorderpage"
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
      {modalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={handleCloseModal}>
              &times;
            </span>
            {selectedOrder && (
              <div>
                <h2>Order Details</h2>
                <p>
                  <span style={{ fontWeight: "bold" }}>Date:</span>{" "}
                  {dateFormatter(selectedOrder.created_at)}
                </p>
                <p>
                  <span style={{ fontWeight: "bold" }}>Username:</span>{" "}
                  {selectedOrder.username}
                </p>
                <p>
                  <span style={{ fontWeight: "bold" }}>Category:</span>{" "}
                  {getCategory(selectedOrder.item.id)}
                </p>
                <p>
                  <span style={{ fontWeight: "bold" }}>Item:</span>{" "}
                  {getImageName(selectedOrder.item.name)}
                </p>
                <p>
                  <span style={{ fontWeight: "bold" }}>Type:</span>{" "}
                  {selectedOrder.type}
                </p>
                <p>
                  <span style={{ fontWeight: "bold" }}>Quantity:</span>{" "}
                  {selectedOrder.quantity}
                </p>
                <p>
                  <span style={{ fontWeight: "bold" }}>Payment Type:</span>{" "}
                  {selectedOrder.payment_type}
                </p>
                <p>
                  <span style={{ fontWeight: "bold" }}>Amount: </span>
                  {selectedOrder.quantity * selectedOrder.item.price}
                </p>
                <p>
                  <span style={{ fontWeight: "bold" }}>OR Number: </span>
                  {selectedOrder.or_number}
                </p>

                <label htmlFor="or_number">OR Number:</label>
                <input
                  type="text"
                  id="or_number"
                  value={or_number}
                  placeholder={selectedOrder.or_number}
                  onChange={(e) => setOrNumber(e.target.value)}
                />
                <button onClick={() => handleUpdateOR(selectedOrder)}>
                  Submit OR Number
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Order;
