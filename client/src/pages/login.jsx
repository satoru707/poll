import React, { useState, useEffect } from "react";
import { User, Lock, Mail, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom"; // Fixed import
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // Handle Google Auth Token from URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get("token");
    console.log(tokenFromUrl);

    if (tokenFromUrl) {
      sessionStorage.setItem("token", tokenFromUrl); // Store before setting state
      console.log("Google Auth Token stored:", tokenFromUrl);
      navigate("/mainpage"); // Navigate after storing token
    }
  }, [navigate]);

  // Handle Login Submission
  async function handleSubmit(e) {
    setIsLoading(true)
    e.preventDefault();
    setEmail("");
    setPassword("");

    try {
      const response = await axios.post(
        "http://localhost:3000/login",
        { email, password },
        { withCredentials: true }
      );

      const receivedToken = response.data.token;
      if (receivedToken) {
        sessionStorage.setItem("token", receivedToken); // Store immediately
        console.log("Login Token stored:", receivedToken);
        navigate("/mainpage");
      }
      setIsLoading(false)
    } catch (error) {
      console.error("Login error:", error);
      setIsLoading(false)
    }
  }

  // Handle Google OAuth Login
  async function handleGoogleAuth() {
    try {
      const response = await axios.get("http://localhost:3000/auth/google", {
        withCredentials: true,
      });
      window.location.href = response.data.url; // Redirect user to Google login
    } catch (error) {
      console.error("Google Auth error:", error);
    }
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 flex items-center justify-center p-6">
      <div className="w-full max-w-md mx-auto">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 transform hover:scale-105 transition-transform duration-300">
              <User className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
            <p className="text-gray-300">Login to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative group">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-hover:text-purple-400 transition-colors duration-300" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="w-full bg-white/10 border border-white/20 rounded-lg py-3 pl-12 pr-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                required
              />
            </div>

            <div className="relative group">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-hover:text-purple-400 transition-colors duration-300" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full bg-white/10 border border-white/20 rounded-lg py-3 pl-12 pr-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-lg font-semibold flex items-center justify-center space-x-2 hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-300 transform hover:scale-[1.02]"
            >
              <span>{isLoading ? 'Loading...' : 'Sign In' }</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/20"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 text-gray-400 bg-[#1a1f24]">
                  Or continue with
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGoogleAuth}
              className="w-full bg-white/10 border border-white/20 text-white py-3 rounded-lg font-semibold flex items-center justify-center space-x-2 hover:bg-white/20 transition-all duration-300 transform hover:scale-[1.02]"
            >
              <img
                src="https://www.google.com/favicon.ico"
                alt="Google"
                className="w-5 h-5"
              />
              <span>Google</span>
            </button>

            <p className="text-center text-gray-400 mt-8">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-purple-400 hover:text-purple-300 font-semibold transition-colors duration-300"
              >
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
