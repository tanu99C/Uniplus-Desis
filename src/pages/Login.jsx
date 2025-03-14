import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Container from "../components/ui/Container";
import Button from "../components/ui/Button";
import { auth, db } from "../lib/firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import Card from "../components/ui/Card";
import { toast } from "@/hooks/use-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userDocRef = doc(db, "loginPage", "userDetails");
      const userDocSnap = await getDoc(userDocRef);

      if (!userDocSnap.exists() || !userDocSnap.data()[`user_${user.uid}`]) {
        throw new Error("User details not found in database");
      }
      const usersData = userDocSnap.data(); // Get the entire document's data
      const userData = userDocSnap.data()[`user_${user.uid}`];
      if (!userData) {
        throw new Error("User not found in userDetails document");
      }
      toast({
        title: "Login successful",
        description: `Welcome back, ${userData.name}!`,
      });

      navigate("/");
    } catch (err) {
      setError(err.message || "Failed to login. Please check your credentials.");
      toast({
        title: "Login failed",
        description: err.message || "Please check your credentials and try again",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
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
                  type="email"
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
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-uniplus-500 focus:border-uniplus-500"
                  placeholder="••••••••"
                />
              </div>

              <div className="pt-2">
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Signing in..." : "Sign in"}
                </Button>
              </div>
            </form>
          </Card.Content>

          <div className="text-center mt-4 pb-4">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
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
            By signing in, you agree to our{" "}
            <Link
              to="/terms"
              className="text-uniplus-600 hover:text-uniplus-500 transition-colors"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
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