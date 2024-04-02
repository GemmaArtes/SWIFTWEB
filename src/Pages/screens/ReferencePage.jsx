import React, { useState, useEffect } from "react";
import { fetchData } from "../../Components/api/api2";
import "../css/default.css";

function ReferencePage() {
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Fetch the list of categories from your API
    fetchData("references", setCategories);
  }, []);

  const filteredCategories = categories.filter(category =>
    category.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.reference.includes(searchTerm) ||
    category.date.includes(searchTerm)
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
        <h1 className="title">Gcash Receipt Reference</h1>

        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Reference Number</th>
                <th>Amount</th>
                <th>Date paid</th>
              </tr>
            </thead>
            <tbody>
              {filteredCategories.map((category, index) => (
                <tr key={category.id}>
                  <td>{category.user.name}</td>
                  <td>{category.reference}</td>
                  <td>{category.amount}</td>
                  <td>{category.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ReferencePage;
