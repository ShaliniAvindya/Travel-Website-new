import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://travel-website-new-dp4q-backend.vercel.app/api/users/login', { email, password, rememberMe }, { withCredentials: true });
      if (response.status === 200) {
        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
        }
        Swal.fire({
          title: 'Login Successful!',
          text: 'You have successfully logged in as an admin.',
          icon: 'success',
          confirmButtonText: 'OK',
          customClass: {
            popup: 'bg-white rounded-[16px] shadow-2xl p-6',
            title: 'text-[1.25rem] font-semibold text-blue-900',
            content: 'text-[1rem] text-gray-700',
            confirmButton: 'bg-gradient-to-r from-[#016170] to-cyan-600 hover:from-[#016170] hover:to-cyan-500 text-white px-4 py-2 rounded-lg text-[1rem] font-bold transition transform hover:scale-105 shadow-lg hover:shadow-xl',
          },
          buttonsStyling: false,
          background: '#fff',
          showClass: {
            popup: 'animate-fadeIn',
          },
        }).then(() => {
          const from = (location.state && location.state.from) || '/admin';
          navigate(from, { replace: true });
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      Swal.fire({
        title: 'Error!',
        text: err.response?.data?.message || 'Login failed. Please try again.',
        icon: 'error',
        confirmButtonText: 'OK',
        customClass: {
          popup: 'bg-white rounded-[16px] shadow-2xl p-6',
          title: 'text-[1.25rem] font-semibold text-blue-900',
          content: 'text-[1rem] text-gray-700',
          confirmButton: 'bg-gradient-to-r from-[#016170] to-cyan-600 hover:from-[#016170] hover:to-cyan-500 text-white px-4 py-2 rounded-lg text-[1rem] font-bold transition transform hover:scale-105 shadow-lg hover:shadow-xl',
        },
        buttonsStyling: false,
        background: '#fff',
        showClass: {
          popup: 'animate-fadeIn',
        },
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-400">
      <div className="relative z-10 flex flex-col items-center justify-center px-4 py-10 pt-36">
        <div className="w-full max-w-lg">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Welcome Back</h1>
          </div>
          <div className="bg-gradient-to-b from-blue-900/90 to-blue-950/9 backdrop-blur-lg rounded-xl shadow-2xl p-8 w-full z-20">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white">Sign In</h2>
              <div className="mt-3 w-16 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 mx-auto rounded-full"></div>
            </div>

            {error && <p className="text-red-500 text-center mb-4">{error}</p>}

            <form onSubmit={handleSubmit} action="/api/users/login" method="POST">
              <div className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-white mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-white" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="username"
                      className="block w-full pl-10 pr-3 py-3 bg-black/20 border border-cyan-900/30 text-white rounded-lg focus:ring-cyan-500 focus:border-cyan-500 placeholder-cyan-200/60"
                      placeholder="yourname@example.com"
                      required
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label htmlFor="password" className="block text-sm font-medium text-white">
                      Password
                    </label>
                    <Link to="/forgot-password" className="text-sm text-white hover:text-cyan-200">
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-white" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="current-password"
                      className="block w-full pl-10 pr-10 py-3 bg-black/20 border border-cyan-900/30 text-white rounded-lg focus:ring-cyan-500 focus:border-cyan-500 placeholder-cyan-200/60"
                      placeholder="••••••••"
                      required
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-white hover:text-cyan-200 focus:outline-none"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>
                </div>
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 text-white focus:ring-cyan-500 rounded border-cyan-400"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-white">
                    Remember me
                  </label>
                </div>
                <div>
                  <button
                    type="submit"
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-lg text-white bg-gradient-to-r from-blue-900 to-blue-400 hover:from-blue-800 hover:to-blue-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 font-medium transition-all transform hover:scale-105"
                  >
                    Sign In
                  </button>
                </div>
              </div>
            </form>
            <div className="mt-8 text-center">
              <p className="text-gray">
                Don't have an account?{' '}
                <Link to="/register" className="text-gary font-medium">
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
