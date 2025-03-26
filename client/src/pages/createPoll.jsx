import React from "react";
import {
  ArrowRight,
  ArrowLeft,
  Users,
  Circle,
  ToggleLeft,
  MessageSquare,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import PopConfigPoll from "./popConfigPoll";

export default function CreatePoll() {
  const [pollType, setPollType] = useState("");
  const [state, setState] = useState("hidden");
  const navigate = useNavigate();
  
  function back() {
    navigate("/mainpage");
  }

  return (
    <>
      <div className={state === "pop" ? "hidden" : null}>
        <div className="min-h-screen w-full bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 flex items-center justify-center p-4 sm:p-6">
          <div className="absolute z-20 top-4 sm:top-6 left-4 sm:left-5 font-bold text-white text-xl sm:text-3xl">
              <button
            onClick={back}
            title="Go Back"
          >
            <ArrowLeft
             className="h-10 w-10 z-20 sm:h-10 sm:w-10 bg-white/10 border border-white/20 text-white p-2 rounded-full hover:bg-white/20 transition-transform hover:scale-105"
             />
          </button>
          </div>
        

          <div className="w-full max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {/* Single Choice Card */}
              <div className="w-full bg-white/10 backdrop-blur-lg rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 shadow-lg transform hover:scale-[1.02] transition-transform duration-300">
                <div className="text-center mb-4 sm:mb-6 md:mb-8">
                  <div className="bg-white/20 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <Circle className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-white" />
                  </div>
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1 sm:mb-2">
                    Single Choice
                  </h1>
                  <p className="text-gray-300 text-sm sm:text-base">
                    Users can pick a single option from a list.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setPollType("single choice");
                    setState(state === "hidden" ? "pop" : "hidden");
                  }}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 sm:py-3 rounded-lg text-sm sm:text-base font-semibold flex items-center justify-center space-x-2 hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-300 transform hover:scale-[1.02]"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>

              <div className="w-full bg-white/10 backdrop-blur-lg rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 shadow-lg transform hover:scale-[1.02] transition-transform duration-300">
                <div className="text-center mb-4 sm:mb-6 md:mb-8">
                  <div className="bg-white/20 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <Users className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-white" />
                  </div>
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1 sm:mb-2">
                    Multiple Choice
                  </h1>
                  <p className="text-gray-300 text-sm sm:text-base">
                    Users can pick multiple options at once
                  </p>
                </div>
                <button
                  onClick={() => {
                    setPollType("multiple choice");
                    setState(state === "hidden" ? "pop" : "hidden");
                  }}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 sm:py-3 rounded-lg text-sm sm:text-base font-semibold flex items-center justify-center space-x-2 hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-300 transform hover:scale-[1.02]"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>

              <div className="w-full bg-white/10 backdrop-blur-lg rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 shadow-lg transform hover:scale-[1.02] transition-transform duration-300">
                <div className="text-center mb-4 sm:mb-6 md:mb-8">
                  <div className="bg-white/20 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <ToggleLeft className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-white" />
                  </div>
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1 sm:mb-2">
                    Yes/No Choice
                  </h1>
                  <p className="text-gray-300 text-sm sm:text-base">
                    Simple binary yes or no decision
                  </p>
                </div>
                <button
                  onClick={() => {
                    setPollType("yes/no");
                    setState(state === "hidden" ? "pop" : "hidden");
                  }}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 sm:py-3 rounded-lg text-sm sm:text-base font-semibold flex items-center justify-center space-x-2 hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-300 transform hover:scale-[1.02]"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>

              <div className="w-full bg-white/10 backdrop-blur-lg rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 shadow-lg transform hover:scale-[1.02] transition-transform duration-300">
                <div className="text-center mb-4 sm:mb-6 md:mb-8">
                  <div className="bg-white/20 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-white" />
                  </div>
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1 sm:mb-2">
                    Open-Ended
                  </h1>
                  <p className="text-gray-300 text-sm sm:text-base">
                    Users type their own responses
                  </p>
                </div>

                {sessionStorage.getItem("premium") === "true" ? (
                  <button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 sm:py-3 rounded-lg text-sm sm:text-base font-semibold flex items-center justify-center space-x-2 hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-300 transform hover:scale-[1.02]">
                    <span>COMING SOON</span>
                  </button>
                ) : (
                  <button
                    onClick={() => navigate("/payment")}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 sm:py-3 rounded-lg text-sm sm:text-base font-semibold flex items-center justify-center space-x-2 hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-300 transform hover:scale-[1.02]"
                  >
                    <span>PREMIUM FEATURE</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <PopConfigPoll state={state} polltype={pollType} />
    </>
  );
}