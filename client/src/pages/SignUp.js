import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import GoogleOAuth from "../auth/GoogleLogin";
import { GoogleOAuthProvider } from "@react-oauth/google";

export default function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [signupLoading, setSignupLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const GoogleAuthWrapper = () => {
    return (
      <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
        <GoogleOAuth />
      </GoogleOAuthProvider>
    );
  }

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 2000);

      return () => clearTimeout(timer);
    }
    if (success) {
      const timer = setTimeout(() => {
        setSuccess(null);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [error, success]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
      setError("All fields are required.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSignupLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password
        })
      })

      const data = await response.json();
      setLoading(false);
      if (data.success) {
        setSuccess("Signup successful! You can now log in.");
        setFormData({
          username: "",
          email: "",
          password: "",
          confirmPassword: ""
        });
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
      else {
        setSignupLoading(false);
        setError(data.message || "Signup failed. Please try again.");
      }
    } catch (error) {
      setSignupLoading(false);
      setError("An error occurred while signing up. Please try again.");
      console.error("Signup error:", error);
      return;
    }
  };

  const handleLoginRedirect = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 flex items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="max-w-md w-full">
        {/* Logo/Brand Section */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl mb-4 shadow-xl shadow-blue-500/25">
            <svg className="w-7 h-7 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
            Join CRM Pro
          </h1>
          <p className="text-blue-700 text-sm sm:text-base font-medium">
            Create your account to start managing customers
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white/90 backdrop-blur-sm border border-white/50 rounded-2xl sm:rounded-3xl shadow-2xl shadow-blue-500/10 p-6 sm:p-8">
          {/* Google Sign Up - Using the wrapper component */}
          <div className="mb-6 flex justify-center items-center">
            <GoogleAuthWrapper />
          </div>

          {/* Divider */}
          <div className="flex items-center mb-6">
            <div className="flex-1 border-t border-blue-200/60"></div>
            <span className="px-4 text-blue-600 font-medium text-lg">or</span>
            <div className="flex-1 border-t border-blue-200/60"></div>
          </div>

          {/* Form */}
          <div className="space-y-4 sm:space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-xl bg-blue-50/30 border-2 border-blue-100 text-gray-800 placeholder-blue-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-500/20 focus:bg-white transition-all duration-300 outline-none text-sm sm:text-base"
                placeholder="Enter your username"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-xl bg-blue-50/30 border-2 border-blue-100 text-gray-800 placeholder-blue-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-500/20 focus:bg-white transition-all duration-300 outline-none text-sm sm:text-base"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl bg-blue-50/30 border-2 border-blue-100 text-gray-800 placeholder-blue-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-500/20 focus:bg-white transition-all duration-300 outline-none pr-12 text-sm sm:text-base"
                  placeholder="Create a password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-blue-500 hover:text-blue-700 transition-colors"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-xl bg-blue-50/30 border-2 border-blue-100 text-gray-800 placeholder-blue-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-500/20 focus:bg-white transition-all duration-300 outline-none text-sm sm:text-base"
                placeholder="Confirm your password"
                required
              />
            </div>

            {/* Error and Success Messages */}
            {error && (
              <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm shadow-lg shadow-red-500/10">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 border-2 border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm shadow-lg shadow-green-500/10">
                {success}
              </div>
            )}

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white font-semibold py-3 sm:py-4 px-6 rounded-xl sm:rounded-2xl hover:from-blue-700 hover:via-blue-800 hover:to-indigo-800 transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:transform-none shadow-xl shadow-blue-500/30 text-sm sm:text-base"
            >
              {signupLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span className="hidden sm:inline">Creating Account...</span>
                  <span className="sm:hidden">Creating...</span>
                </div>
              ) : (
                "Create Account"
              )}
            </button>

            {/* Login Link */}
            <div className="text-center pt-4 border-t border-blue-100">
              <p className="text-gray-600 text-sm mb-3">
                Already have an account?
              </p>
              <button
                onClick={handleLoginRedirect}
                className="text-blue-600 hover:text-blue-700 font-semibold text-sm sm:text-base hover:underline transition-all duration-200"
              >
                Sign in to your account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}