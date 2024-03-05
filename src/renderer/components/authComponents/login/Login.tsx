import React, { useState } from 'react';
// import logo from '../../../../../assets/icons/aa';
import './Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: any) => {
    e.preventDefault();
    console.log('Logging in with:', username, password);
  };

  return (
    <div className="loginContainer">
      <div className="loginForm">
        <div className="logoContainer">{/* <img src={logo} /> */}</div>

        <form onSubmit={handleLogin}>
          <div className="formGroup">
            <input
              type="text"
              id="username"
              placeholder="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="formGroup">
            <input
              type="password"
              id="password"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
