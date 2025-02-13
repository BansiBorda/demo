import React, { useState } from 'react';
import { Form, Input, Button, Typography, message } from 'antd';
import { UserAddOutlined, InstagramOutlined } from '@ant-design/icons';
import { signup } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import './Signup.css';

const Signup = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await signup(values.name, values.email, values.password);
      message.success('Signup Successful');
      navigate('/login');
    } catch (error) {
      message.error('Signup Failed: ' + error.response?.data?.message);
    }
    setLoading(false);
  };

  return (
    <React.Fragment>
      <div className="signup-container">
        <div className="signup-wrapper">
          <div className="signup-card">
            <InstagramOutlined className="instagram-logo" />

            <Typography.Title
              level={3}
              className="signup-title"
            >
              Create Your Account
            </Typography.Title>

            <Form
              onFinish={onFinish}
              className="signup-form"
            >
              <Form.Item
                name="name"
                rules={[{
                  required: true,
                  message: 'Please input your full name!'
                }]}
              >
                <Input
                  placeholder="Full Name"
                  className="signup-input"
                />
              </Form.Item>

              <Form.Item
                name="email"
                rules={[{
                  required: true,
                  message: 'Please input your email!',
                  type: 'email'
                }]}
              >
                <Input
                  placeholder="Email"
                  className="signup-input"
                />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[{
                  required: true,
                  message: 'Please input your password!',
                  min: 6
                }]}
              >
                <Input.Password
                  placeholder="Password"
                  className="signup-input"
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  block
                  icon={<UserAddOutlined />}
                  className="signup-button"
                >
                  Sign Up
                </Button>
              </Form.Item>
            </Form>

            <div className="login-link">
              Already have an account?
              <a onClick={() => navigate('/login')}>
                Log In
              </a>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Signup;