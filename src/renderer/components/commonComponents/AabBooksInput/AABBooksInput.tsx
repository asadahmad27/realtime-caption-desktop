import React, { forwardRef, useState } from 'react';
import { Form, Input } from 'antd';
import PasswordEyeIcon from '../../../../../assets/iconsCustom/passwordEyeIcon.svg';
import './AABBooksInput.css';

interface AABBooksInputProps {
  name?: string;
  placeholder?: string;
  rules?: Array<any>;
  ref?: any;
  value?: string;
  className?: any;
  onChange?: (_e: React.ChangeEvent<HTMLInputElement>) => void;
}

const AABBooksInput = forwardRef<HTMLInputElement, AABBooksInputProps>(
  ({ name, value, placeholder, rules, ...restProps }, ref) => {
    const isPassword = name === 'password' || name === 'confirmpassword';
    const [passwordVisible, setPasswordVisible] = useState(false);

    const togglePasswordVisibility = () => {
      setPasswordVisible(!passwordVisible);
    };

    return (
      <>
        <Form.Item name={name} rules={rules} className="inputStyle">
          {isPassword ? (
            <div style={{ position: 'relative' }}>
              <Input
                type={passwordVisible ? 'text' : 'password'}
                placeholder={placeholder}
                autoComplete="off"
                {...restProps}
              />
              {!passwordVisible ? (
                <img
                  src={PasswordEyeIcon}
                  className="passwordToggle"
                  onClick={togglePasswordVisibility}
                />
              ) : (
                <img
                  src={PasswordEyeIcon}
                  className="passwordToggle"
                  onClick={togglePasswordVisibility}
                />
              )}
            </div>
          ) : (
            <Input
              placeholder={placeholder}
              autoComplete="off"
              aria-autocomplete="none"
              ref={ref}
              {...restProps}
            />
          )}
        </Form.Item>
      </>
    );
  },
);
export default AABBooksInput;
