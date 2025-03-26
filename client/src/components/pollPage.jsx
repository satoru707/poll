import React, { useState, useEffect, useContext } from "react";
import { Vote, TextSearchIcon, Copy } from "lucide-react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import HomePage from "../components/home";
import axios from "axios";
import Context from "../context/context";
import { io } from "socket.io-client";
ChartJS.register(ArcElement, Tooltip, Legend);

export default function PollSelection(props) {
  const query = props.query;
  const email = useContext(Context)[0];
  // console.log("query");
  // console.log(query);

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

  function Poll({ query }) {
    const [choice, setChoice] = useState();
    const [single, setSingle] = useState();
    const [multiple, setMultiple] = useState([]);

    const [pollConfig, setPollConfig] = useState({});
    const [votes, setVotes] = useState([]);
    const [copy, setCopy] = useState();

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
        // console.log(data);
        // console.log(data.data);

        if (data.data.data[0].poll_id === pollConfi.id)
          setVotes(data.data.data);
      });

      return () => {
        socket.disconnect();
      };
    }, []);

    const pollConfi = JSON.parse(localStorage.getItem("pollConfig"));
    useEffect(() => {
      async function data() {
        // console.log("Error i guess");
        // console.log(pollConfig);
        // console.log(localStorage.getItem("pollConfig"));

        setPollConfig(pollConfi);
        setCopy(pollConfi.codelink);
        const token = sessionStorage.getItem("token");
        const response = await axios.post(
          `${BACKEND_URL}/votes`,
          { code: query.codelink || pollConfi.shareCode },
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );
        const users = response.data.data;
        // console.log(users);
        setVotes(users);
      }
      data();
    }, []);

    useEffect(() => {
      setSingle(choice);
      // console.log(single);
      // console.log(multiple);

      const token = sessionStorage.getItem("token");
      // console.log("Mulitple");

      // console.log(multiple.length);

      async function saveop() {
        try {
          const response = await axios.post(
            `${BACKEND_URL}/saveOption`,
            {
              email: email,
              choice: single || multiple,
              code: query.codelink,
              token: token,
            },
            {
              headers: { Authorization: `Bearer ${token}` },
              withCredentials: true,
            }
          );
          console.log(response.data.message);
        } catch (error) {
          console.log(`Error submitting:  ${error}`);
        }
      }
      single || multiple.length > 0 ? saveop() : null;
      //listen for the emit and setVotes
    }, [choice, single, multiple]);

    function handleMultiple(option) {
      // console.log(option), console.log(multiple);
      const exist = multiple.filter((i) => i == option);

      if (exist.length > 0) {
        setMultiple(multiple.filter((i) => i !== option));
      } else {
        setMultiple((prev) => [...prev, option]);
      }
    }

    function yesorno(array, y) {
      return array.filter((item) => item.choice === y).length;
    }

    function handleSubmit() {
      // console.log("Selected option");
      // console.log(choice);
    }

    if (!props.state) {
      return null;
    }

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

    // console.log(pollConfi);
    // console.log(query);
    // console.log("votes");
    // console.log(votes);

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
                  filterbyOp(votes, pollConfig?.options[0] || query?.options[0])
                    .length,
                  filterbyOp(votes, pollConfig?.options[1] || query?.options[1])
                    .length,
                  filterbyOp(votes, pollConfig?.options[2] || query?.options[2])
                    .length,
                  filterbyOp(votes, pollConfig?.options[3] || query?.options[3])
                    .length,
                ]
              : pollConfig.polltype == "multiple choice"
              ? [
                  multiplex(votes, query?.options[0]),
                  multiplex(votes, query?.options[1]),
                  multiplex(votes, query?.options[2]),
                  multiplex(votes, query?.options[3]),
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

        <div className="w-full max-w-md">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-lg">
            <div className="text-center mb-6 sm:mb-8">
              <div className="bg-white/20 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 transform hover:scale-105 transition-transform duration-300">
                <Vote className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2">
                {email?.substring(0, email.length - 10)}'s Polling Unit
              </h3>
              <p className="text-gray-300 text-sm sm:text-base">{query.question}</p>
            </div>
    
            {query.polltype === "single choice" ? (
              <div className="space-y-3 sm:space-y-4">
                {query.options.map((option, index) => (
                  <label
                    key={index}
                    className="flex items-center w-full bg-white/10 border border-white/20 rounded-lg py-2 sm:py-3 px-3 sm:px-4 text-white cursor-pointer hover:bg-white/20 transition-all duration-300 transform hover:scale-[1.02] text-sm sm:text-base"
                  >
                    <input
                      type="radio"
                      name="poll"
                      value={option}
                      onClick={(e) => setChoice(e.target.value)}
                      className="mr-2 sm:mr-3 text-purple-500 focus:ring-purple-500 border-white/20 bg-transparent"
                    />
                    <span className="text-gray-200">{option}</span>
                  </label>
                ))}
              </div>
            ) : query.polltype === "multiple choice" ? (
              <div className="space-y-3 sm:space-y-4">
                {query.options.map((option, index) => (
                  <label
                    key={index}
                    className="flex items-center w-full bg-white/10 border border-white/20 rounded-lg py-2 sm:py-3 px-3 sm:px-4 text-white cursor-pointer hover:bg-white/20 transition-all duration-300 transform hover:scale-[1.02] text-sm sm:text-base"
                  >
                    <input
                      type="checkbox"
                      name="poll"
                      value={option}
                      onClick={() => handleMultiple(option)}
                      className="mr-2 sm:mr-3 text-purple-500 focus:ring-purple-500 border-white/20 bg-transparent"
                    />
                    <span className="text-gray-200">{option}</span>
                  </label>
                ))}
              </div>
            ) : query.polltype === "yes/no" ? (
              <div className="space-y-3 sm:space-y-4">
                {query.options.map((option, index) => (
                  <label
                    key={index}
                    className="flex items-center w-full bg-white/10 border border-white/20 rounded-lg py-2 sm:py-3 px-3 sm:px-4 text-white cursor-pointer hover:bg-white/20 transition-all duration-300 transform hover:scale-[1.02] text-sm sm:text-base"
                  >
                    <input
                      type="radio"
                      name="poll"
                      value={option}
                      onClick={(e) => setChoice(e.target.value)}
                      className="mr-2 sm:mr-3 text-purple-500 focus:ring-purple-500 border-white/20 bg-transparent"
                    />
                    <span className="text-gray-200">{option}</span>
                  </label>
                ))}
              </div>
            ) : query.polltype === "open ended" ? (
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                <div className="relative group">
                  <TextSearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5 group-hover:text-purple-400 transition-colors duration-300" />
                  <input
                    type="email"
                    value={choice}
                    onChange={(e) => setChoice(e.target.value)}
                    placeholder="Your opinion"
                    className="w-full bg-white/10 border border-white/20 rounded-lg py-2 sm:py-3 pl-10 sm:pl-12 pr-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-sm sm:text-base"
                    required
                  />
                </div>
              </form>
            ) : (
              <p className="text-gray-400 text-center text-sm sm:text-base">
                This poll does not exist.
              </p>
            )}
          </div>
        </div>
    
        <div className="w-full max-w-md">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-lg">
            <div className="text-center mb-6 sm:mb-8">
              <div className="bg-white/20 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 transform hover:scale-105 transition-transform duration-300">
                <button onClick={handleCopy}>
                  <Vote className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-white" />
                </button>
              </div>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2">
                {pollConfig.user_id}'s Poll
              </h3>
              <div className="flex items-center justify-center gap-2 text-gray-300 mb-2">
                <span className="text-sm sm:text-base">{copy}</span>
                <button onClick={handleCopy} className="hover:text-white">
                  <Copy className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
              <p className="text-gray-300 font-semibold text-sm sm:text-base">
                {pollConfig.question}
              </p>
              <p className="text-gray-300 font-semibold text-sm sm:text-base">
                {votes.filter(each => each.choice).length}{" "}
                {votes.filter(each => each.choice).length === 1
                  ? "vote"
                  : "votes"}
              </p>
            </div>
    
            <div className="flex-q flex items-center justify-center">
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
      </div>
    );
  }

  return (
    <>
      <div>
        <Poll query={query} />
      </div>
    </>
  );
}