import React, { useState } from 'react';
import { Form, Input, Button, Typography, message } from 'antd';
import { LoginOutlined, InstagramOutlined } from '@ant-design/icons';
import { login } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await login(values.email, values.password);
      localStorage.setItem('token', response.data.token);
      message.success('Login Successful');
      navigate('/home');
    } catch (error) {
      message.error('Login Failed: ' + error.response?.data?.message);
    }
    setLoading(false);
  };

  return (
    <React.Fragment>
      <div className="login-container">
        <div className="login-wrapper">
          <div className="login-card">
            <InstagramOutlined className="instagram-logo" />

            <Typography.Title
              level={3}
              className="login-title"
            >
              Welcome
            </Typography.Title>

            <Form
              onFinish={onFinish}
              className="login-form"
            >
              <Form.Item
                name="email"
                rules={[{
                  required: true,
                  message: 'Please input your email!'
                }]}
              >
                <Input
                  placeholder="Email"
                  className="login-input"
                />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[{
                  required: true,
                  message: 'Please input your password!'
                }]}
              >
                <Input.Password
                  placeholder="Password"
                  className="login-input"
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  block
                  icon={<LoginOutlined />}
                  className="login-button"
                >
                  Log In
                </Button>
              </Form.Item>
            </Form>

            <div className="signup-link">
              Don&apos;t have an account?
              <a onClick={() => navigate('/signup')}>
                Sign Up
              </a>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Login;