import React from "react";
import HomePage from "../components/home";
import { HomeIcon, Earth, Users, ArrowRight, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router";

export default function History() {
  const navigate = useNavigate();

  async function handleClickC() {
    sessionStorage.setItem("htype", "created");
    navigate("/displayed-history");
  }

  async function handleClickV() {
    sessionStorage.setItem("htype", "viewed");
    navigate("/displayed-history");
  }

  function back() {
    navigate("/mainpage");
  }

  return (
    <>
      <div className="min-h-screen w-full bg-gradient-to-br  from-indigo-900 via-purple-900 to-pink-800 flex items-center justify-around p-6">
        <HomePage />
        <button
          onClick={back}
          className="absolute top-6 left-5 bg-white/10 border border-white/20 text-white p-2 rounded-full flex items-center justify-center hover:bg-white/20 transition-all duration-300 transform hover:scale-105"
          title="Go Back"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="w-9/12 max-w-4xl mx-auto flex  justify-around space-x-8 ">
          <div className="w-1/3 bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl transform hover:scale-105 transition-transform duration-300">
            <div className="text-center mb-8">
              <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Earth className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Created Polls
              </h1>
              <p className="text-gray-300">View all polls ever created!</p>
            </div>
            <button
              onClick={handleClickC}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-lg font-semibold flex items-center justify-center space-x-2 hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-300 transform hover:scale-[1.02]"
            >
              <span>Get Started</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          <div className="w-1/3 bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl transform hover:scale-105 transition-transform duration-300">
            <div className="text-center mb-8">
              <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Viewed Polls
              </h1>
              <p className="text-gray-300">View all polls involved in.</p>
            </div>
            <button
              onClick={handleClickV}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-lg font-semibold flex items-center justify-center space-x-2 hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-300 transform hover:scale-[1.02]"
            >
              <span>Join Now</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
