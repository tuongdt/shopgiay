"use client";

import { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import "../../../../public/bootstrap/css/cart.css";
import { clearCart } from '@/redux/slices/cartSlices';

const CheckoutPage = () => {
    const cartItems = useSelector(state => state.cart.items) || [];
    const dispatch = useDispatch();
    const router = useRouter();
    const user = useSelector(state => state.auth.user);
    const [cities, setCities] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [selectedCity, setSelectedCity] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [selectedWard, setSelectedWard] = useState('');
    const [customerName, setCustomerName] = useState('');
    const [customerEmail, setCustomerEmail] = useState('');
    const [shippingAddress, setShippingAddress] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const total = useMemo(() => 
        cartItems.reduce((total, item) => total + item.price * item.quantity, 0), 
        [cartItems]
    );

    useEffect(() => {
        // Fetch data from the API
        axios.get('https://raw.githubusercontent.com/kenzouno1/DiaGioiHanhChinhVN/master/data.json')
            .then(response => {
                const data = response.data;
                setCities(data);
            })
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    const handleCityChange = (e) => {
        const city = JSON.parse(e.target.value);
        setSelectedCity(city.Id);
        setDistricts(city.Districts);
        setWards([]);
        setSelectedDistrict('');
        setSelectedWard('');
    };

    const handleDistrictChange = (e) => {
        const districtId = e.target.value;
        setSelectedDistrict(districtId);
        const selectedCityObj = cities.find(city => city.Districts.some(district => district.Id === districtId));
        const selectedDistrictObj = selectedCityObj?.Districts.find(district => district.Id === districtId);
        setWards(selectedDistrictObj?.Wards || []);
        setSelectedWard('');
    };

    const handleCheckout = async () => {
        if (!customerName || !customerEmail || !paymentMethod || !selectedCity || !selectedDistrict || !selectedWard) {
            setErrorMessage('Please provide all required information.');
            return;
        }

        setErrorMessage('');
        setIsSubmitting(true);

        const orderDetails = {
            userId: user?._id,
            totalAmount: total,
            shippingAddress: {
                street: shippingAddress,
                ward: wards.find(ward => ward.Id === selectedWard)?.Name || '',
                district: districts.find(district => district.Id === selectedDistrict)?.Name || '',
                city: cities.find(city => city.Id === selectedCity)?.Name || ''
            },
            paymentMethod,
            status: 'pending',
            details: cartItems.map(item => ({
                productId: item._id,
                name: item.name,
                quantity: item.quantity,
                price: item.price * (1 - (item.sale / 100 || 0))
            }))
        };

        try {
            const response = await fetch('http://localhost:3000/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(orderDetails)
            });

            if (response.ok) {
                dispatch(clearCart());
                alert("Thank you for your order! We have sent a confirmation email to your address along with the invoice.");
                router.push('/orders');
            } else {
                const data = await response.json();
                setErrorMessage(data.error || 'Failed to submit order');
            }
        } catch (error) {
            console.error('Error submitting order:', error);
            setErrorMessage('Error submitting order. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container my-5">
            <h1>Checkout</h1>

            {errorMessage && (
                <div className="alert alert-danger" role="alert">
                    {errorMessage}
                </div>
            )}

            <div className="row">
                <div className="col-md-6">
                    <div className="form-group">
                        <label htmlFor="customerName">Customer Name</label>
                        <input
                            type="text"
                            className="form-control"
                            id="customerName"
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="customerEmail">Customer Email</label>
                        <input
                            type="email"
                            className="form-control"
                            id="customerEmail"
                            value={customerEmail}
                            onChange={(e) => setCustomerEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="shippingAddress">Shipping Address</label>
                        <input
                            type="text"
                            className="form-control"
                            id="shippingAddress"
                            value={shippingAddress}
                            onChange={(e) => setShippingAddress(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="city">City</label>
                        <select
                            className="form-control"
                            id="city"
                            value={selectedCity}
                            onChange={handleCityChange}
                        >
                            <option value="">Select City</option>
                            {cities.map(city => (
                                <option key={city.Id} value={JSON.stringify(city)}>{city.Name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="district">District</label>
                        <select
                            className="form-control"
                            id="district"
                            value={selectedDistrict}
                            onChange={handleDistrictChange}
                        >
                            <option value="">Select District</option>
                            {districts.map(district => (
                                <option key={district.Id} value={district.Id}>{district.Name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="ward">Ward</label>
                        <select
                            className="form-control"
                            id="ward"
                            value={selectedWard}
                            onChange={(e) => setSelectedWard(e.target.value)}
                        >
                            <option value="">Select Ward</option>
                            {wards.map(ward => (
                                <option key={ward.Id} value={ward.Id}>{ward.Name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="paymentMethod">Payment Method</label>
                        <select
                            className="form-control"
                            id="paymentMethod"
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            required
                        >
                            <option value="">Select Payment Method</option>
                            <option value="cash">Cash on Delivery</option>
                            <option value="card">Card Payment</option>
                        </select>
                    </div>
                    <button 
                        className="btn btn-primary"
                        onClick={handleCheckout}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Submitting...' : 'Place Order'}
                    </button>
                </div>
                <div className="col-md-6">
                    <h2>Cart</h2>
                    <div className="cart-items">
                        {cartItems.map((item, index) => (
                            <div key={index} className="cart-item">
                                <div className="row">
                                    <div className="col-4">
                                        <img
                                            src={`http://localhost:3000/img/${item.image}`}
                                            alt={item.name}
                                            className="img-fluid"
                                        />
                                    </div>
                                    <div className="col-8">
                                        <h5>{item.name}</h5>
                                        <p>Quantity: {item.quantity}</p>
                                        <p>Price: {item.price.toFixed(2)} đ</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="total-amount">
                        Total Amount: {total.toFixed(2)} đ
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
