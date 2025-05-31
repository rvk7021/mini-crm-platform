import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [loginLoading, setLoginLoading] = useState(false);
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };
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

        if (!formData.email || !formData.password) {
            setError("Email and password are required.");
            return;
        }

        setLoginLoading(true);
        try {
            const response = await fetch(`${process.env.REACT_APP_BASE_URL}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include", 
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password
                })
            });

            const data = await response.json(); 

            if (data.success) {
                localStorage.setItem("authToken",data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                setLoginLoading(false);
                navigate('/home'); 
            } else {
                setLoginLoading(false);
                setError(data.message || "Login failed. Please try again.");
            }

        } catch (error) {
            setLoginLoading(false);
            setError("An error occurred while logging in. Please try again.");
            console.error("Login error:", error);
        }
    };


    const handleGoogleAuth = () => {
        setLoading(true);
        // Simulate Google OAuth
        setTimeout(() => {
            setLoading(false);
            setSuccess("Successfully signed in with Google!");
        }, 1500);
    };

    const handleSignupRedirect = () => {
        navigate('/signup');
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
                        Welcome Back
                    </h1>
                    <p className="text-blue-700 text-sm sm:text-base font-medium">
                        Sign in to access your CRM dashboard
                    </p>
                </div>

                {/* Main Card */}
                <div className="bg-white/90 backdrop-blur-sm border border-white/50 rounded-2xl sm:rounded-3xl shadow-2xl shadow-blue-500/10 p-6 sm:p-8">
                    {/* Google Sign In Button */}
                    <button
                        onClick={handleGoogleAuth}
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-3 bg-white border-2 border-blue-100 rounded-xl sm:rounded-2xl py-3 sm:py-4 px-4 sm:px-6 font-medium hover:border-blue-200 hover:bg-blue-50/50 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 mb-6 disabled:opacity-50 text-sm sm:text-base shadow-md"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        <span className="hidden sm:inline">
                            {loading ? "Connecting..." : "Sign in with Google"}
                        </span>
                        <span className="sm:hidden">
                            {loading ? "Connecting..." : "Google Sign in"}
                        </span>
                    </button>

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
                                    placeholder="Enter your password"
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
                            {loginLoading ? (
                                <div className="flex items-center justify-center gap-2">
                                    <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    <span className="hidden sm:inline">Signing In...</span>
                                    <span className="sm:hidden">Signing In...</span>
                                </div>
                            ) : (
                                "Sign In"
                            )}
                        </button>

                        {/* Signup Link */}
                        <div className="text-center pt-4 border-t border-blue-100">
                            <p className="text-gray-600 text-sm mb-3">
                                Don't have an account?
                            </p>
                            <button
                                type="button"
                                onClick={handleSignupRedirect}
                                className="text-blue-600 hover:text-blue-700 font-semibold text-sm sm:text-base hover:underline transition-all duration-200"
                            >
                                Create a new account
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}