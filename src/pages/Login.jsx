
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Container from '../components/ui/Container';
import  Button  from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth';
import Card from '../components/ui/Card';
import { toast } from "@/hooks/use-toast";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      await login(email, password);
      toast({
        title: "Login successful",
        description: "Welcome back to UniPlus!",
      });
      navigate('/');
    } catch (err) {
      setError(err.message || 'Failed to login. Please check your credentials.');
      toast({
        title: "Login failed",
        description: err.message || "Please check your credentials and try again",
        variant: "destructive"
      });
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-uniplus-50 py-12 px-4 sm:px-6 lg:px-8">
      <Container size="sm" className="animate-scale-in">
        <div className="flex justify-center mb-8">
          <Link to="/" className="flex items-center space-x-2">
            <div className="h-10 w-10 rounded-lg bg-uniplus-600 flex items-center justify-center">
              <span className="text-white font-bold text-xl">U+</span>
            </div>
            <span className="font-bold text-2xl">UniPlus</span>
          </Link>
        </div>
        
        <Card className="mx-auto w-full max-w-md">
          <Card.Header>
            <Card.Title className="text-2xl text-center">Welcome back</Card.Title>
            <Card.Description className="text-center">
              Enter your credentials to access your account
            </Card.Description>
          </Card.Header>
          
          <Card.Content>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4 text-sm">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-uniplus-500 focus:border-uniplus-500"
                  placeholder="your@email.com"
                />
              </div>
              
              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="block text-sm font-medium mb-1">
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-sm font-medium text-uniplus-600 hover:text-uniplus-500 transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-uniplus-500 focus:border-uniplus-500"
                  placeholder="••••••••"
                />
              </div>
              
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-uniplus-600 focus:ring-uniplus-500 border-border rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm">
                  Remember me
                </label>
              </div>
              
              <div className="pt-2">
                <Button
                  type="submit"
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? "Signing in..." : "Sign in"}
                </Button>
              </div>
            </form>
          </Card.Content>
          
          <div className="text-center mt-4 pb-4">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Link
                to="/signup"
                className="font-medium text-uniplus-600 hover:text-uniplus-500 transition-colors"
              >
                Sign up
              </Link>
            </p>
          </div>
        </Card>
        
        <div className="text-center mt-8">
          <p className="text-xs text-muted-foreground">
            By signing in, you agree to our{' '}
            <Link
              to="/terms"
              className="text-uniplus-600 hover:text-uniplus-500 transition-colors"
            >
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link
              to="/privacy"
              className="text-uniplus-600 hover:text-uniplus-500 transition-colors"
            >
              Privacy Policy
            </Link>
          </p>
        </div>
      </Container>
    </div>
  );
};

export default Login;
