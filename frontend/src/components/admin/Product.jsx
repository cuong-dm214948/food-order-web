import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate }  from "react-router-dom";

export default function Product() {
  const navigate = useNavigate();
  const [productName, setProductName] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);

  const handleImageChange = (e) => {
    // Handle image change here
    const file = e.target.files[0];
    setImage(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('productName', productName);
    formData.append('category', category);
    formData.append('price', price);
    formData.append('description', description);
    formData.append('image', image);

    axios.post('http://localhost:3000/auth/addProduct', formData)
      .then((result) => {
        if (result.data.Status) {
          navigate('/dashboard/product');
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="fixed w-full h-full bg-slate-200 bg-opacity-35 top-0 left-0 right-0 bottom-0 flex justify-center items-center">
      <div className="bg-white p-4 rounded w-full max-w-2xl h-full max-h-[80%] overflow-hidden">
        <div className="flex justify-between items-center pb-3">
          <h2 className="font-bold text-lg">Upload Product</h2>
          <div className="w-fit ml-auto text-2xl hover:text-red-600 cursor-pointer"></div>
        </div>
        <form className="grid p-4 gap-2 overflow-y-scroll h-full pb-5">
          <label htmlFor="productName">Product Name:</label>
          <input
            type="text"
            id="productName"
            placeholder="Enter product name"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            className="p-2 bg-slate-100 border rounded"
            required
          />
          <label htmlFor="category" className="mt-3">
            Category:
          </label>
          <select
  required
  name="category"
  value={category}
  onChange={(e) => setCategory(e.target.value)}
  className="p-2 bg-slate-100 border rounded"
>
  <option value="">Select Category</option>
  <option value="Pizza">Pizza</option>
  <option value="Dessert">Dessert</option>
  <option value="Side">Side</option>
  <option value="Drink">Drink</option>
</select>

    
          <label htmlFor="productImage" className="mt-3">
            Product Image:
          </label>
          <label htmlFor="uploadImageInput">
            <div className="p-2 bg-slate-100 border rounded h-32 w-full flex justify-center items-center cursor-pointer">
              {/* Show selected file name */}
              {image ? (
                <span>{image.name}</span>
              ) : (
                <span>Choose an image</span>
              )}
              <input
                type="file"
                id="uploadImageInput"
                className="hidden"
                onChange={handleImageChange}
              />
            </div>
          </label>
          <label htmlFor="price" className="mt-3">
            Price:
          </label>
          <input
            type="number"
            id="price"
            placeholder="Enter price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="p-2 bg-slate-100 border rounded"
            required
          />
          <label htmlFor="description" className="mt-3">
            Description:
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="h-28 bg-slate-100 border resize-none p-1"
            placeholder="Enter product description"
            name="description"
          ></textarea>
          <button
            className="px-3 py-2 bg-red-600 text-white mb-10 hover:bg-red-700"
            onClick={handleSubmit}
          >
            Upload Product
          </button>
        </form>
      </div>
    </div>
  );
}
