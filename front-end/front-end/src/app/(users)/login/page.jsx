 "use client"

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import "../../../../public/bootstrap/css/haha.css";
import { loginSuccess, loginFailure } from '../../../redux/slices/authSlice';

const Login = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [error, setError] = useState('');
    const [showForgotPassword, setShowForgotPassword] = useState(false);  // State to toggle Forgot Password form
    const [email, setEmail] = useState('');
    const dispatch = useDispatch();
    const router = useRouter();

    const onSubmit = async (data) => {
        try {
            const response = await axios.post('http://localhost:3000/users/login', {
                email: data.email,
                password: data.password
            });
    
            if (response.data && response.data.token && response.data.user) {
                dispatch(loginSuccess(response.data));
                const token = response.data.token;
                document.cookie = `token=${token}; path=/; max-age=${60 * 60}`;
                const payload = JSON.parse(atob(token.split('.')[1]));
                console.log(payload);
    
                if (payload.role === 'admin') {
                    router.push('http://localhost:3001/admin');
                } else {
                    router.push('/');
                }
            } else {
                setError('Thông tin đăng nhập không hợp lệ.');
                dispatch(loginFailure('Thông tin đăng nhập không hợp lệ.'));
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Đã xảy ra lỗi. Vui lòng thử lại.';
            setError(errorMessage);
            dispatch(loginFailure(errorMessage));
        }
    };

    // Handle Forgot Password form submission
    const handleForgotPassword = async () => {
        try {
            const response = await axios.post('http://localhost:3000/users/forgot-password', { email });
            if (response.data) {
                alert('Link reset mật khẩu đã được gửi vào email của bạn!');
                setShowForgotPassword(false);
            }
        } catch (err) {
            alert('Đã có lỗi xảy ra. Vui lòng thử lại.');
        }
    };

    return (
        <>
            <div className="container containerner d-flex justify-content-center align-items-center">
                <div className="form-container sign-in-container">
                    <form className="form" onSubmit={handleSubmit(onSubmit)}>
                        <h1>Sign in</h1>
                        <div className="social-container">
                            <a href="#" className="social"><i className="bi bi-facebook"></i></a>
                            <a href="#" className="social"><i className="bi bi-google"></i></a>
                            <a href="#" className="social"><i className="bi bi-instagram"></i></a>
                        </div>
                        <span className="span">or use your account</span>
                        <input
                            className="input"
                            type="email"
                            placeholder="Email"
                            {...register('email', { required: 'Email is required' })}
                        />
                        {errors.email && <p className="error">{errors.email.message}</p>}
                        <input
                            className="input"
                            type="password"
                            placeholder="Password"
                            {...register('password', { required: 'Password is required' })}
                        />
                        {errors.password && <p className="error">{errors.password.message}</p>}
                        <a className="a" href="#" onClick={() => setShowForgotPassword(true)}>Forgot your password?</a>
                        <button className="button" type="submit">Sign In</button>
                        {error && <div className="error">{error}</div>}
                    </form>
                </div>
            </div>

            {/* Forgot Password Form (Modal or Popup) */}
            {showForgotPassword && (
                <div className="forgot-password-container" >
    <div className="modal fade show d-block" tabIndex="-1" aria-labelledby="forgotPasswordModalLabel" aria-hidden="true">
        {/* Modal Backdrop */}
        <div className="fade show"></div>

        <div className="modal-dialog">
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title" id="forgotPasswordModalLabel">Quên mật khẩu?</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => setShowForgotPassword(false)}></button>
                </div>
                <div className="modal-body">
                    <form>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Nhập email của bạn</label>
                            <input
                                type="email"
                                className="form-control"
                                id="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </form>
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={() => setShowForgotPassword(false)}>Đóng</button>
                    <button type="button" className="btn btn-primary" onClick={handleForgotPassword}>Gửi</button>
                </div>
            </div>
        </div>
    </div>
</div>
            )}
        </>
    );
};

export default Login;
