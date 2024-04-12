import React, { useState, useEffect } from 'react';
import { uploadImage, fetchImage } from "../../Components/api/api"; // Ensure fetchImage is correctly exported from your api file
import "../css/uploadimage.css";
import axios from "axios";
import { fetchData} from "../../Components/api/api2";




const ImageUploadForm = () => {
  const [image, setImage] = useState(null);
  const [name, setName] = useState('');
  const [categories, setCategories] = useState([]);
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null); // State to store the uploaded image URL
  const [images, setImages] = useState([]); // State to store the fetched images
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control the modal visibility
    const [newItem, setNewItem] = useState({
    category_id: "",   
    name: "",
  });

  useEffect(() => {
    const loadImages = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/images'); // Update the URL accordingly
        console.log('Fetched images:', response.data);
        setImages(response.data);
      } catch (error) {
        console.error('Error loading images:', error);
      }
    };
    

    loadImages();
  }, []);

    useEffect(() => {
    // Fetch categories from your backend API
    fetchData("categories", setCategories);

  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('image', image);
    formData.append('name', name);
    formData.append('category_id', newItem.category_id);
  
    const response = await uploadImage(formData);
    alert('Image uploaded successfully');
    window.location.reload(); // Refresh the page
    setUploadedImageUrl(response.data.image_url); // Set the uploaded image URL
    setImage(null);
    setName('');
    // Optionally, refetch images to include the newly uploaded image
    const fetchedImages = await fetchImage(); // Correctly using fetchImage
    setImages(fetchedImages);
    setIsModalOpen(false); // Close the modal after successful upload
  };

    // Filter categories to only include those that are active
  const activeCategories = categories.filter(category => category.isActive);
  
    const handleChange = (e) => {
    const { name, value } = e.target;
    setNewItem((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const imageStyles = {
    maxWidth: '50%',
    height: '50%', // This ensures the image height is adjusted to maintain the aspect ratio
    objectFit: 'cover', // This ensures the image covers the available space without distorting its aspect ratio
    borderRadius: '10px', // Optional: Adds rounded corners to the images
  };

  return (
    <div>
      <button className='button-add-item' onClick={() => setIsModalOpen(true)}>Add Item</button>
  
      {isModalOpen && (
        <div className="upload-image-modal"> {/* Apply the class to the modal */}
          <h2>Add Item</h2>
          <form onSubmit={handleSubmit}>
                          <select
                  name="category_id"
                  value={newItem.category_id}
                  onChange={handleChange}
                >
                  <option value="" disabled>
                    Select Category
                  </option>
                  {activeCategories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                   ))}
                </select>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Item Name" />
            <input type="file" onChange={(e) => setImage(e.target.files[0])} />
            <button type="submit">Upload</button>
            <button type="button" onClick={() => setIsModalOpen(false)}>Close</button>
          </form>
        </div>
      )}
  
      {uploadedImageUrl && (
        <div>
          <h2>Uploaded Image:</h2>
          <img src={uploadedImageUrl} alt="Uploaded" className="uploaded-image" /> {/* Apply the class to the uploaded image */}
        </div>
      )}
       <h2 className='title'>All Items</h2>
      <div className="image-container"> {/* Use the new class here */}
       
        
          {images.map((img, index) => (
          <div className='image' key={index}>
            <img src={`http://127.0.0.1:8000/images/${img.path}`} alt={img.name} className="uploaded-image" /> {/* Apply the class to the images */}
            <p>{img.name}</p>
          </div>
        ))}
      
      </div>
    </div>
  );
}  

export default ImageUploadForm;

