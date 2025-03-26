import React, { useEffect, useState, useContext } from "react";
import { Vote, View, ArrowLeft, Copy } from "lucide-react";
import HomePage from "../components/home";
import { useNavigate } from "react-router-dom";
import Context from "../context/context";
import axios from "axios";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

export default function DisplayedHistory() {
  const [history, setHistory] = useState([]);
  const navigate = useNavigate();
  const email = useContext(Context)[0];
  const type = sessionStorage.getItem("htype");

  useEffect(() => {
    const type = sessionStorage.getItem("htype");
    const token = sessionStorage.getItem("token");
    async function gettingit() {
      const response = await axios.post(
        `${backendUrl}/getHistory`,
        { email: email, type: type },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      setHistory(response.data.data);
    }
    gettingit();
  }, [email]);

  async function handleCopy(copy) {
    try {
      await navigator.clipboard.writeText(copy);
    } catch (error) {
      console.log("Error copying", error);
    }
  }

  function History({ history }) {
    const token = sessionStorage.getItem("token");
    async function handleClick(code) {
      try {
        const response = await axios.post(
          `${backendUrl}/pollData`,
          { user: email, code: code },
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );
        const pollConfig = response.data.query;
        await localStorage.setItem("pollConfig", JSON.stringify(pollConfig));
        navigate("/poll-admin");
      } catch (error) {
        console.log("error", error);
      }
    }

    function back() {
      navigate("/view-history");
    }
    
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 flex items-center justify-center p-4 sm:p-6">
        <HomePage />
        <button
          onClick={back}
          className="absolute top-4 sm:top-6 left-4 sm:left-5 bg-white/10 border border-white/20 text-white p-2 rounded-full flex items-center justify-center hover:bg-white/20 transition-all duration-300 transform hover:scale-105"
          title="Go Back"
        >
          <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
        <div className="w-full max-w-4xl lg:max-w-5xl mx-auto">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 min-h-[300px] sm:min-h-[400px] shadow-lg">
            <div className="text-center mb-4 sm:mb-6">
              <div className="bg-white/20 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 transform hover:scale-105 transition-transform duration-300">
                <Vote className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-2">
                Poll History
              </h3>
              <p className="text-gray-300 font-semibold text-sm sm:text-base">
                {sessionStorage.getItem("htype")} {history?.length} polls
              </p>
            </div>

            <div className="max-h-[300px] sm:max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
              {history.length > 0 ? (
                history.map((entry, index) => (
                  <div
                    key={index}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-3 sm:mt-4 bg-white/5 hover:bg-white/10 transition-colors duration-200 rounded-lg p-3 mb-2 last:mb-0 shadow-sm gap-2 sm:gap-4"
                  >
                    <span className="text-white text-sm sm:text-base lg:text-lg font-bold truncate w-full sm:flex-1">
                      {entry.question || entry.choice}
                    </span>
                    <div className="flex items-center gap-2 w-full sm:w-auto sm:flex-1">
                      <span className="text-gray-200 text-sm sm:text-base lg:text-lg font-bold truncate">
                        {entry.codelink}
                      </span>
                      <button 
                        onClick={() => handleCopy(entry.codelink)}
                        className="text-white hover:text-purple-300 transition-colors"
                      >
                        <Copy className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                    </div>
                    <span className="text-gray-300 text-xs sm:text-sm lg:text-base font-bold truncate w-full sm:w-auto sm:flex-1 text-right">
                      {entry.datecreated || entry.datevoted || entry.dateviewed}
                    </span>
                    <div className="w-full sm:w-auto sm:flex-1 flex justify-end">
                      {type == "created" ? (
                        <button 
                          onClick={() => handleClick(entry.codelink)}
                          className="text-white hover:text-purple-300 transition-colors"
                        >
                          <View className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8" />
                        </button>
                      ) : (
                        <button 
                          onClick={() => navigate("/participate-poll")}
                          className="text-white hover:text-purple-300 transition-colors"
                        >
                          <View className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8" />
                        </button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-center mt-4 bg-white/5 hover:bg-white/10 transition-colors duration-200 rounded-lg p-4 mb-2 last:mb-0 shadow-sm">
                  <h2 className="text-gray-300 text-sm sm:text-base">No poll found</h2>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <History history={history} />;
}