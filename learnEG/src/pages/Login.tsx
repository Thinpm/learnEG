
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthForm from '@/components/AuthForm';
import Logo from '@/components/Logo';
import { useAuth } from '@/contexts/AuthContext';

const Login = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-background to-secondary/20">
      <div className="w-full max-w-md mb-8 text-center">
        <Logo size="lg" className="inline-flex justify-center" />
        <h1 className="mt-6 text-3xl font-bold tracking-tight">Welcome back</h1>
        <p className="mt-2 text-muted-foreground">Sign in to your account to continue</p>
      </div>
      
      <AuthForm />
      
      <p className="mt-8 text-center text-sm text-muted-foreground">
        By continuing, you agree to our{' '}
        <a href="#" className="font-medium text-primary underline underline-offset-4 hover:text-primary/80">
          Terms of Service
        </a>{' '}
        and{' '}
        <a href="#" className="font-medium text-primary underline underline-offset-4 hover:text-primary/80">
          Privacy Policy
        </a>
        .
      </p>
    </div>
  );
};

export default Login;
