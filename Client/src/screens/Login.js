import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Link } from 'react-router-dom'; 
import Footer from '../components/Footer';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login submitted', { email, password, rememberMe });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-900/90 to-blue-950/95">     

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center px-4 py-10 pt-36">
        <div className="w-full max-w-lg">
          {/* Hero Text */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Welcome Back</h1>
            <p className="text-lg text-cyan-100 max-w-md mx-auto">
              Sign in to access your account and continue planning your dream Maldives getaway
            </p>
          </div>

          {/* Login Form Card */}
          <div className="bg-black/10 backdrop-blur-lg rounded-xl shadow-2xl p-8 w-full z-20">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white">Sign In</h2>
              <div className="mt-3 w-16 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 mx-auto rounded-full"></div>
            </div>

            <div className="space-y-6">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-cyan-100 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-cyan-300" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 bg-black/20 border border-cyan-900/30 text-white rounded-lg focus:ring-cyan-500 focus:border-cyan-500 placeholder-cyan-200/60"
                    placeholder="yourname@example.com"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="password" className="block text-sm font-medium text-cyan-100">
                    Password
                  </label>
                  <Link to="/forgot-password" className="text-sm text-cyan-300 hover:text-cyan-200">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-cyan-300" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-10 py-3 bg-black/20 border border-cyan-900/30 text-white rounded-lg focus:ring-cyan-500 focus:border-cyan-500 placeholder-cyan-200/60"
                    placeholder="••••••••"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-cyan-300 hover:text-cyan-200 focus:outline-none"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-cyan-500 focus:ring-cyan-500 rounded border-cyan-400"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-cyan-100">
                  Remember me
                </label>
              </div>

              {/* Submit Button */}
              <div>
                <button
                  onClick={handleSubmit}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-lg text-blue-900 bg-gradient-to-r from-cyan-400 to-blue-400 hover:from-cyan-300 hover:to-blue-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 font-medium transition-all transform hover:scale-105"
                >
                  Sign In
                </button>
              </div>
            </div>

            <div className="mt-8 text-center">
              <p className="text-cyan-100">
                Don't have an account?{' '}
                <Link to="/register" className="text-cyan-300 hover:text-cyan-200 font-medium">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

