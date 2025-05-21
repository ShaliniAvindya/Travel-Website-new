import { useState } from 'react';
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { Link } from 'react-router-dom'; 

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Registration submitted', { firstName, lastName, email, password, agreeTerms });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-cyan-900/90 to-blue-950/95">
    
      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center px-4 py-10 pt-36">
        <div className="w-full max-w-xl">
          {/* Hero Text */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Join Our Paradise Family</h1>
            <p className="text-lg text-cyan-100 max-w-md mx-auto">
              Create an account to unlock exclusive deals and start planning your dream Maldives vacation
            </p>
          </div>

          {/* Register Form Card */}
          <div className="bg-black/10 backdrop-blur-lg rounded-xl shadow-2xl p-8 w-full z-20">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white">Create Account</h2>
              <div className="mt-3 w-16 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 mx-auto rounded-full"></div>
            </div>

            <div className="space-y-5">
              {/* Name Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="first-name" className="block text-sm font-medium text-cyan-100 mb-1">
                    First Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-cyan-300" />
                    </div>
                    <input
                      id="first-name"
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="block w-full pl-10 pr-3 py-3 bg-black/20 border border-cyan-900/30 text-white rounded-lg focus:ring-cyan-500 focus:border-cyan-500 placeholder-cyan-200/60"
                      placeholder="John"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="last-name" className="block text-sm font-medium text-cyan-100 mb-1">
                    Last Name
                  </label>
                  <input
                    id="last-name"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="block w-full px-3 py-3 bg-black/20 border border-cyan-900/30 text-white rounded-lg focus:ring-cyan-500 focus:border-cyan-500 placeholder-cyan-200/60"
                    placeholder="Doe"
                  />
                </div>
              </div>

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
                <label htmlFor="password" className="block text-sm font-medium text-cyan-100 mb-1">
                  Password
                </label>
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
                <p className="mt-1 text-xs text-cyan-200/80">
                  Must be at least 8 characters with uppercase, lowercase, and numbers
                </p>
              </div>

              {/* Confirm Password Field */}
              <div>
                <label htmlFor="confirm-password" className="block text-sm font-medium text-cyan-100 mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-cyan-300" />
                  </div>
                  <input
                    id="confirm-password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="block w-full pl-10 pr-10 py-3 bg-black/20 border border-cyan-900/30 text-white rounded-lg focus:ring-cyan-500 focus:border-cyan-500 placeholder-cyan-200/60"
                    placeholder="••••••••"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="text-cyan-300 hover:text-cyan-200 focus:outline-none"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Terms and Conditions */}
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

              {/* Submit Button */}
              <div>
                <button
                  onClick={handleSubmit}
                  className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-lg font-medium transition-all transform hover:scale-105 ${
                    agreeTerms
                      ? 'text-blue-900 bg-gradient-to-r from-cyan-400 to-blue-400 hover:from-cyan-300 hover:to-blue-300'
                      : 'bg-gray-400/50 text-cyan-200/60 cursor-not-allowed'
                  }`}
                  disabled={!agreeTerms}
                >
                  Create Account
                </button>
              </div>
            </div>

            <div className="mt-8 text-center">
              <p className="text-cyan-100">
                Already have an account?{' '}
                <Link to="/admin" className="text-cyan-300 hover:text-cyan-200 font-medium">
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

