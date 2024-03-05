import React, { forwardRef, useState } from 'react';
import { Form, Input } from 'antd';
import './AABBooksInput.css';

interface AABBooksInputsProps {
  name: string;
  value: string;
  placeholder: string;
  rules?: Array<any>;
  ref?: any;
  className?: any;
  onChange?: (_e: React.ChangeEvent<HTMLInputElement>) => void;
}

const AABBooksInputs = forwardRef<HTMLInputElement, AABBooksInputsProps>(
  ({ name, value, placeholder, rules, ...restProps }, ref) => {
    const isPassword = name === 'password' || name === 'confirmpassword';

    return (
      <>
        <Form.Item name={name} rules={rules} className="inputStyle">
          {isPassword ? (
            <div style={{ position: 'relative' }}>
              <Input.Password
                type={'password'}
                placeholder={placeholder}
                value={value}
                autoComplete="off"
                {...restProps}
              />
            </div>
          ) : (
            <Input
              placeholder={placeholder}
              autoComplete="off"
              value={value}
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
export default AABBooksInputs;
