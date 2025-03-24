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
  // console.log("Poll type");

  // console.log(pollType);

  return (
    <>
      <div className={state === "pop" ? "hidden" : null}>
        <div className="min-h-screen w-full bg-gradient-to-br  from-indigo-900 via-purple-900 to-pink-800 flex items-center justify-around p-6">
          <button
            onClick={back}
            className="absolute top-6 left-5 bg-white/10 border border-white/20 text-white p-2 rounded-full flex items-center justify-center hover:bg-white/20 transition-all duration-300 transform hover:scale-105"
            title="Go Back"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>

          <div className="w-full max-w-5xl mx-auto flex  justify-around space-x-8 ">
            <div className="w-1/3 bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl transform hover:scale-105 transition-transform duration-300">
              <div className="text-center mb-8">
                <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Circle className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  Single Choice
                </h1>
                <p className="text-gray-300">
                  Users can pick a single option from a list.
                </p>
              </div>
              <button
                onClick={() => (
                  setPollType("single choice"),
                  state === "hidden" ? setState("pop") : setState("hidden")
                )}
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
                  Multiple Choice
                </h1>
                <p className="text-gray-300">
                  Users can pick multiple options at once
                </p>
              </div>
              <button
                onClick={() => (
                  setPollType("multiple choice"),
                  state === "hidden" ? setState("pop") : setState("hidden")
                  // console.log(state)
                )}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-lg font-semibold flex items-center justify-center space-x-2 hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-300 transform hover:scale-[1.02]"
              >
                <span>Get Started</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>

            <div className="w-1/3 bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl transform hover:scale-105 transition-transform duration-300">
              <div className="text-center mb-8">
                <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ToggleLeft className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  Yes/No Choice
                </h1>
                <p className="text-gray-300">
                  Simple binary yes or no decision
                </p>
              </div>
              <button
                onClick={() => (
                  setPollType("yes/no"),
                  state === "hidden" ? setState("pop") : setState("hidden"),
                  console.log(state)
                )}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-lg font-semibold flex items-center justify-center space-x-2 hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-300 transform hover:scale-[1.02]"
              >
                <span>Get Started</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>

            <div className="w-1/3 bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl transform hover:scale-105 transition-transform duration-300">
              <div className="text-center mb-8">
                <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  Open-Ended
                </h1>
                <p className="text-gray-300">Users type their own responses</p>
              </div>

              {sessionStorage.getItem("premium") === "true" ? (
                <button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-lg font-semibold flex items-center justify-center space-x-2 hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-300 transform hover:scale-[1.02]">
                  <span>COMING SOON</span>
                  {/* <ArrowRight className="w-5 h-5" /> */}
                </button>
              ) : (
                <button
                  onClick={() => navigate("/payment")}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-lg font-semibold flex items-center justify-center space-x-2 hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-300 transform hover:scale-[1.02]"
                >
                  <span>PREMIUM FEATURE</span>
                  {/* <ArrowRight className="w-5 h-5" /> */}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <PopConfigPoll state={state} polltype={pollType} />
    </>
  );
}
