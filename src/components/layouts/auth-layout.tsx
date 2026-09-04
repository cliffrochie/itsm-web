import * as React from 'react';
import { Outlet } from 'react-router-dom';

export interface AuthLayoutProps {
  children?: React.ReactNode;
}

export const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <div className="w-full max-w-md space-y-6">
        {children || <Outlet />}
      </div>
    </div>
  );
};

export default AuthLayout;
