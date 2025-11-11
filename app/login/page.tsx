'use client';

import { useState } from 'react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login attempt:', { email, password });
  };

  return (
    
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-gray-100 to-amber-50">
      <div className="bg-white shadow-xl rounded-2xl overflow-hidden flex flex-col md:flex-row w-full max-w-5xl">
        {/* Left side (Form) */}
        <div className="w-full md:w-1/2 p-8 md:p-12">
          <div className="flex items-center mb-6">
            <img src="/images/logo.png" alt="Logo" className="h-16 w-auto mr-2" />
          </div>

          <h2 className="text-3xl font-bold mb-2 text-gray-900">Welcome to CycleIQ</h2>
          <p className="text-gray-500 mb-8">Please login in to your account</p>

          {/* Email input */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Email</label>
            <div className="flex items-center border rounded-lg px-3 py-2">
              
              <input type="email" placeholder="Enter your Email"
                className="w-full outline-none text-gray-700" />
            </div>
          </div>

          {/* Password input */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Password</label>
            <div className="flex items-center border rounded-lg px-3 py-2">
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="Password"
                className="w-full outline-none text-gray-700" 
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="ml-2 text-gray-500 hover:text-gray-700"
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

          {/* Remember me + Forgot */}
          <div className="flex items-center justify-between mb-6">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2 accent-orange-500" />
              <span className="text-gray-600 text-sm">Remember me</span>
            </label>
            <a href="#" className="text-blue-600 text-sm hover:underline">Forgot Password?</a>
          </div>

          {/* Login button */}
          <button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition">
            Log In
          </button>

          {/* Role buttons */}
          <div className="grid grid-cols-3 gap-3 mt-6">
            <button className="border-2 border-purple-400 text-purple-600 rounded-md py-2 text-sm font-semibold">Super Admin</button>
            <button className="border-2 border-green-400 text-green-600 rounded-md py-2 text-sm font-semibold">Admin</button>
            <button className="border-2 border-blue-400 text-blue-600 rounded-md py-2 text-sm font-semibold">Manager</button>
            <button className="border-2 border-orange-400 text-orange-600 rounded-md py-2 text-sm font-semibold">Restaurant</button>
            <button className="border-2 border-pink-400 text-pink-600 rounded-md py-2 text-sm font-semibold">Chef</button>
            <button className="border-2 border-lime-400 text-lime-600 rounded-md py-2 text-sm font-semibold">Waiter</button>
          </div>

          {/* Links */}
          <div className="flex justify-between text-sm text-gray-600 mt-6">
            <a href="#" className="hover:underline">Back Home</a>
            <a href="#" className="hover:underline">Create an Account</a>
          </div>
        </div>

        {/* Right side (Image) */}
        <div className="w-full md:w-1/2 hidden md:block">
          <img
            src="/images/login-page.jpeg"
            alt="Restaurant"
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}