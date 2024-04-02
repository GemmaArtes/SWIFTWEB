import React, { useState, useEffect } from 'react';
import '../css/Reports.css';

const Reference = ({ data, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState(data);

  useEffect(() => {
    // Update filteredData whenever data changes
    setFilteredData(data);
  }, [data]);

  const handleSearch = () => {
    const formattedSearchTerm = searchTerm.toLowerCase();
    const filtered = data.filter(
      (item) =>
        String(item.name).toLowerCase().includes(formattedSearchTerm) ||
        String(item.referenceNumber).includes(searchTerm) ||
        String(item.date).toLowerCase().includes(formattedSearchTerm)
    );
    setFilteredData(filtered);
  };
  

  const clearSearch = () => {
    setSearchTerm('');
  };

  return (
    <div className="reference-container">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
        <button onClick={clearSearch}>Clear</button>
      </div>
      <table className="reference-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Reference Number</th>
            <th>Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredData && filteredData.length > 0 ? (
            filteredData.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.referenceNumber}</td>
                <td>{item.date}</td>
                <td>
                  <button className="delete-button" onClick={() => onDelete(item.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No matching data</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Reference;
