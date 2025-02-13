import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './component/Auth/Login';
import Signup from './component/Auth/Signup';
import HomePage from './component/Post/Home/Home';
import { Layout } from 'antd';
import Logout from './component/Auth/Logout';

const { Content } = Layout;

const App = () => {
  const isAuthenticated = () => !!localStorage.getItem('token');

  const PrivateRoute = ({ children }) => {
    return isAuthenticated() ? children : <Navigate to="/login" />;
  };

  return (
    <BrowserRouter>
      <Layout style={{ minHeight: '100vh' }}>
        <Content>
          <Routes>
            <Route
              path="/login"
              element={!isAuthenticated() ? <Login /> : <Navigate to="/home" />}
            />
            <Route
              path="/signup"
              element={!isAuthenticated() ? <Signup /> : <Navigate to="/home" />}
            />
             <Route
              path="/logout"
              element={!isAuthenticated() ? <Logout /> : <Navigate to="/login" />}
            />
            <Route
              path="/home"
              element={
                <PrivateRoute>
                  <HomePage />
                </PrivateRoute>
              }
            />
            <Route
              path="/"
              element={<Navigate to={isAuthenticated() ? "/home" : "/login"} />}
            />
          </Routes>
        </Content>
      </Layout>
    </BrowserRouter>
  );
};

export default App;