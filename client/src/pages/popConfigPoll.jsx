/* eslint-disable no-unused-vars */
import React, { useState, useContext, useEffect } from "react";
import {
  Circle,
  MessageSquare,
  Send,
  Text,
  HomeIcon,
  Home,
  Columns,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import HomePage from "../components/home";
import Context from "../context/context";
import axios from "axios";

export default function PopConfigPoll({ state, polltype }) {
  const token = sessionStorage.getItem("token");
  const email = useContext(Context)[0];
  const navigate = useNavigate();
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

  // [All existing state declarations remain exactly the same...]
  const [loading,setLoading] = useState(false)
  const [option, setOptions] = useState("");
  const [count, setCount] = useState(0);
  const [freeze, setFreeze] = useState(false);
  const [shareCode, setShareCode] = useState(
    `${Math.floor(Math.random() * 10)}${Math.floor(
      Math.random() * 10
    )}${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}`
  );
  const [QandA, setQandA] = useState({
    email: email,
    polltype: polltype,
    question: "",
    options: [],
    shareCode: shareCode,
    state: "Open",
  });
  const [holdOpt, setHoldOpt] = useState([]);

  // [All existing useEffect hooks remain exactly the same...]
  useEffect(() => {
    function callack() {
      if (count > 2) {
        let array = [];
        array.push(option);
        setHoldOpt((prev) => [...prev, array[array.length - 1]]);
      }
    }
    callack();
  }, [count, option]);

  useEffect(() => {
    setQandA((prev) => ({
      ...prev,
      polltype: polltype,
      options: [
        holdOpt[0],
        holdOpt[1],
        holdOpt[2],
        holdOpt[holdOpt.length - 1],
      ],
    }));
  }, [polltype, holdOpt]);

  if (state === "hidden") return null;

  const placeholders = [
    "First option",
    "Second option",
    "Third option",
    "Fourth option",
  ];

  async function handleSubmit(e) {
    e.preventDefault();
    if (option.trim() === "") {
      console.log("Option cannot be empty");
      return;
    }
    if (count < 3) {
      setCount((prev) => prev + 1);
      setHoldOpt((prev) => [...prev, option]);
      setOptions("");
    } else {
      setLoading(true)
      console.log("Done");
      console.log(QandA);
      localStorage.setItem("pollConfig", JSON.stringify(QandA));
      try {
        const response = await axios.post(
          `${BACKEND_URL}/pollconfig`,
          { QandA: QandA },
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );

        console.log("response");
        console.log(response);
        
        
          navigate("/poll-admin");
     
      } catch (error) {
        setLoading(false)
        console.log(`Error submitting:  ${error}`);
      }
    }
  }

  async function handleClick() {
    if (polltype !== "yes/no") {
      if (option.trim() === "") {
        console.log("Option cannot be empty");
        return;
      }
    } else {
      null;
    }
    setLoading(true)
    try {
      const response = await axios.post(
        `${BACKEND_URL}/pollconfig`,
        { QandA: QandA },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      localStorage.setItem("pollConfig", JSON.stringify(QandA));
      console.log("response");
      console.log(response);
      
        navigate("/poll-admin");
    } catch (error) {
      console.log(`Error submitting:  ${error}`);
      setLoading(false)
    }
  }

  // [All existing JSX remains exactly the same...]
  return (
    <div>
      {polltype === "single choice" || polltype === "multiple choice" ? (
        <div className="min-h-screen w-full bg-gradient-to-br  from-indigo-900 via-purple-900 to-pink-800 flex items-center justify-around p-6">
          <HomePage />

          <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
            <div className="w-full max-w-5xl mx-auto flex  justify-around space-x-8 ">
              <div className="w-11/12 bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl transform hover:scale-105 transition-transform duration-300">
                <div className="text-center mb-8">
                  <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="w-8 h-8 text-white" />
                  </div>
                  <h1 className="text-3xl font-bold text-white mb-2">
                    Question
                  </h1>
                  <div className="relative group">
                    <Circle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-hover:text-purple-400 transition-colors duration-300" />
                    {freeze ? (
                      <input
                        type="text"
                        value={QandA.question}
                        placeholder={QandA.question}
                        className="w-full bg-white/10 border border-white/20 rounded-lg py-3 pl-12 pr-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                        disabled
                      />
                    ) : (
                      <input
                        type="text"
                        value={QandA.question}
                        onChange={(e) =>
                          setQandA((prev) => ({
                            ...prev,
                            question: e.target.value,
                          }))
                        }
                        placeholder="What is cashout?"
                        className="w-full bg-white/10 border border-white/20 rounded-lg py-3 pl-12 pr-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                        required
                      />
                    )}
                  </div>
                </div>

                <button
                  onClick={() => (freeze ? setFreeze(false) : setFreeze(true))}
                  className="w-8/12 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-lg font-semibold flex items-center justify-center space-x-2 hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-300 transform hover:scale-[1.02]"
                >
                  <span>Submit</span>
                  <Send className="w-5 h-5" />
                </button>
              </div>

              <div className="w-full bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl transform hover:scale-105 transition-transform duration-300">
                <div className="text-center mb-8">
                  <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Text className="w-8 h-8 text-white" />
                  </div>
                  <h1 className="text-3xl font-bold text-white mb-2">
                    Answers
                  </h1>
                  <div className="relative group">
                    <Circle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-hover:text-purple-400 transition-colors duration-300" />
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => setOptions(e.target.value)}
                      placeholder={placeholders[count]}
                      className="w-full bg-white/10 border border-white/20 rounded-lg py-3 pl-12 pr-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                      required
                    />
                  </div>
                </div>
                <button
                  onClick={ handleSubmit}
                  type="submit"
                  className="w-8/12 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-lg font-semibold flex items-center justify-center space-x-2 hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-300 transform hover:scale-[1.02]"
                >
                  <span>Submit</span>

                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </form>
        </div>
      ) : polltype === "yes/no" || polltype === "open ended" ? (
        <div className="min-h-screen w-full bg-gradient-to-br  from-indigo-900 via-purple-900 to-pink-800 flex items-center justify-around p-6">
          <HomePage />
          <div className="w-9/12 max-w-4xl mx-auto flex  justify-around space-x-8 ">
            <div className="w-11/12 bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl transform hover:scale-105 transition-transform duration-300">
              <div className="text-center ">
                <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-white mb-2 p-2">
                  Question
                </h1>
                <div className="relative group">
                  <Circle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-hover:text-purple-400 transition-colors duration-300" />
                  <input
                    type="text"
                    value={QandA.question}
                    onChange={(e) =>
                      setQandA({
                        question: e.target.value,
                        options: [],
                        shareCode: shareCode,
                        email: email,
                        polltype: polltype,
                      })
                    }
                    placeholder="What is cashout?"
                    className="w-full bg-white/10 border border-white/20 rounded-lg py-3 pl-12 pr-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                    required
                  />
                  <button
                    onClick={ handleClick}
                    className="w-1/12 absolute right-1 top-1/2 -translate-y-1/2 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-lg font-semibold flex items-center justify-center space-x-2 hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-300 transform hover:scale-[1.02]"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}