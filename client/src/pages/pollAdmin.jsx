import React, { useEffect, useState } from "react";
import { Pie, Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { User, Vote, HomeIcon, Copy } from "lucide-react";
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
    sessionStorage.getItem("token");
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
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 flex items-center justify-center p-6">
      <HomePage />
      <div className="w-full max-w-md mx-auto">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl">
          <div className="text mb-8">
            <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 transform hover:scale-105 transition-transform duration-300">
              <button>
                <Vote className="w-8 h-8 text-white" />
              </button>
            </div>
            <h3 className="text-3xl font-bold text-white mb-2">
              {" "}
              User{" "}
              {pollConfig.user_id ||
                pollConfig.email?.substring(0, pollConfig.email.length - 10)}
              's Poll
              <span className="font-semibold" onClick={handleCopy}>
                <Copy className="w-4 h-4 text-white" />
                {copy}
              </span>
            </h3>
            <p className="text-gray-300 font-semibold">{pollConfig.question}</p>
          </div>

          <div className="relative">
            <Doughnut data={data} options={options} />
          </div>
        </div>
      </div>

      <div className="w-full max-w-4xl mx-auto">
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl">
          <div className="text-center mb-3">
            <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 transform hover:scale-105 transition-transform duration-300">
              <Vote className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-3xl font-bold text-white mb-2">Poll Votes</h3>
            <p className="text-gray-300 font-semibold">
              {votes.length} {votes.length == 1 ? "view" : "views"},{" "}
              {votes.filter((entry) => entry.datevoted).length}{" "}
              {votes.filter((entry) => entry.datevoted).length == 1
                ? "vote"
                : "votes"}
            </p>
          </div>

          <div className="max-h-[400px] overflow-y-scroll scrollbar-hide">
            {votes.length > 0 ? (
              votes.map((entry, index) => (
                <div
                  key={index}
                  className="flex items-center font-mono justify-between mt-4 bg-white/5 hover:bg-white/10 transition-colors duration-200 rounded-lg p-3 mb-2 last:mb-0 shadow-sm"
                >
                  <span className="text-white text-xl font-bold truncate flex-1">
                    {entry.email}
                  </span>
                  <span className="text-gray-200 text-xl font-bold truncate flex-1 text-center">
                    {entry.choice}
                  </span>
                  <span className="text-gray-300 text-xl font-bold truncate flex-1 text-right">
                    {entry.datevoted || entry.dateviewed}
                  </span>
                </div>
              ))
            ) : (
              <div className="flex items-center font-mono justify-between mt-4 bg-white/5 hover:bg-white/10 transition-colors duration-200 rounded-lg p-3 mb-2 last:mb-0 shadow-sm bar">
                <h2>No votes yet!</h2>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}