"use client";

import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import "../../../../public/bootstrap/css/cart.css"; // Ensure this path is correct

const OrderHistory = () => {
    const user = useSelector(state => state.auth.user);
    const [orders, setOrders] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        if (user?._id) {
            axios.get(`http://localhost:3000/orders/user/${user._id}`)
                .then(response => {
                    setOrders(response.data);
                })
                .catch(error => {
                    setErrorMessage('Error fetching order history.');
                    console.error('Error fetching order history:', error);
                });
        }
    }, [user?._id]);

    const handleCancelOrder = async (orderId) => {
        try {
            await axios.put(`http://localhost:3000/orders/${orderId}/status`, { status: 'cancelled' });
            setOrders(orders.map(order =>
                order._id === orderId ? { ...order, status: 'cancelled' } : order
            ));
        } catch (error) {
            setErrorMessage('Error canceling order.');
            console.error('Error canceling order:', error);
        }
    };

    return (
        <div className="container my-5">
            <h1>Order History</h1>

            {errorMessage && (
                <div className="alert alert-danger" role="alert">
                    {errorMessage}
                </div>
            )}

            {orders.length === 0 ? (
                <p>No orders found.</p>
            ) : (
                <div className="list-group">
                    {orders.map(order => (
                        <div key={order._id} className="list-group-item list-group-item-action">
                            <h5 className="mb-1">Order ID: {order._id}</h5>
                            <p className="mb-1">Total Amount: {order.totalAmount.toFixed(2)} đ</p>
                            <p className="mb-1">
                                Trạng thái: 
                                <span 
                                    className={`badge ${
                                        order.status === 'pending' ? 'bg-warning' :
                                        order.status === 'processing' ? 'bg-primary' :
                                        order.status === 'shipped' ? 'bg-info' :
                                        order.status === 'delivered' ? 'bg-success' :
                                        order.status === 'cancelled' ? 'bg-danger' : 'bg-secondary'
                                    }`}
                                >
                                    {
                                        order.status === 'pending' ? 'Đang chờ xử lý' :
                                        order.status === 'processing' ? 'Đang xử lý' :
                                        order.status === 'shipped' ? 'Đã giao hàng' :
                                        order.status === 'delivered' ? 'Đã giao tận nơi' :
                                        order.status === 'cancelled' ? 'Đã hủy' : 'Chưa xác định'
                                    }
                                </span>
                            </p>
                            <p className="mb-1">Shipping Address: {order.shippingAddress.street}, {order.shippingAddress.ward}, {order.shippingAddress.district}, {order.shippingAddress.city}</p>
                            <button 
                                className="btn btn-primary" 
                                type="button" 
                                data-bs-toggle="collapse" 
                                data-bs-target={`#details${order._id}`} 
                                aria-expanded="false" 
                                aria-controls={`details${order._id}`}
                            >
                                View Details
                            </button>
                            {(order.status === 'pending' || order.status === 'processing') && (
                                <button className="btn btn-danger mt-2" onClick={() => handleCancelOrder(order._id)}>
                                    Cancel Order
                                </button>
                            )}
                            <div className="collapse mt-2" id={`details${order._id}`}>
                                <ul className="list-group">
                                    {order.details.map(item => (
                                        <li key={item.productId} className="list-group-item">
                                            <h6>{item.name} (Quantity: {item.quantity})</h6>
                                            <p>Price: {item.price.toFixed(2)} đ</p>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default OrderHistory;
