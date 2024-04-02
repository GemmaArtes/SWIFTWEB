import React, { useState, useEffect } from 'react';
import { fetchData } from "../../Components/api/api2";
import "../css/Sales.css";

const Sales = () => {
  const [sales, setSales] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFilter, setSelectedFilter] = useState('day');
  const salesPerPage = 10;

  useEffect(() => {
    fetchData("sales", setSales);
  }, []);

  function formatCreatedAt(createdAt) {
    const date = new Date(createdAt);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    });
  }

  const filterSalesByDate = (saleDate, currentDate, filter) => {
    switch (filter) {
      case 'day':
        return saleDate === currentDate;
      case 'week':
        const startOfWeek = new Date(currentDate);
        startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        return saleDate >= startOfWeek && saleDate <= endOfWeek;
      case 'month':
        return saleDate === currentDate.slice(0, -3); // compare YYYY-MM
      case 'year':
        return saleDate === currentDate.slice(0, -6); // compare YYYY
      default:
        return true;
    }
  };

  const filteredSales = sales
    .filter((sale) => {
      const searchTermLower = searchTerm.toLowerCase();
      return (
        sale.type.toLowerCase().includes(searchTermLower)
      );
    })
    .reduce((accumulator, sale) => {
      const key = `${sale.item.name}-${formatCreatedAt(sale.created_at)}`;
      const existingSale = accumulator[key];

      if (!existingSale) {
        accumulator[key] = { ...sale, date: formatCreatedAt(sale.created_at) };
      } else {
        existingSale.quantity += sale.quantity;
        existingSale.amount += sale.amount;
      }

      return accumulator;
    }, {});

  const currentDate = formatCreatedAt(new Date());

  const filteredSalesByFilter = Object.values(filteredSales)
    .filter((sale) => filterSalesByDate(sale.date, currentDate, selectedFilter));

  const indexOfLastSale = currentPage * salesPerPage;
  const indexOfFirstSale = indexOfLastSale - salesPerPage;
  const paginatedSales = filteredSalesByFilter.slice(indexOfFirstSale, indexOfLastSale);

  const totalPages = Math.ceil(filteredSalesByFilter.length / salesPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleFilterChange = (event) => {
    setSelectedFilter(event.target.value);
  };

  return (
    <div className='sales-container'>
      <div className='search-sales'>
        <input
          type='text'
          placeholder='Search...'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className='Sales'>
        <div className='filter-container'>
          <label>Filter By:</label>
          <select value={selectedFilter} onChange={handleFilterChange}>
            <option value='day'>Daily</option>
            <option value='week'>Weekly</option>
            <option value='month'>Monthly</option>
            <option value='year'>Yearly</option>
          </select>
        </div>
        <h2>Sales</h2>
        <table className='Sales-table'>
          <thead>
            <tr>
              <th>Date</th>
              <th>Item Name</th>
              <th>Type</th>
              <th>Stocks On Hand</th>
              <th>Qty Sold</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {paginatedSales.map((sale, index) => (
              <tr key={index}>
                <td>{sale.date}</td>
                <td>{sale.item.name}</td>
                <td>{sale.type}</td>
                <td>{sale.quantity_on_hand}</td>
                <td>{sale.quantity}</td>
                <td>{sale.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className='pagination'>
          <button onClick={handlePrevPage}>&lt;</button>
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => handlePageChange(index + 1)}
              className={currentPage === index + 1 ? 'active' : ''}
            >
              {index + 1}
            </button>
          ))}
          <button onClick={handleNextPage}>&gt;</button>
        </div>
      </div>
    </div>
  );
};

export default Sales;
