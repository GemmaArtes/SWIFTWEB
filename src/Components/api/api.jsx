import axios from "axios";

const base = "http://127.0.0.1:8000"; // 'http://localhost:8000/'

const api = axios.create({
    baseURL: base
})

export const registerUser = (formData) => {
  return api.post('api/users', formData)
    .then((response) => {
      // Return the response data
      return response;
    })
    .catch((error) => {
      // Log the error for debugging purposes
      // console.error('Error during registration:', error);
      // Re-throw the error so it can be caught in the calling function
      throw error;
    });
};



export const uploadImage = (formData) => {
  return api.post('api/upload-image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  .then((response) => {
    // Handle the response, e.g., show a success message or update the UI
    console.log('Image uploaded successfully:', response.data);
    return response;
  })
  .catch((error) => {
    // Handle the error, e.g., show an error message
    console.error('Error uploading image:', error);
    throw error;
  });
};




export const fetchImage = async () => {
  try {
    const response = await fetch('http://localhost:8000/api/images', {
    method: 'GET',
    headers: {
    'Accept': 'application/json',
  },
});

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data; // Adjusted to return the data directly
  } catch (error) {
    console.error('Error fetching images:', error);
    throw error;
  }
};









export const loginUser = (formData, navigate) => {
    api.post('api/login', formData)
      .then((response) => {
        // const token = response.data.auth_token;
        // console.log(response.data.token);
        const token = response.data.token;
        localStorage.setItem("token", token);
  
        api.get('api/me', {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": 'application/json'
          }
        }).then((response) => {
          const userType = response.data.roles[0].slug;
          const status = response.data.status;
          const active = response.data.is_active;
          console.log('\x1b[32m' + JSON.stringify(response.data.status));
          
          // Redirect based on user type
          switch (userType) {
            case 'super-admin':
              navigate('/dashboard');
              break;
            case 'staff':
              if(status == 1 && active == 1){
                navigate('/dashboard');
              }else if(status == 0){
                alert("Account not yet active");
              }else{
                alert("Account has been deactivated");
              }
              break;
            case 'cashier':
              navigate('/cashdashboard');
              break;
            case 'user':
              // navigate('/dashboard');
              console.error("Unauthorized user type:", userType);
              break;
            // Add more cases for additional user types
  
            default:
              // Handle unexpected user types or scenarios
                alert("Unexpected user type:", userType);
                console.error("Unexpected user type:", userType);
              break;
          }
        })
  
      }).catch((error) => {
                alert("Invalid credentials or Incorrect password and Email");
                console.log(error);
        // Handle login failure
      });
  };
  



export const fetchAccountRequest = (setAccountRequests) => {
    const token = localStorage.getItem("token")
    api.get('api/users?status=0', {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": 'application/json'
           } 
    }).then((response) => {
        setAccountRequests(response.data)
      
    }).catch((error)=>{
        console.log(error)
    })
}

// export const fetchRegisteredAccount = (setRegisteredAccounts) => {
//     const token = localStorage.getItem("token")
//     api.get('api/users?status=1', {
//         headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": 'application/json'
//            } 
//     }).then((response) => {
//         setRegisteredAccounts(response.data)
//         console.log("fetch",response);
//         // setData("");
//           setSuccess(
//             "Successfully Registered!\nplease check your email\n  for activation!"
//           );
        
//     }).catch((error)=>{
//         console.log(error)
//     })
// }


export const acceptAccountRequest = (id) => {
    const token = localStorage.getItem("token")
    api.patch(`api/users/${id}/`, {'status': 1}, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": 'application/json'
        } 
    }).then((response) => {
        window.location.reload()
    }).catch((error) =>{
        console.log(error)
    })
}

export const declineAccountRequest = (id) => {
    const token = localStorage.getItem("token")
    api.patch(`api/users/${id}/`, {'status': 0}, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": 'application/json'
        } 
    }).then((response) => {
        window.location.reload()
    }).catch((error) =>{
        console.log(error)
    })
}

export const activateAccount = (id) => {
  const token = localStorage.getItem("token")
  api.patch(`api/v1/accounts/activate-account/${id}/`, {}, {
      headers: {
          Authorization: `Token ${token}`,
          "Content-Type": 'application/json'
      } 
  }).then((response) => {
      window.location.reload()
  }).catch((error) =>{
      console.log(error)
  })
}

export const deactivateAccount = (id) => {
  const token = localStorage.getItem("token")
  api.patch(`api/v1/accounts/deactivate-account/${id}/`, {}, {
      headers: {
          Authorization: `Token ${token}`,
          "Content-Type": 'application/json'
      } 
  }).then((response) => {
      window.location.reload()
  }).catch((error) =>{
      console.log(error)
  })
}

export const addCategories = (formData) => {
    const token = localStorage.getItem("token")
    axios.post('http://localhost:8000/api/v1/ecommerce/categories/', formData, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": 'application/json'
        } 
    }) // Update the URL
      .then(response => {
        alert('Category added successfully!');
        // setFormData({
        //   category_name: '', // Reset the form field
        // });
      })
      .catch(error => {
        console.log(error);
        alert('Error adding category!');
      });
}

export const fetchCategories = (setCategories) => {
    const token = localStorage.getItem("token")
    // axios.get("http://localhost:8000/api/v1/ecommerce/categories/", {
    //     headers: {
    //         Authorization: `Bearer ${token}`,
    //         "Content-Type": 'application/json'
    //        } 
    // }).then((response) => {
    //   setCategories(response.data);
    // });
    api.get('api/categories', {
      headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": 'application/json'
         } 
      }).then((response) => {
        setCategories(response.data);
      }).catch((error)=>{
          console.log(error)
      })
}



export const fetchProfile = (setProfile) => {
  const token = localStorage.getItem("token")
  api.get('api/me', {
    headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": 'application/json'
       } 
    }).then((response) => {
      console.log(response.data);

      setProfile(response.data);
    }).catch((error)=>{
        console.log(error)
    })
}

// Function to update a category
export const updateProfile = async (formData) => {
  delete formData.roles;
  delete formData.status;
  const token = localStorage.getItem("token");


  try {
    const response = await axios.patch(`${base}/api/users/${formData.id}`, formData, {
          headers: {
              Authorization: `Bearer ${token}`,
             } 
          });
    return response.data;
  } catch (error) {
    console.error('Error updating category:', error);
    throw error;
  }
};

// export const updateProfile = (formData, csrfoken) => {
//   const token = localStorage.getItem("token")

//   console.log(token);

//   api.patch(`api/users/${formData.id}/`, ""
//   , {
//     headers: {
//         Authorization: `Bearer ${token}`,
//         "Content-Type": 'application/json',
//         "Accept": '*/*',
//         'X-CSRF-TOKEN': csrfoken,
//        } 
//     }).then((response) => {
//       window.location.reload()
//   }).catch((error) =>{
//       console.log(error)
//       alert(error.message);
//   })
// }

// export const updateProfile = (formData, ccsrftoken) => {
//   const token = localStorage.getItem("token");

//   delete formData.roles;
//   delete formData.status;

//   api.get('api/csrf-token', {
//     headers: {
//         Authorization: `Bearer ${token}`,
//         "Content-Type": 'application/json'
//        } 
//     }).then((response) => {
//       console.log(response.data.token);
//       const csrfToken = response.data.token;
//       formData._token = ccsrftoken;
//       if(csrfToken){
//         axios.patch("http://swiftorder-api.test/api/users/" + formData.id + "/", formData, {
//           headers: {
//                 Authorization: `Bearer ${token}`,
//                 "Content-Type": 'application/json',
//                 'X-CSRF-TOKEN': ccsrftoken,
//             } 
//           })
//           .then((response) => {
//             alert('Item added successfully!');
//             // window.location.reload()
//             // setShowModal(false);
//           })
//           .catch(error => {
//             // Handle error
//             if (error.response) {
//               // The request was made, but the server responded with a status code outside the range of 2xx
//               console.log('Server responded with:', error.response.status, error.response.data);
//             } else if (error.request) {
//               // The request was made, but no response was received
//               console.log('Server responded with:', error.response, error.request);
//               console.log('No response received from server');
//             } else {
//               // Something happened in setting up the request that triggered an Error
//               console.error('Error:', error.message);
//             }
//         });
//       }
//     }).catch((error)=>{
//         console.log(error)
//     });
// }

export const addItems = (newItem, setShowModal) => {
    const token = localStorage.getItem("token")
    axios
      .post("http://localhost:8000/api/v1/ecommerce/items/", newItem, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": 'application/json'
        } 
    })
      .then((response) => {
        alert('Item added successfully!');
        window.location.reload()
        setShowModal(false);
      })
      .catch((error) => {
        console.error("Error adding item:", error); // Log the error message
        alert('Error adding item! See the console for details.'); // Display a generic error message to the user
      });
}

export const fetchItems = (setItems) => {
    const token = localStorage.getItem("token")
    axios
      .get("http://localhost:8000/api/v1/ecommerce/items/", {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": 'application/json'
        } 
    }) // Replace with your backend API URL
      .then((response) => {
        setItems(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
}