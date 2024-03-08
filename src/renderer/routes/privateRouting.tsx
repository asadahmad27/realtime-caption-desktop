import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getToken } from '../utils/localStorage';
import Navbar from '../components/commonComponents/Navbar/Navbar';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();

  const checkAccess = async () => {
    if (!getToken()) {
      navigate('/');
    }
  };

  useEffect(() => {
    checkAccess();
  }, [navigate]);

  if (getToken()) {
    return (
      <>
        <Navbar />
        {children}
      </>
    );
  }

  return null;
};

export default PrivateRoute;
