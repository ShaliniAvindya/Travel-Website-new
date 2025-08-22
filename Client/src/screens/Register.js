import { useState } from 'react';
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from 'axios';

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      Swal.fire({
        title: 'Error!',
        text: 'Please enter a valid email address.',
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
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      Swal.fire({
        title: 'Error!',
        text: 'Passwords do not match.',
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
      return;
    }
    if (!agreeTerms) {
      setError('You must agree to the terms');
      Swal.fire({
        title: 'Error!',
        text: 'You must agree to the terms.',
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
      return;
    }
    try {
      const response = await axios.post('https://travel-website-new-dp4q-backend.vercel.app/api/users/register', { firstName, lastName, email, password }, { withCredentials: true });
      if (response.status === 201) {
        Swal.fire({
          title: 'Registration Successful!',
          text: 'Your account has been successfully created. Please log in to continue.',
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
          navigate('/admin');
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      Swal.fire({
        title: 'Error!',
        text: err.response?.data?.message || 'Registration failed. Please try again.',
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
    <div className="min-h-screen flex flex-col bg-slate-500">
      <div className="relative z-10 flex flex-col items-center justify-center px-4 py-10 pt-36">
        <div className="w-full max-w-xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Welcome to Admin</h1>
          </div>
          <div className="bg-gradient-to-b from-blue-900/90 to-blue-950/9 backdrop-blur-lg rounded-xl shadow-2xl p-8 w-full z-20">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white">Create Account</h2>
              <div className="mt-3 w-16 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 mx-auto rounded-full"></div>
            </div>

            {error && <p className="text-red-500 text-center mb-4">{error}</p>}

            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="first-name" className="block text-sm font-medium text-white mb-1">
                    First Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <input
                      id="first-name"
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="block w-full pl-10 pr-3 py-3 bg-black/20 border border-cyan-900/30 text-white rounded-lg focus:ring-cyan-500 focus:border-cyan-500 placeholder-gray"
                      placeholder="John"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="last-name" className="block text-sm font-medium text-white mb-1">
                    Last Name
                  </label>
                  <input
                    id="last-name"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="block w-full px-3 py-3 bg-black/20 border border-cyan-900/30 text-white rounded-lg focus:ring-cyan-500 focus:border-cyan-500 placeholder-gray"
                    placeholder="Doe"
                  />
                </div>
              </div>
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
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 bg-black/20 border border-cyan-900/30 text-white rounded-lg focus:ring-cyan-500 focus:border-cyan-500 placeholder-gray"
                    placeholder="yourname@example.com"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-white mb-1">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-white" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-10 py-3 bg-black/20 border border-cyan-900/30 text-white rounded-lg focus:ring-cyan-500 focus:border-cyan-500 placeholder-gray"
                    placeholder="••••••••"
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
                <p className="mt-1 text-xs text-white">
                  Must be at least 8 characters with uppercase, lowercase, and numbers
                </p>
              </div>
              <div>
                <label htmlFor="confirm-password" className="block text-sm font-medium text-white mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-white" />
                  </div>
                  <input
                    id="confirm-password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="block w-full pl-10 pr-10 py-3 bg-black/20 border border-cyan-900/30 text-white rounded-lg focus:ring-cyan-500 focus:border-cyan-500 placeholder-gray"
                    placeholder="••••••••"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="text-white hover:text-cyan-200 focus:outline-none"
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="h-4 w-4 text-cyan-500 focus:ring-cyan-500 rounded border-cyan-400"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="terms" className="text-cyan-100">
                    I agree to the{' '}
                    <Link to="/terms" className="text-cyan-300 hover:text-cyan-200">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link to="/privacy" className="text-cyan-300 hover:text-cyan-200">
                      Privacy Policy
                    </Link>
                  </label>
                </div>
              </div>
              <div>
                <button
                  onClick={handleSubmit}
                  className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-lg font-medium transition-all transform hover:scale-105 ${
                    agreeTerms
                      ? 'text-white bg-gradient-to-r from-blue-900 to-blue-400 hover:from-blue-800 hover:to-blue-400'
                      : 'bg-gray-400/50 text-white cursor-not-allowed'
                  }`}
                  disabled={!agreeTerms}
                >
                  Create Account
                </button>
              </div>
            </div>
            <div className="mt-8 text-center">
              <p className="text-black">
                Already have an account?{' '}
                <Link to="/admin" className="text-black hover:text-cyan-200 font-medium">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

