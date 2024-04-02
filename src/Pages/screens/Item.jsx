import React, { useState, useEffect } from "react";
import "../css/Item.css"; // Import the CSS file
import { fetchData, createData, updateData, deleteData } from "../../Components/api/api2";

function Item() {
  const [items, setItems] = useState([]);
  const [images, setImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newItem, setNewItem] = useState({ 
    name: "",
    price: "",
    author: "",
    types: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Fetch categories from your backend API
    fetchData("categories", setCategories);

    // Fetch items from your backend API
    fetchData("items", setItems);
    fetchData("images", setImages);
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filter items based on the search term
  //const filteredItems = items.filter((item) => {
    //const searchTermLower = searchTerm.toLowerCase();
    //return (
      //item.name.toLowerCase().includes(searchTermLower)
    //);
  //});


  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewItem((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission
  
    // Check if all required fields are filled
    if (!newItem.name || !newItem.price || !newItem.types) {
      alert('Please fill in all required fields.');
      return; // Prevent form submission if any required field is empty
    }
  
    // Check for price to ensure it's greater than   0
    if (isNaN(newItem.price) || newItem.price <=   0) {
      alert('Price must be greater than 0 and also not a letter.');
      return; // Prevent form submission if price is not a number or is less than or equal to   0
    }
  
    if (editingItem) {
      newItem.id = editingItem.id;
      // Update existing item
      await updateData(`items`, newItem);
      alert('Item updated successfully!');
    } else {
      // Add new item
      await createData("items", newItem);
      alert('Item added successfully!');
    }
  
    setShowModal(false);
    setEditingItem(null);
    fetchData("items", setItems);
  };
  

  const handleEditItem = (item) => {
    setEditingItem(item);
    setNewItem({
      name: item.name,
      price: item.price,
      types: item.types,
    });
    setShowModal(true);
  };

  const handleRemoveItem = (item) => {
    setEditingItem(item);
    setConfirmationModal(true);
  };

  const confirmRemove = async () => {
    await deleteData("items/"+editingItem.id);
    fetchData("items", setItems);
    setConfirmationModal(false);
  };

  const cancelRemove = () => {
    setEditingItem(null);
    setConfirmationModal(false);
  };

  const openModal = () => {
    setEditingItem(null); // Reset editing item when opening modal for a new item
    setNewItem({
      name: "",
      price: "",
      types: "",
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setEditingItem(null);
    setShowModal(false);
  };

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
          Add Item
        </button>

        {showModal && (
          <div className="modal">
            <div className="modal-content">
              <span className="close-button" onClick={closeModal}>
                &times;
              </span>
              <h2>{editingItem ? "Edit" : "Add"} Item</h2>
              <div className="add-item-form">

                <select
                  name="name"
                  value={newItem.name}
                  onChange={handleChange}
                >
                  <option value="" disabled>
                    Select Image
                  </option>
                  {images.map((images) => (
                    <option key={images.id} value={images.id}>
                      {images.name}
                    </option>
                   ))}
                </select>
                <input
                  type="text"
                  placeholder="Price"
                  name="price"
                  value={newItem.price}
                  onChange={handleChange}
                />
                <input
                  type="text"
                  placeholder="Types"
                  name="types"
                  value={newItem.types}
                  onChange={handleChange}
                />
                <button onClick={handleSubmit}>
                  {editingItem ? "Update" : "Add"} Item
                </button>
              </div>
            </div>
          </div>
        )}

        {confirmationModal && (
          <div className="confirmation-modal">
            <div className="confirmation-content">
              <h2>Are you sure you want to remove this item?</h2>
              <div className="confirmation-buttons">
                <button onClick={confirmRemove}>Yes</button>
                <button onClick={cancelRemove}>No</button>
              </div>
            </div>
          </div>
        )}

        <table>
          <thead>
            <tr>
              <th>Item Name</th>
              <th>Type</th>
              <th>Price</th>
              <th>Available Stocks</th>
              <th>Action</th>
            </tr>
          </thead>
<tbody>
 {items.map((item) => {
    // Find the corresponding image name for the item
    const imageName = images.find(image => image.id === item.name)?.name || 'N/A';

    return (
      <tr key={item.id}>
        <td>{imageName}</td> {/* Use the imageName instead of item.name */}
        <td>{item.types}</td>
        <td>{item.price}</td>
        <td>{item.available_stocks}</td>
        <td>
          <a className="link" href={`#/dashboard/stocks/${item.id}`} style={{background: 'green', color: "white", font: "13px Arial", padding: "5px  10px", textDecoration: "none", borderRadius: "4px", display: "flex", justifyContent: "center"}} >
            Manage Stocks
          </a>
          <button style={{background: 'darkblue'}} onClick={() => handleEditItem(item)}>
            Edit
          </button>
          <button onClick={() => handleRemoveItem(item)}>Remove</button>
        </td>
      </tr>
    );
 })}
</tbody>

        </table>
      </div>
    </div>
  );
}

export default Item;

