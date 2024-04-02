import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { fetchData, createData, updateData, deleteData } from '../../Components/api/api2';
import '../css/Inventory.css';

const Inventory = () => {
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage =  10;

  // State for tracking checkboxes
  const [showStocksIn, setShowStocksIn] = useState(true);
  const [showStocksOut, setShowStocksOut] = useState(true);

  useEffect(() => {
    fetchData('inventorystock', setItems);
  }, []);

  function formatCreatedAt(createdAt) {
    const date = new Date(createdAt);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    });
  }

  const filteredItems = items.filter((item) => {
    const searchTermLower = searchTerm.toLowerCase();
    const date = formatCreatedAt(item.created_at);

    // Filter by search term
    //const nameMatches = item.item.name && item.item.name.toLowerCase().includes(searchTermLower);
    const dateMatches = date && date.toLowerCase().includes(searchTermLower);
    const typeMatches = item.type && item.type.toLowerCase().includes(searchTermLower);

    // Filter by stocks in/out
    const stocksInMatches = showStocksIn && item.is_in ===  1;
    const stocksOutMatches = showStocksOut && item.is_in ===  0;

    // Combine all conditions
    return ( dateMatches || typeMatches) && (stocksInMatches || stocksOutMatches);
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage +  1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage >  1) {
      setCurrentPage(currentPage -  1);
    }
  };

  return (
    <div className="containersinventory">
      <div className="searchinventory">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <DatePicker
          placeholderText="From Date"
          selected={fromDate}
          onChange={(date) => setFromDate(date)}
        />
        <DatePicker
          placeholderText="To Date"
          selected={toDate}
          onChange={(date) => setToDate(date)}
        />
        {/* Checkboxes for filtering stocks in and stocks out */}
        {/* <label>
          <input
            type="checkbox"
            checked={showStocksIn}
            onChange={(e) => setShowStocksIn(e.target.checked)}
          />
          Show Stocks In
        </label>
        <label>
          <input
            type="checkbox"
            checked={showStocksOut}
            onChange={(e) => setShowStocksOut(e.target.checked)}
          />
          Show Stocks Out
        </label> */}
      </div>
      <div className="Inventory">
        <h2>Inventory Stock Card</h2>
        <table className='Inventorytable'>
          <thead>
            <tr>
              <th>Item Name</th>
              <th>Stocks On Hand</th>
              <th>Date Stocks In</th>
              <th>Stocks In</th>
              <th>Date Stocks sales</th>
              <th>Stocks sales</th>
              <th>Remaining Balance</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item) => (
              <tr key={item.id}>
              <td>{item.item.name}</td>
              <td>{item.quantity_on_hand}</td>
              <td>{item.is_in ===   1 ? formatCreatedAt(item.created_at) : ''}</td>
              <td>{item.is_in ===   1 ? item.quantity : ''}</td>
              <td className={item.is_in ===   0 ? 'red-text' : ''}>{item.is_in ===   0 ? formatCreatedAt(item.created_at) : ''}</td>
              <td className={item.is_in ===   0 ? 'red-text' : ''}>{item.is_in ===   0 ? item.quantity : ''}</td>
              <td>
                {item.is_in ===   1
                  ? item.quantity_on_hand + item.quantity
                  : item.quantity_on_hand - item.quantity}
              </td>
            </tr>
            ))}
          </tbody>
        </table>
        <div className="pagination">
          <button className='paginationbutton' onClick={handlePrevPage}>&lt;</button>
          {Array.from({ length: totalPages }, (_, index) => (
            <button  
              key={index +  1}
              onClick={() => handlePageChange(index +  1)}
              className={currentPage === index +  1 ? 'active' : ''}
            >
              {index +  1}
            </button>
          ))}
          <button className='paginationbutton' onClick={handleNextPage}>&gt;</button>
        </div>
      </div>
    </div>
  );
};

export default Inventory;
