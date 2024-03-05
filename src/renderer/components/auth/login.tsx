import { useState } from 'react';
import logo from '../../../../assets/icons/aabBooksLogo.svg';
import { AABBooksInput, AABBooksButton } from '../commonComponents';
import './styles.css';

const LoginComponent = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: any) => {
    e.preventDefault();
  };

  return (
    <div className="loginContainer">
      <div className="loginForm">
        <div className="logoContainer">{<img src={logo} />}</div>

        <form onSubmit={handleLogin}>
          <div className="emailInputContainer">
            <AABBooksInput
              name="email"
              placeholder="Enter your email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="passwordInputContainer">
            <AABBooksInput
              name="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="forgotPasswordContainer">
            <p>Forgot Password</p>
          </div>
          <AABBooksButton width="100%" height="60px" label={'Login'} />
        </form>
      </div>
    </div>
  );
};

export default LoginComponent;
