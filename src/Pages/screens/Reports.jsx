import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchData } from "../../Components/api/api2";
import "../css/Order.css";
import "../css/Reports.css";

function Reports() {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [images, setImages] = useState([]);
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    fetchData("orders", setRows);
    fetchData("images", setImages);
    fetchData("items", setItems);
    fetchData("categories", setCategories);
  }, []);

  const getImageName = (itemId) => {
    // Find the image corresponding to the item ID
    const image = images.find((image) => image.id === itemId);

    // If image found, return its name, otherwise return null or a placeholder
    return image ? image.name : "No Image";
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
    // Find the category corresponding to the category ID
    const category = categories.find((category) => category.id === categoryId);

    // If the category is found, return its name
    // Otherwise, return 'No Category'
    return category ? category.name : "No Category";
  };

  const handlePrint = () => {
    const printContents = document.getElementById("printableTable").innerHTML;
    const originalContents = document.body.innerHTML;

    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload();
  };

  const filteredRows = rows.filter((row) => {
    const searchTermLower = searchTerm.toLowerCase();

    // Convert created_at to a Date object
    const createdAtDate = new Date(row.created_at);

    // Format the date for comparison: "Feb 07, 2024"
    const formattedDate = `${createdAtDate.toLocaleString("default", {
      month: "short",
    })} ${createdAtDate.getDate()}, ${createdAtDate.getFullYear()}`;

    return (
      formattedDate.toLowerCase().includes(searchTermLower) ||
      row.username.toLowerCase().includes(searchTermLower) ||
      (row.item &&
        row.item.image.category.name.toLowerCase().includes(searchTermLower)) ||
      (row.item &&
        row.item.image.name.toLowerCase().includes(searchTermLower)) ||
      row.type.toLowerCase().includes(searchTermLower) ||
      row.quantity.toString().includes(searchTermLower) ||
      row.payment_type.toLowerCase().includes(searchTermLower) ||
      (row.quantity * row.item.price).toString().includes(searchTermLower) ||
      (row.status === 0 ? "Unpaid" : "Paid")
        .toLowerCase()
        .includes(searchTermLower) ||
      (row.is_received === 0 ? "Not yet claimed" : "Delivered")
        .toLowerCase()
        .includes(searchTermLower)
    );
  });

  const dateFormatter = (created_at) => {
    const createdAtDate = new Date(created_at);
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

    return `${months[createdAtDate.getMonth()]} ${createdAtDate
      .getDate()
      .toString()
      .padStart(2, "0")}, ${createdAtDate.getFullYear()}`;
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRows = filteredRows.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredRows.length / itemsPerPage);

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

  return (
    <div className="reports-container">
      <div className="reports-content" id="printableTable">
        <h1 className="reports-title">Reports</h1>

        <div className="table-container">
          <div className="table-toolbar">
            <input
              className=" searchshit"
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="table-and-remove">
            <table className="reports-table">
              <thead>
                <tr>
                  <th>Order date</th>
                  <th>OR number</th>
                  <th>Username</th>
                  <th>Category</th>
                  <th>Item</th>
                  <th>Type</th>
                  <th>Quantity</th>
                  <th>Payment type</th>
                  <th>Amount</th>
                  <th>Paid Status</th>
                  <th>Delivered Status</th>
                </tr>
              </thead>
              <tbody>
                {currentRows.map((row) => (
                  <tr key={row.id}>
                    <td>{dateFormatter(row.created_at)}</td>
                    <td>{row.or_number}</td>
                    <td>{row.username}</td>
                    <td>{getCategory(row.item.id)}</td>
                    <td>{getImageName(row.item.name)}</td>
                    <td>{row.type}</td>
                    <td>{row.quantity}</td>
                    <td>{row.payment_type}</td>
                    <td>{row.quantity * row.item.price}</td>
                    <td>
                      {row.status === 0
                        ? "Unpaid"
                        : row.status === 1
                        ? "Paid"
                        : row.status === 2
                        ? "Cancelled"
                        : ""}
                    </td>

                    <td>
                      {row.is_received === 0 ? "Not yet claimed" : "Delivered"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="pagination">
          <button onClick={handlePrevPage}>&lt;</button>
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => handlePageChange(index + 1)}
              className={currentPage === index + 1 ? "active" : ""}
            >
              {index + 1}
            </button>
          ))}
          <button onClick={handleNextPage}>&gt;</button>
        </div>

        <div className="print-buttoninreports no-print">
          <a href="#" onClick={handlePrint}>
            Print
          </a>
        </div>
      </div>
    </div>
  );
}

export default Reports;
