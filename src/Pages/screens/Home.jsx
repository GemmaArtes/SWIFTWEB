import React, { useState, useEffect } from "react";
import { fetchData } from "../../Components/api/api2";
import "../css/Home.css";

function Home() {
  const [categories, setCategories] = useState([]);
  const [totalSoldMap, setTotalSoldMap] = useState(new Map());
  const [images, setImages] = useState([]);

  useEffect(() => {
    // Fetch the list of categories from your API
    fetchData("stats", (data) => {
      setCategories(data);

      // Calculate total quantity sold for each item name
      const newTotalSoldMap = new Map();

      data.orders.forEach((order) => {
        if (order.status === 1) {
          const itemName = order.item.name;
          const currentTotal = newTotalSoldMap.get(itemName) || 0;
          newTotalSoldMap.set(itemName, currentTotal + order.quantity);
        }
      });

      setTotalSoldMap(newTotalSoldMap);
    });
  }, []);

  useEffect(() => {
    fetchData("images", setImages);
  }, []);

  const getImageName = (itemId) => {
    const image = images.find((image) => image.id === itemId);
    return image ? image.name : "No Image";
  };

  return (
    <div className="home">
      <div className="home-header">
        <h1 className="home-title">Dashboard</h1>
      </div>
      <div className="home-content">
        <div className="home-tables">
          <div className="home-table">
            <h2 className="home-name">Stock Available</h2>
            <table className="hometable">
              <tbody>
                {categories.items &&
                  categories.items.map((item, index) => (
                    <tr key={index}>
                      <td>{getImageName(item.name)}</td>
                      <td>{item.types}</td>
                      <td>Available: {item.available_stocks}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          <div className="home-table">
            <h2 className="home-name">Orders</h2>
            <table className="hometable">
              <thead>
                <tr></tr>
              </thead>
              <tbody>
                {Array.from(totalSoldMap.entries()).map(
                  ([itemName, totalSold], index) => (
                    <tr key={index}>
                      <td>{getImageName(itemName)}</td>
                      <td>
                        {
                          categories.items.find(
                            (item) => item.name === itemName
                          )?.types
                        }
                      </td>
                      <td>Sold: {totalSold}</td>
                    </tr>
                  )
                )}
                {/* Display the total quantity sold */}
                <tr className="total-row">
                  <td colSpan="2">Total Sold:</td>
                  <td>
                    {Array.from(totalSoldMap.values()).reduce(
                      (total, sold) => total + sold,
                      0
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="dashboard-footer"></div>
    </div>
  );
}

export default Home;
