import React, { useState, useEffect } from "react";
import axios from "axios";

const TabsComponent = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchCategory, setSearchCategory] = useState("orderId");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost:5001/order');
        setOrders(response.data.orders);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setError('Error fetching orders');
      }
    };

    fetchOrders();
  }, []);

  const handleSearchTermChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchCategoryChange = (e) => {
    setSearchCategory(e.target.value);
  };

  const filteredOrders = orders.filter(order => {
    const term = searchTerm.toLowerCase();
    if (searchCategory === "orderId") {
      return order.id.toString().includes(term);
    } else if (searchCategory === "customerName") {
      return order.userid.toLowerCase().includes(term);
    } else if (searchCategory === "time") {
      return order.timestamp.toLowerCase().includes(term);
    }
    return false;
  });

  return (
    <div>
      <select value={searchCategory} onChange={handleSearchCategoryChange}>
        <option value="orderId">Order ID</option>
        <option value="customerName">Customer Name</option>
        <option value="time">Time</option>
      </select>
      <input
        type="text"
        placeholder={`Search by ${searchCategory}`}
        value={searchTerm}
        onChange={handleSearchTermChange}
      />
      {error && <p>{error}</p>}
      {filteredOrders.length > 0 ? (
        filteredOrders.map(order => (
          <div key={order.id}>
            <h3>Order ID: {order.id}</h3>
            <p>Customer name: {order.userid}</p>
            <p>Method payment: {order.method}</p>
            <p>Total Amount: {order.total},000đ</p>
            <p>Order Time: {order.timestamp}</p>
            <table className="order-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th></th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total Price</th>
                </tr>
              </thead>
              <tbody>
                {JSON.parse(order.products).map(product => (
                  <tr key={product.id}>
                    <td>{product.name}</td>
                    <td><img src={require(`../../assets/image/${product.image}`)} alt={product.name} width="50" /></td>
                    <td>{product.price}K</td>
                    <td>{product.quantity}</td>
                    <td>{product.totalPrice}K</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))
      ) : (
        <p>No orders found.</p>
      )}
    </div>
  );
};

export default TabsComponent;
