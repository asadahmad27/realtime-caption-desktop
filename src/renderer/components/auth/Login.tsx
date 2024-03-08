import { useState } from 'react';
import { Form } from 'antd';
import aabBooksLogo from '../../../../assets/iconsCustom/aabBooksLogo.svg';
import { AABBooksInput, AABBooksButton } from '../commonComponents';
import './styles.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  type FormValues = {
    email: string;
    password: string;
  };

  const onFinish = async (values: FormValues) => {};

  return (
    <div className="loginContainer">
      <div className="loginForm">
        <div className="logoContainer">{<img src={aabBooksLogo} />}</div>
        <Form
          name="signin-form"
          onFinish={onFinish}
          initialValues={{ remember: true }}
          layout="vertical"
          wrapperCol={{ span: 24 }}
          labelCol={{ span: 24 }}
        >
          <div className="emailInputContainer">
            <AABBooksInput
              name="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => {
                const value = e.target.value;
                const emailRegex =
                  /^([+\w-]+(?:.[+\w-]+))@((?:[\wÅÄÖåäö-]+.)\w[\w-ÅÄÖåäö]{0,66}).([a-zA-Z]{2,6}(?:.[a-zA-Z-å ]{2})?|\u00E4\u00E5\u00F6\u00C4\u00C5\u00D6)$/i;

                if (emailRegex.test(value)) {
                  setEmail(value);
                } else {
                  setEmail('');
                }
              }}
              rules={[
                { required: true, message: 'Please enter your email!' },
                {
                  validator: (_: any, value: string) => {
                    if (value) {
                      const emailRegex =
                        /^([+\w-]+(?:.[+\w-]+))@((?:[\wÅÄÖåäö-]+.)\w[\w-ÅÄÖåäö]{0,66}).([a-zA-Z]{2,6}(?:.[a-zA-Z-å ]{2})?|\u00E4\u00E5\u00F6\u00C4\u00C5\u00D6)$/i;

                      if (!emailRegex.test(value)) {
                        return Promise.reject(
                          'Please enter a valid email address',
                        );
                      }
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            />
          </div>
          <div className="passwordInputContainer">
            <AABBooksInput
              name="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              rules={[
                { required: true, message: 'Please enter your password!' },
                {
                  validator: (_: any, value: string) => {
                    if (value) {
                      const missingRequirements = [];

                      if (value.length < 8) {
                        missingRequirements.push('at least 8 characters');
                      }
                      if (!/[a-z]/.test(value)) {
                        missingRequirements.push('lowercase');
                      }
                      if (!/[A-Z]/.test(value)) {
                        missingRequirements.push('uppercase');
                      }
                      if (!/\d/.test(value)) {
                        missingRequirements.push('number');
                      }
                      if (!/[^a-zA-Z0-9]/.test(value)) {
                        missingRequirements.push('special character');
                      }

                      if (missingRequirements.length > 0) {
                        return Promise.reject(
                          `Password must contain ${missingRequirements.join(
                            ', ',
                          )}.`,
                        );
                      }
                    }

                    return Promise.resolve();
                  },
                },
              ]}
            />
          </div>
          <div className="forgotPasswordContainer">
            <p>Forgot Password?</p>
          </div>
          <AABBooksButton width="100%" height="60px" label={'Login'} />
        </Form>
      </div>
    </div>
  );
};

export default Login;
