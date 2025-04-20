"use client"
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { addToCart } from '@/redux/slices/counterSlice';
import ProductSale from '@/app/(users)/components/productsale';
import useSWR from 'swr';
import AddCartButton from '../../components/btnaddtocart';

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function Detail({ params }) {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('37'); // Set default size
  const [selectedColor, setSelectedColor] = useState('');
  const router = useRouter();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);

  const { data, error, isLoading } = useSWR(
    `http://localhost:3000/products/detail/${params.id}`,
    fetcher
  );

  if (error) return <strong>Error loading product details</strong>;
  if (isLoading) return <div className="loader">Loading...</div>;

  const handleAddToCart = (item, quantity, size, color) => {
    dispatch(addToCart({ item, quantity, size, color }));
    console.log('Added to cart successfully!');
    router.push('/cart');
  };

  if (!data) return <p>No product data available.</p>;

  // Default rating to 0 if not provided
  const rating = data.rating || 0;

  // Inline styles
  const styles = {
    colorItems: {
      display: 'flex',
      gap: '10px',
    },
    colorButton: {
      width: '30px',
      height: '30px',
      border: 'none',
      borderRadius: '50%',
      cursor: 'pointer',
      outline: 'none',
    },
    colorBlack: {
      backgroundColor: 'black',
    },
    colorWhite: {
      backgroundColor: 'white',
      border: '1px solid #ccc',
    },
    colorGreen: {
      backgroundColor: 'green',
    },
    colorBlue: {
      backgroundColor: 'blue',
    },
    colorButtonSelected: {
      border: '2px solid #000',
    },
    sizeItems: {
      display: 'flex',
      gap: '10px',
    },
    sizeButton: {
      backgroundColor: '#f0f0f0',
      border: '1px solid #ccc',
      borderRadius: '5px',
      padding: '10px',
      cursor: 'pointer',
      outline: 'none',
      fontSize: '16px',
    },
    sizeButtonActive: {
      backgroundColor: '#007bff',
      color: '#fff',
      borderColor: '#007bff',
    },
  };

  return (
    <div className="container mt-3">
      <div className="row">
        <div className="container-detail-all">
          <div className="detail_temple_1">
            <div className="detail_content_product_mota">
              <span>{data.description}</span>
            </div>
          </div>
          <div className="detail_temple_2">
            <div className="detail_temple_2_img_main">
              <img
                src={`http://localhost:3000/img/${data.image}`}
                alt={data.name}
              />
            </div>
            <div className="detail_temple_dieuhuong">
              <i className="bx bx-chevron-left"></i>
              <i className="bx bx-chevron-right"></i>
            </div>
          </div>
          <div className="detail_temple_3">
            <div className="detail_content_product_name">
              <h4>{data.name}</h4>
            </div>
            <div className="detail_temple_cannang">
              <h4>Size</h4>
              <div style={styles.sizeItems}>
                {['37', '38', '39', '40'].map((size) => (
                  <button
                    key={size}
                    style={{
                      ...styles.sizeButton,
                      ...(selectedSize === size ? styles.sizeButtonActive : {}),
                    }}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
            <div className="detail_temple_review">
              <h4>Reviews</h4>
              <div className="temple_review_start">
                {[...Array(5)].map((_, index) => {
                  const starRating = index + 1;
                  return (
                    <i
                      key={index}
                      className={
                        starRating <= rating
                          ? 'bi bi-star-fill'
                          : starRating === Math.ceil(rating)
                          ? 'bi bi-star-half'
                          : 'bi bi-star'
                      }
                      aria-hidden="true"
                    ></i>
                  );
                })}
              </div>
            </div>
            <div className="detail_temple_price">
              <h4>Price</h4>
              <div className="temple_price_two">
                <div className="temple_price_sale">
                  <span>{data.price}</span> VNĐ
                </div>
                <div className="temple_price_giagoc">
                  <del>{data.originalPrice}</del> VNĐ
                </div>
              </div>
            </div>
            <div className="detail_temple_cauhinh">
              <h4>Specifications</h4>
              <div className="temple_cauhinh_items">
                <b>{data.specifications}</b>
              </div>
            </div>
            <div className="detail_temple_color">
              <h4>Colors</h4>
              <div style={styles.colorItems}>
                {['black', 'white', 'green', 'blue'].map((color) => (
                  <button
                    key={color}
                    style={{
                      ...styles.colorButton,
                      ...(color === selectedColor ? styles.colorButtonSelected : {}),
                      ...(color === 'black' ? styles.colorBlack : {}),
                      ...(color === 'white' ? styles.colorWhite : {}),
                      ...(color === 'green' ? styles.colorGreen : {}),
                      ...(color === 'blue' ? styles.colorBlue : {}),
                    }}
                    onClick={() => setSelectedColor(color)}
                  ></button>
                ))}
              </div>
            </div>
            <div className="thanhtoan-4-1">
              <input
                min="1"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
              />
            </div>
            <div className="detail_temple_btn_all">
              <button
                className="detail_addtocart"
                onClick={() => handleAddToCart(data, quantity, selectedSize, selectedColor)}
              >
                Add to Cart
              </button>
              <button className="detail_buynow">Buy Now</button>
            </div>
          </div>
        </div>
      </div>
      <ProductSale />
    </div>
  );
}
