"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { loginUser } from "../../redux/authSlice";

export default function Login() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { loading, error, user } = useAppSelector((state) => state.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Dispatch login thunk
    const resultAction = await dispatch(loginUser({ email, password }));

    // ✅ Type-safe check for fulfilled login
    if (loginUser.fulfilled.match(resultAction)) {
      router.push("/dashboard"); // Redirect on success
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-gray-100 to-amber-50">
      <div className="bg-white shadow-xl rounded-2xl overflow-hidden flex flex-col md:flex-row w-full max-w-5xl">
        {/* Left side (Form) */}
        <div className="w-full md:w-1/2 p-8 md:p-12">
          {/* Logo */}
          <div className="flex items-center mb-6">
            <img src="/images/logo.png" alt="Logo" className="h-16 w-auto mr-2" />
          </div>

          <h2 className="text-3xl font-bold mb-2 text-gray-900">Welcome to CycleIQ</h2>
          <p className="text-gray-500 mb-8">Please login to your account</p>

          <form onSubmit={handleSubmit}>
            {/* Email input */}
            <div className="mb-4">
              <label className="block text-gray-700 mb-1">Email</label>
              <div className="flex items-center border rounded-lg px-3 py-2">
                <input
                  type="email"
                  placeholder="Enter your Email"
                  className="w-full outline-none text-gray-700"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="ml-2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            {/* Remember me + Forgot */}
            <div className="flex items-center justify-between mb-6">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2 accent-orange-500" />
                <span className="text-gray-600 text-sm">Remember me</span>
              </label>
              <a href="#" className="text-blue-600 text-sm hover:underline">
                Forgot Password?
              </a>
            </div>

            {/* Login button */}
            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Log In"}
            </button>
          </form>

          {/* Error / Success Messages */}
          {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
          {user && <p className="text-green-600 text-sm mt-3">Welcome {user.email}</p>}

          {/* Role buttons */}
          <div className="grid grid-cols-3 gap-3 mt-6">
            {["Super Admin", "Admin", "Manager", "Restaurant", "Chef", "Waiter"].map(
              (role, i) => (
                <button
                  key={i}
                  type="button"
                  className="border-2 border-gray-300 text-gray-700 rounded-md py-2 text-sm font-semibold"
                >
                  {role}
                </button>
              )
            )}
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
            alt="Login Visual"
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}
