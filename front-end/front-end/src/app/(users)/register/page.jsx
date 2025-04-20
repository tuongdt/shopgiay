"use client";
import * as Yup from "yup";
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { registerSuccess, registerFailure } from '../../../redux/slices/authSlice'; // Ensure path is correct
import "../../../../public/bootstrap/css/haha.css";
import { useFormik } from "formik";

const Register = () => {
    const dispatch = useDispatch();
    const error = useSelector((state) => state.auth.error); 

    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => {
                dispatch(registerFailure(null)); 
            }, 5000); 
            return () => clearTimeout(timer); 
        }
    }, [error, dispatch]);

    const handleSubmit = async (values) => {
        try {
            const response = await axios.post('http://localhost:3000/users/register', values);

            if (response.status === 201) {
                dispatch(registerSuccess(response.data));
                alert('Đăng ký thành công');
            } else {
                throw new Error('Đăng ký thất bại');
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'bạn đã đăng ký tài khoản này rồi .';
            dispatch(registerFailure(errorMessage));
        }
    };

    const validationSchema = Yup.object({
        username: Yup.string().required("Tên người dùng là bắt buộc"),
        email: Yup.string()
            .email("Email không hợp lệ")
            .required("Email là bắt buộc"),
        password: Yup.string()
            .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
            .required("Mật khẩu là bắt buộc")
            .matches(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/,
                "Mật khẩu phải chứa ít nhất một chữ hoa, thường và số"
            ),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('password'), null], "Mật khẩu xác nhận không khớp")
            .required("Xác nhận mật khẩu là bắt buộc"),
        phone: Yup.string()
            .matches(/^(0\d{9})?$/, "Số điện thoại phải bắt đầu bằng số 0 và có đúng 10 ký tự hoặc có thể bỏ trống"),
        address: Yup.string().required("Địa chỉ là bắt buộc"),
    });

    const formik = useFormik({
        initialValues: {
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
            phone: "",
            address: "",
        },
        validationSchema,
        onSubmit: (values) => {
            handleSubmit(values);
        },
    });

    return (
        <div className="container d-flex justify-content-center align-items-center">
            <div className="form-container sign-in-container">
                {error && <div className="alert alert-danger">{error}</div>}
                <form className="form" onSubmit={formik.handleSubmit}>
                    <h1>Đăng Ký</h1>
                    <div className="social-container">
                        <a href="#" className="social"><i className="bi bi-facebook"></i></a>
                        <a href="#" className="social"><i className="bi bi-google"></i></a>
                        <a href="#" className="social"><i className="bi bi-instagram"></i></a>
                    </div>

                    <label htmlFor="username" className="form-label">Tên người dùng</label>
                    <input
                        type="text"
                        className="form-control"
                        id="username"
                        placeholder="Nhập tên người dùng"
                        name="username"
                        value={formik.values.username}
                        onChange={formik.handleChange}
                    />
                    {formik.errors.username ? <div className="text-danger">{formik.errors.username}</div> : null}

                    <label htmlFor="email" className="form-label">Địa chỉ Email</label>
                    <input
                        type="email"
                        className="form-control"
                        id="email"
                        placeholder="Nhập email"
                        name="email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                    />
                    {formik.errors.email ? <div className="text-danger">{formik.errors.email}</div> : null}

                    <label htmlFor="password" className="form-label">Mật khẩu</label>
                    <input
                        type="password"
                        className="form-control"
                        id="password"
                        placeholder="Mật khẩu"
                        name="password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                    />
                    {formik.errors.password ? <div className="text-danger">{formik.errors.password}</div> : null}

                    <label htmlFor="confirmPassword" className="form-label">Xác nhận mật khẩu</label>
                    <input
                        type="password"
                        className="form-control"
                        id="confirmPassword"
                        placeholder="Xác nhận mật khẩu"
                        name="confirmPassword"
                        value={formik.values.confirmPassword}
                        onChange={formik.handleChange}
                    />
                    {formik.errors.confirmPassword ? <div className="text-danger">{formik.errors.confirmPassword}</div> : null}

                    <label htmlFor="phone" className="form-label">Số điện thoại</label>
                    <input
                        type="tel"
                        className="form-control"
                        id="phone"
                        placeholder="Nhập số điện thoại"
                        name="phone"
                        value={formik.values.phone}
                        onChange={formik.handleChange}
                    />
                    {formik.errors.phone ? <div className="text-danger">{formik.errors.phone}</div> : null}

                    <label htmlFor="address" className="form-label">Địa chỉ</label>
                    <input
                        type="text"
                        className="form-control"
                        id="address"
                        placeholder="Nhập địa chỉ"
                        name="address"
                        value={formik.values.address}
                        onChange={formik.handleChange}
                    />
                    {formik.errors.address ? <div className="text-danger">{formik.errors.address}</div> : null}

                    <button className="btn btn-primary" type="submit">
                        Đăng Ký
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Register;
