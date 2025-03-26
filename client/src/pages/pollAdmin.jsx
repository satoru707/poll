import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Vote, Copy } from "lucide-react";
import HomePage from "../components/home";
import axios from "axios";
import { io } from "socket.io-client";
ChartJS.register(ArcElement, Tooltip, Legend);

export default function PollAdmin() {
  const [pollConfig, setPollConfig] = useState({});
  const [votes, setVotes] = useState([]);
  const [copy, setCopy] = useState();
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

  useEffect(() => {
    const pollConfi = JSON.parse(localStorage.getItem("pollConfig"));
    async function data() {
      setPollConfig(pollConfi);
      setCopy(pollConfi.codelink || pollConfi.shareCode);
      const token = sessionStorage.getItem("token");
      const response = await axios.post(
        `${BACKEND_URL}/votes`,
        { code: pollConfi.shareCode || pollConfi.codelink },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      setVotes(response.data.data);
    }
    data();
  }, []);

  useEffect(() => {
    const socket = io(BACKEND_URL, {
      auth: {
        token: sessionStorage.getItem("token"),
      },
    });
    socket.on("connect", () => {
      console.log("Connected to server");
    });
    const pollConfi = JSON.parse(localStorage.getItem("pollConfig"));

    socket.on("newVotes", (data) => {
      if (
        data.data.data[0].codelink === pollConfi.shareCode ||
        pollConfi.codelink
      )
        setVotes(data.data.data);
    });
  }, []);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(copy);
    } catch (error) {
      console.log("Error copying", error);
    }
  }

  function filterbyOp(array, option) {
    return array.filter((obj) => {
      const opt = obj.choice;
      if (Array.isArray(opt)) {
        return opt.includes(option);
      } else if (typeof opt === "string") {
        return opt === option;
      }
      return false;
    });
  }

  function yesorno(array, y) {
    return array.filter((item) => item.choice === y).length;
  }

  function multiplex(objectsArray, searchString) {
    return objectsArray.filter((item) => {
      try {
        const parsedChoice = JSON.parse(item.choice);
        return parsedChoice.includes(searchString);
      } catch (error) {
        console.error("Error parsing choice:", error);
        return false;
      }
    }).length;
  }

  const data = {
    labels:
      pollConfig.polltype === "single choice" ||
      pollConfig.polltype === "multiple choice"
        ? pollConfig.options
        : ["YES", "NO"],
    datasets: [
      {
        label: "Poll Results",
        data:
          pollConfig.polltype == "single choice"
            ? [
                filterbyOp(votes, pollConfig?.options[0]).length,
                filterbyOp(votes, pollConfig?.options[1]).length,
                filterbyOp(votes, pollConfig?.options[2]).length,
                filterbyOp(votes, pollConfig?.options[3]).length,
              ]
            : pollConfig.polltype == "multiple choice"
            ? [
                multiplex(votes, pollConfig?.options[0]),
                multiplex(votes, pollConfig?.options[1]),
                multiplex(votes, pollConfig?.options[2]),
                multiplex(votes, pollConfig?.options[3]),
              ]
            : [yesorno(votes, "Yes"), yesorno(votes, "No")],
        backgroundColor: [
          "rgba(139, 0, 0, 0.3)",
          "rgba(236, 72, 153, 0.3)",
          "rgba(99, 102, 241, 0.3)",
          "rgba(147, 51, 234, 0.3)",
        ],
        hoverOffset: 4,
        borderColor: [
          "rgba(139, 0, 0, 1)",
          "rgba(236, 72, 153, 1)",
          "rgba(99, 102, 241, 1)",
          "rgba(147, 51, 234, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "rgba(255, 255, 255, 0.9)",
          font: {
            size: 14,
          },
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleFont: { size: 14 },
        bodyFont: { size: 12 },
        padding: 10,
      },
    },
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 flex flex-col lg:flex-row items-center justify-center p-4 sm:p-6 gap-4 sm:gap-6">
      <HomePage />
      
      <div className="w-full max-w-md flex flex-col">
        <div className="bg-white/10 backdrop-blur-lg rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-lg flex-1 flex flex-col">
          <div className="text-center mb-4 sm:mb-6">
            <div className="bg-white/20 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 transform hover:scale-105 transition-transform duration-300">
              <button onClick={handleCopy}>
                <Vote className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-white" />
              </button>
            </div>     
          
            <div className="flex items-center justify-center gap-2 mb-2">
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
                User{" "}
                {pollConfig.user_id ||
                  pollConfig.email?.substring(0, pollConfig.email.length - 10)}
                's Poll
              </h3>
              <div className="flex items-center gap-1">
                <span className="text-sm sm:text-base text-gray-300">{copy}</span>
                <button 
                  onClick={handleCopy} 
                  className="hover:text-white transition-colors"
                  aria-label="Copy poll code"
                >
                  <Copy className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>

            <p className="text-gray-300 font-semibold text-sm sm:text-base mb-4">
              {pollConfig.question}
            </p>
          </div>

       
          <div className="flex-1 flex items-center justify-center">
            <div className="w-full h-56 sm:h-72">
              <Doughnut 
                data={data} 
                options={{
                  ...options,
                  plugins: {
                    ...options.plugins,
                    legend: {
                      ...options.plugins.legend,
                      labels: {
                        ...options.plugins.legend.labels,
                        font: {
                          size: window.innerWidth < 640 ? 12 : 14
                        }
                      }
                    }
                  }
                }} 
              />
            </div>
          </div>
        </div>
      </div>

   
      <div className="w-full max-w-4xl flex flex-col">
        <div className="bg-white/10 backdrop-blur-lg rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-lg flex-1 flex flex-col">
          <div className="text-center mb-4 sm:mb-6">
            <div className="bg-white/20 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 transform hover:scale-105 transition-transform duration-300">
              <Vote className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-white" />
            </div>
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2">
              Poll Votes
            </h3>
            <p className="text-gray-300 font-semibold text-sm sm:text-base">
              {votes.length} {votes.length === 1 ? "view" : "views"},{" "}
              {votes.filter((entry) => entry.datevoted).length}{" "}
              {votes.filter((entry) => entry.datevoted).length === 1
                ? "vote"
                : "votes"}
            </p>
          </div>

          <div className="flex-1 overflow-hidden">
            <div className="max-h-[300px] sm:max-h-[400px] h-full overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
              {votes.length > 0 ? (
                votes.map((entry, index) => (
                  <div
                    key={index}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-3 sm:mt-4 bg-white/5 hover:bg-white/10 transition-colors duration-200 rounded-lg p-3 mb-2 last:mb-0 shadow-sm gap-2 sm:gap-4"
                  >
                    <span className="text-white text-sm sm:text-base font-bold truncate w-full sm:flex-1">
                      {entry.email}
                    </span>
                    <span className="text-gray-200 text-sm sm:text-base font-bold truncate w-full sm:w-auto sm:flex-1 text-center">
                      {entry.choice}
                    </span>
                    <span className="text-gray-300 text-xs sm:text-sm font-bold truncate w-full sm:w-auto sm:flex-1 text-right">
                      {entry.datevoted || entry.dateviewed}
                    </span>
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-center h-full bg-white/5 hover:bg-white/10 transition-colors duration-200 rounded-lg p-4 shadow-sm">
                  <h2 className="text-gray-300 text-sm sm:text-base">No votes yet!</h2>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}