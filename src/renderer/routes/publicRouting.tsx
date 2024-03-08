import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { getToken } from '../utils/localStorage';

interface PublicRouteProps {
  children: ReactNode;
  restricted: boolean;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children, restricted }) => {
  return getToken() && restricted ? <Navigate to="/home" /> : <>{children}</>;
};

export default PublicRoute;
