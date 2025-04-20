'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { addToCart } from '@/redux/slices/cartSlices'; // Đảm bảo import đúng từ cartSlices.js

function ProductCard({ data }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1); // Default quantity
  const [selectedSize, setSelectedSize] = useState('38'); // Default size
  const [selectedColor, setSelectedColor] = useState('white'); // Default color

  const handleAddToCart = (itemId, quantity, selectedSize, selectedColor) => {
    const item = data.find(product => product._id === itemId); // Find the item from data
    if (item) {
      dispatch(addToCart({ item, quantity, size: selectedSize, color: selectedColor }));
      console.log('Added to cart successfully!');
      router.push('/cart'); // Navigate to the cart page
    } else {
      console.error('Item not found in data');
    }
  };

  const handleDetail = (id) => {
    router.push(`/products/${id}`);
  };

  return (
    <>
      {data.map((product) => {
        const { _id, name, image, price, sale, rating } = product;
        const discountedPrice = ((price * (100 - sale)) / 100).toLocaleString('vi-VN', {
          style: 'currency',
          currency: 'VND',
        });
        const originalPrice = price.toLocaleString('vi-VN', {
          style: 'currency',
          currency: 'VND',
        });

        // Calculate the number of full stars and half stars
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        const totalStars = 5;

        return (
          <div className="col-sm-6 col-md-4 col-lg-3 my-3" key={_id}>
            <div className="nav-product-item">
              <div className="nav-product-item-img">
                <Link href={`/products/${_id}`}>
                  <img
                    src={`http://localhost:3000/img/${image}`}
                    alt={name}
                  />
                </Link>
              </div>
              <div className="nav-product-item-category">
                <span>nike</span>
              </div>
              <div className="nav-product-item-name">
                <h3>{name}</h3>
              </div>
              <div className="nav-product-item-price-sale">
                <div className="nav-product-item-price">
                  <h4>{discountedPrice}</h4>
                </div>
                <div className="nav-product-item-sale">
                  <del>{originalPrice}</del>
                </div>
              </div>
              <div className="nav-product-item-sale-top-img">
                <span>Giảm {sale}%</span>
              </div>
              <div className="nav-product-item-start">
                <div className="nav-product-item-start-items">
                  {[...Array(fullStars)].map((_, index) => (
                    <i key={`full-${index}`} className="bi bi-star-fill" aria-hidden="true"></i>
                  ))}
                  {hasHalfStar && (
                    <i className="bi bi-star-half" aria-hidden="true"></i>
                  )}
                  {[...Array(totalStars - fullStars - (hasHalfStar ? 1 : 0))].map((_, index) => (
                    <i key={`empty-${index}`} className="bi bi-star" aria-hidden="true"></i>
                  ))}
                </div>
                <div className="nav-product-item-start-danhgia">
                  <span>(55 Đánh Giá)</span>
                </div>
              </div>
              <div className="nav-product-item-view-heart-return">
                <div className="nav-product-item-view">
                  <a href="#">
                    <i className="bi bi-eye" aria-hidden="true"></i>
                  </a>
                </div>
                <div className="nav-product-item-heart">
                  <a href="#">
                    <i className="bi bi-heart" aria-hidden="true"></i>
                  </a>
                </div>
                <div className="nav-product-item-return">
                  <a href="#">
                    <i className="bi bi-arrow-counterclockwise" aria-hidden="true"></i>
                  </a>
                </div>
              </div>
              <div className="nav-product-item-button">
                <div className="nav-product-item-button-add-to-cart">
                  <button
                    className="detail_addtocart"
                    onClick={() => handleAddToCart(_id, quantity, selectedSize, selectedColor)}
                  >
                    Add to Cart
                  </button>
                </div>
                <div className="nav-product-item-button-buy-now">
                  <button onClick={() => handleDetail(_id)}>Xem Chi Tiết</button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
}

export default ProductCard;
