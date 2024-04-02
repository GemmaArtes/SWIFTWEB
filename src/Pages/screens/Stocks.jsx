import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchData, createData, updateData, deleteData } from "../../Components/api/api2";

function Stocks() {
    const { itemId } = useParams();
  const [stocks, setStocks] = useState([]);
  const [item, setItem] = useState([]);
  const [types, setTypes] = useState([]);
  const [newStock, setNewStock] = useState({ item_id: itemId, quantity: 0, type: "" });
  const [showModal, setShowModal] = useState(false);
  const [editingStock, setEditingStock] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeName, setTypeName] = useState('');



  
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
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredStocks = stocks.filter((stock) => {
    const searchTermLower = searchTerm.toLowerCase();
    const stockDate = dateFormatter(stock.created_at).toLowerCase();

    return (
      (stock.quantity.toString().includes(searchTermLower) ||
        stock.type.toLowerCase().includes(searchTermLower) ||
        stockDate.includes(searchTermLower)) && item.id == stock.item_id
    );
  });

  const handleChange = (e) => {
    const { name, value } = e.target

    setNewStock((prevStock) => ({
      ...prevStock,
      [name]: value,
    }))

    if (name === 'type') {
      const mtypeName = value
      setNewStock((prevData) => ({
        ...prevData,
        type: mtypeName,
      }))
      setTypeName(typeName)
    }
  }

  const handleSubmit = async () => {
    const isValidQuantity = /^[+]?\d+$/.test(newStock.quantity)
    if (isValidQuantity && newStock.quantity > 0) {
      if (editingStock) {
        newStock.id = editingStock.id
        // Update existing stock
        await updateData(`stocks`, newStock)
      } else {
        // Add new stock
        await createData('stocks', newStock)
      }
    } else {
      alert(
        'Please enter a valid quantity (a positive whole number greater than zero).'
      )
      setNewStock((prevStock) => ({
        ...prevStock,
      }))
    }

    setShowModal(false)
    setEditingStock(null)
    fetchData(`stocks?item_id=${itemId}`, setStocks) // Fetch stocks for the specific item
  }

  // const handleEditStock = (stock) => {
  //   setEditingStock(stock);
  //   console.log(stock);
  //   setNewStock({ item_id: stock.item_id, quantity: stock.quantity, type: stock.type });
  //   setTypes(item.types.toString().split(","));
  //   setShowModal(true);
  // };

  // const handleRemoveStock = async (stockId) => {
  //   await deleteData(`stocks/${stockId}`);
  //   fetchData(`stocks?item_id=${itemId}`, setStocks); // Fetch stocks for the specific item
  // };

  const openModal = () => {
    setEditingStock(null);
    // Reset the input fields to initial values
    setNewStock({ item_id: itemId, quantity: 0, type: "" });
    setTypes(item.types.toString().split());
    setShowModal(true);
  };
  
  const closeModal = () => {
    setEditingStock(null);
    setShowModal(false);
  };

  useEffect(() => {
    // Fetch stocks for the specific item
    fetchData(`stocks`, setStocks);
    fetchData(`items/${itemId}`, setItem);
  }, [itemId]);

   

  return (
    <div className="backgroundsaitems">
      <div>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>

        <button className="modal-button" onClick={openModal}>
          Add Stock
        </button>

        {showModal && (
          <div className="modal">
            <div className="modal-content">
              <span className="close-button" onClick={closeModal}>
                &times;
              </span>
              <h2>{editingStock ? "Edit" : "Add"} Stock</h2>
              <div className="add-stock-form">
                <label>
                  Quantity:
                  <input
                    type="number"
                    name="quantity"
                    value={newStock.quantity}
                    onChange={handleChange}
                    onKeyPress={handleChange} // Listen for Enter key
                    onWheel={(e) => e.preventDefault()} // Prevent increment/decrement on wheel events
                  />
                </label>
                <label>
                  Type:
                  <select
                    data-asd={newStock.type}
                    name="type"
                    defaultValue={newStock.type}
                    onChange={handleChange}
                  >
                    <option value="" disabled>
                      Select Type
                    </option>
                    {types.map((type, index) => (
                      <option key={index} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </label>
                <button onClick={handleSubmit}>
                  {editingStock ? "Update" : "Add"} Stock
                </button>
              </div>
            </div>
          </div>
        )}

        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Quantity</th>
              <th>Type</th>
              {/* <th>Action</th> */}
            </tr>
          </thead>
          <tbody>
            {filteredStocks.map((stock, index) => (
              <tr key={stock.id}>
              <td>{dateFormatter(stock.created_at)}</td>
                <td>{stock.quantity}</td>
                <td>{stock.type}</td>
                {/* <td>
                  <button style={{ background: 'darkblue' }} onClick={() => handleEditStock(stock)}>
                    Edit
                  </button>
                  <button onClick={() => handleRemoveStock(stock.id)}>Remove</button>
                </td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Stocks;