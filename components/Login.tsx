import React, { useState } from 'react';
import { Triangle } from 'lucide-react';
import { Button } from './Button';
import { signIn, signUp, signInWithGoogle } from '../services/authService';

interface LoginProps {
  onLogin: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignUp) {
        // Sign up
        const { user, error: signUpError } = await signUp(email, password, name);
        if (signUpError) {
          setError(signUpError);
        } else if (user) {
          // Check if email confirmation is required
          if (user.identities && user.identities.length === 0) {
            setError('Please check your email to confirm your account before signing in.');
          } else {
            onLogin();
          }
        }
      } else {
        // Sign in
        const { user, error: signInError } = await signIn(email, password);
        if (signInError) {
          setError(signInError);
        } else if (user) {
          onLogin();
        }
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);

    try {
      const { error: googleError } = await signInWithGoogle();
      if (googleError) {
        setError(googleError);
        setLoading(false);
      }
      // Note: The page will redirect for OAuth, so we don't set loading to false
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left Panel - Dark / Brand */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#0F0F0F] text-white flex-col justify-between p-16 relative overflow-hidden">
        <div className="flex items-center gap-3 z-10">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Triangle className="w-5 h-5 text-black fill-black" />
          </div>
          <span className="font-bold text-xl tracking-tight">Feedback Assistant</span>
        </div>

        <div className="z-10 max-w-lg">
          <h1 className="text-6xl font-bold mb-6 tracking-tight leading-tight">
            Smarter Feedback, <br />
            <span className="text-primary">Faster.</span>
          </h1>
          <p className="text-gray-400 text-xl leading-relaxed">
            Leverage AI to create structured, impactful, and consistent feedback in a fraction of the time.
          </p>
        </div>

        <div className="z-10 text-sm text-gray-600">
          © 2024 Feedback Assistant Inc.
        </div>

        {/* Abstract shapes/bg */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gray-900 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/3"></div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50/50">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold text-gray-900">
              {isSignUp ? 'Create your account' : 'Sign in to your account'}
            </h2>
            <p className="mt-2 text-gray-600">
              {isSignUp
                ? 'Get started with Feedback Assistant'
                : 'Welcome back! Please enter your details.'}
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              {isSignUp && (
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    className="mt-1 block w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={loading}
                  />
                </div>
              )}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="mt-1 block w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="mt-1 block w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  minLength={6}
                />
                {isSignUp && (
                  <p className="mt-1 text-xs text-gray-500">
                    Password must be at least 6 characters
                  </p>
                )}
              </div>
            </div>

            <Button type="submit" className="w-full py-3 text-base" disabled={loading}>
              {loading ? 'Please wait...' : (isSignUp ? 'Create Account' : 'Sign In')}
            </Button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-50 text-gray-500">OR</span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full py-3"
              onClick={handleGoogleSignIn}
              disabled={loading}
            >
              Continue with Google
            </Button>

            <div className="text-center text-sm">
              <span className="text-gray-500">
                {isSignUp ? 'Already have an account? ' : 'New to Feedback Assistant? '}
              </span>
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError('');
                }}
                className="font-semibold text-gray-900 hover:text-black"
                disabled={loading}
              >
                {isSignUp ? 'Sign in' : 'Create an account'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};