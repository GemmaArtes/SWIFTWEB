import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000"; 
const MINDEE_BASE_URL = "https://api.mindee.net/v1/products/SwiftApp/reference_number/v1/predict";
const MINDEE_TOKEN = "abc20d4ee5301b66184153eab2723218";

// Function to fetch all data
export const fetchData = async (table, setData) => {
  const token = localStorage.getItem("token");

    try {
      const response = await axios.get(`${BASE_URL}/api/${table}`, {
        headers: {
            Authorization: `Bearer ${token}`,
           } 
        });

        console.log("#######################");
        console.log(response.data);
        console.log("#######################");

        setData(response.data);
      return response.data;
    } catch (error) {
      console.error(`Error fetching ${table}:`, error);
      throw error;
    }
};

export const toggleCategoryStatus = async (categoryId) => {
  try {
    const response = await axios.patch(`${BASE_URL}/api/categories/${categoryId}/toggle-status`, {}, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error toggling category status:', error);
    throw error;
  }
};



export const fetchOrdersData = async (setData) => {
  const token = localStorage.getItem("token");

    try {
      const res = await axios.get(`${BASE_URL}/api/payments`, {
        headers: {
            Authorization: `Bearer ${token}`,
           } 
        }).then((response) => {
          var resData = response.data;
          resData.forEach( async e => {
            // Fetch the image from the URL
            const response = await fetch(e.receipt_url);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            // Get the Blob from the response
            const imageBlob = await response.blob();

            // Create a FormData object and append the Blob as a file
            const formData = new FormData();
            formData.append('document', imageBlob, 'image.jpg');

            axios.post(`${MINDEE_BASE_URL}`, formData, {
              headers: {
                  Authorization: `Token ${MINDEE_TOKEN}`,
                  'Content-Type': 'application/json'
                 } 
              }).then((response2) => {
                e.receipt_data = response2;
              });
          });
        });

        setData(response.data);
      return response.data;
    } catch (error) {
      console.error(`Error fetching ${table}:`, error);
      throw error;
    }
};

export const getReceiptData = async (table, formData) => {
    try {
      const response = await axios.post(`${MINDEE_BASE_URL}`, formData, {
        headers: {
            Authorization: `Token ${MINDEE_TOKEN}`,
           } 
        });

        // setData(response.data);
      return response.data;
    } catch (error) {
      console.error(`Error fetching ${table}:`, error);
      throw error;
    }
};

// Function to create a new data
export const createData = async (table, formData, setData = "") => {
  const token = localStorage.getItem("token");

  try {
    const response = await axios.post(`${BASE_URL}/api/${table}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (setData && setData != '' && setData != undefined) {
      setData(response.data)
    }
    console.log('response: ', response.data)
    return response.data
  } catch (error) {
    console.error(`Error creating ${table}:`, error)
    throw error
  }
};

// Function to update a data
export const updateData = async (table, formData) => {
 const token = localStorage.getItem("token");

 try {
    const url = table === 'payments'
      ? `${BASE_URL}/api/${table}/${formData.id}?item_id=${formData.item_id}`
      : `${BASE_URL}/api/${table}/${formData.id}`;

    const response = await axios.patch(url, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json', // Ensure this is set correctly
      },
    });
    return response.data;
 } catch (error) {
    console.error(`Error updating ${table}:`, error);
    throw error;
 }
};

  
// Function to delete a data
// export const deleteData = async (table, formData) => {
export const deleteData = async (table) => {
  const token = localStorage.getItem("token");

    try {
        // const response = await axios.delete(`${BASE_URL}/api/${table}/${formData.id}`);
        const response = await axios.delete(`${BASE_URL}/api/${table}`, {
            headers: {
                Authorization: `Bearer ${token}`,
               } 
            });
        return response.data;
    } catch (error) {
        console.error(`Error deleting ${table}:`, error);
        throw error;
    }
};
  