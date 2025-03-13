
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Container from '../components/ui/Container';
import  Button  from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth';
import Card from '../components/ui/Card';
import { toast } from "@/hooks/use-toast";

const SignUp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const { signup, loading } = useAuth();
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Simple validation
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      toast({
        title: "Passwords do not match",
        description: "Please make sure your passwords match",
        variant: "destructive"
      });
      return;
    }
    
    try {
      await signup(name, email, password);
      toast({
        title: "Account created",
        description: "Welcome to UniPlus! Your account has been created successfully.",
      });
      navigate('/');
    } catch (err) {
      setError(err.message || 'Failed to create account. Please try again.');
      toast({
        title: "Sign up failed",
        description: err.message || "Failed to create your account. Please try again.",
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
            <Card.Title className="text-2xl text-center">Create an account</Card.Title>
            <Card.Description className="text-center">
              Sign up to access all UniPlus features
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
                <label htmlFor="name" className="block text-sm font-medium mb-1">
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-uniplus-500 focus:border-uniplus-500"
                  placeholder="Jane Doe"
                />
              </div>
              
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
                <p className="mt-1 text-xs text-muted-foreground">
                  We recommend using your university email
                </p>
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-1">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-uniplus-500 focus:border-uniplus-500"
                  placeholder="••••••••"
                />
              </div>
              
              <div>
                <label htmlFor="confirm-password" className="block text-sm font-medium mb-1">
                  Confirm Password
                </label>
                <input
                  id="confirm-password"
                  name="confirm-password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-uniplus-500 focus:border-uniplus-500"
                  placeholder="••••••••"
                />
              </div>
              
              <div className="flex items-center">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  required
                  className="h-4 w-4 text-uniplus-600 focus:ring-uniplus-500 border-border rounded"
                />
                <label htmlFor="terms" className="ml-2 block text-sm">
                  I agree to the{' '}
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
                </label>
              </div>
              
              <div className="pt-2">
                <Button
                  type="submit"
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? "Creating Account..." : "Create Account"}
                </Button>
              </div>
            </form>
          </Card.Content>
          
          <div className="text-center mt-4 pb-4">
            <p className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-medium text-uniplus-600 hover:text-uniplus-500 transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </Card>
      </Container>
    </div>
  );
};

export default SignUp;
