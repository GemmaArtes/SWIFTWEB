import React, { useState, useEffect } from "react";
import { fetchData, createData, updateData, toggleCategoryStatus } from "../../Components/api/api2";
import "../css/default.css";

function Categories() {
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryStatus, setCategoryStatus] = useState({});

  useEffect(() => {
    fetchData("categories", (categories) => {
      setCategories(categories);
      const initialStatus = categories.reduce((acc, category) => {
        acc[category.id] = category.isActive;
        return acc;
      }, {});
      setCategoryStatus(initialStatus);
    });
  }, []);

  const handleAddCategory = async () => {
    try {
      if (!/^[a-zA-Z\s.]+$/.test(newCategoryName)) {
        alert('Category name should contain only letters and spaces.');
        return;
      }

      const newCategory = await createData('categories', {
        name: newCategoryName,
      });
      setCategories((prevCategories) => [...prevCategories, newCategory]);
      setNewCategoryName('');

      alert('Added category successfully');
      window.location.reload();
    } catch (error) {
      console.error('Error adding category:', error.message);
      alert('Failed to add category. Please try again.');
    }
  };

  const handleUpdateCategory = async (category) => {
    try {
      await updateData("categories", category);
      fetchData("categories", setCategories);
    } catch (error) {
      console.error('Error updating category:', error.message);
    }
  };

  const handleToggleCategoryStatus = async (categoryId) => {
    try {
      const updatedCategory = await toggleCategoryStatus(categoryId);
      setCategoryStatus(prevStatus => ({
        ...prevStatus,
        [categoryId]: updatedCategory.isActive
      }));

      if (updatedCategory.isActive) {
        alert('The category has been activated.');
      } else {
        alert('The category has been deactivated.');
      }
    } catch (error) {
      console.error('Error toggling category status:', error.message);
    }
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="mycontainer">
      <div className="searchbarorder">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="content">
        <h1 className="title">Categories</h1>

        <div className="table-container">
          <div className="table-toolbar">
            <input
              type="text"
              placeholder="New Category"
              style={{ margin: '0px'}}
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
            />
            <button
              className=""
              style={{background: 'green', width: '200px', height: '30px', padding: '8px', margin: '0px', marginLeft: '8px'}}
              onClick={handleAddCategory}
            >
              Add Category
            </button>
          </div>

          <table className="table">
            <thead>
              <tr>
                <th>No.</th>
                <th>Name</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredCategories.map((category, index) => (
                <tr key={category.id}>
                  <td>{index +   1}</td>
                  <td>{category.name}</td>
                  <td>{categoryStatus[category.id] ? 'Active' : 'Inactive'}</td>
                  <td>
                    <button
                      style={{background: 'green', padding: '5px', width: '20%', margin: '10px'}}
                      onClick={() => {
                        const updatedName = prompt('Enter the edit name:', category.name);
                        category.name = updatedName;
                        if (updatedName !== null) {
                          handleUpdateCategory(category);
                        }
                      }}
                    >
                      Edit Name
                    </button>
                    <button
                      style={{
                        background: categoryStatus[category.id] ? 'red' : 'blue',
                        padding: '5px',
                        width: '20%',
                        margin: '10px'
                      }}
                      onClick={() => handleToggleCategoryStatus(category.id)}
                    >
                      {categoryStatus[category.id] ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Categories;
