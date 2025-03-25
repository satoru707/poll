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
  console.log("query");
  console.log(query);

  function Poll({ query }) {
    const [choice, setChoice] = useState();
    const [single, setSingle] = useState();
    const [multiple, setMultiple] = useState([]);

    const [pollConfig, setPollConfig] = useState({});
    const [votes, setVotes] = useState([]);
    const [copy, setCopy] = useState();
    //from here
    useEffect(() => {
      const socket = io("https://polldeew32.onrender.com", {
        auth: {
          token: sessionStorage.getItem("token"),
        },
      });
      socket.on("connect", () => {
        console.log("Connected to server");
      });
      const pollConfi = JSON.parse(localStorage.getItem("pollConfig"));
      socket.on("newVotes", (data) => {
        console.log(data);
        console.log(data.data);

        if (data.data.data[0].poll_id === pollConfi.id)
          setVotes(data.data.data);
      });

      return () => {
        socket.disconnect();
      };
    }, []);

    const pollConfi = JSON.parse(localStorage.getItem("pollConfig"));
    useEffect(() => {
      //get pollData
      async function data() {
        console.log("Error i guess");
        console.log(pollConfig);
        console.log(localStorage.getItem("pollConfig"));

        setPollConfig(pollConfi);
        setCopy(pollConfi.codelink);
        const token = sessionStorage.getItem("token");
        const response = await axios.post(
          "https://polldeew32.onrender.com/votes",

          { code: query.codelink || pollConfi.shareCode },
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );
        const users = response.data.data;
        console.log(users);
        setVotes(users);
      }
      data();
    }, []);

    // what changes it immediately
    useEffect(() => {
      setSingle(choice);
      console.log(single);
      console.log(multiple);

      const token = sessionStorage.getItem("token");
      console.log("Mulitple");

      console.log(multiple.length);

      async function saveop() {
        try {
          const response = await axios.post(
            "https://polldeew32.onrender.com/saveOption",

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
      console.log(option), console.log(multiple);
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
      console.log("Selected option");

      console.log(choice);
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
          const parsedChoice = JSON.parse(item.choice); // Double parse to extract the actual array
          return parsedChoice.includes(searchString);
        } catch (error) {
          console.error("Error parsing choice:", error);
          return false;
        }
      }).length;
    }

    console.log(pollConfi);
    console.log(query);

    console.log("votes");
    console.log(votes);
    // console.log([
    //   multiplex(votes, pollConfig?.options[0] || query?.options[0]),
    //   multiplex(votes, pollConfig?.options[1] || query?.options[1]),
    //   multiplex(votes, pollConfig?.options[2] || query?.options[2]),
    //   multiplex(votes, pollConfig?.options[3] || query?.options[3]),
    // ]);

    const data = {
      labels:
        pollConfig.polltype === "single choice" ||
        pollConfig.polltype === "multiple choice"
          ? pollConfig.options
          : ["YES", "NO"], //options
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
            {/* Title Section */}
            <div className="text-center mb-8">
              <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 transform hover:scale-105 transition-transform duration-300">
                <Vote className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-2">
                {email?.substring(0, email.length - 10)}'s Polling Unit
              </h3>
              <p className="text-gray-300">{query.question}</p>
            </div>

            {/* Poll Options */}
            {query.polltype === "single choice" ? (
              <div className="space-y-4">
                {query.options.map((option, index) => (
                  <label
                    key={index}
                    className="flex items-center w-full bg-white/10 border border-white/20 rounded-lg py-3 px-4 text-white cursor-pointer hover:bg-white/20 transition-all duration-300 transform hover:scale-[1.02]"
                  >
                    <input
                      type="radio"
                      name="poll"
                      value={option}
                      onClick={(e) => setChoice(e.target.value)}
                      className="mr-3 text-purple-500 focus:ring-purple-500 border-white/20 bg-transparent"
                    />
                    <span className="text-gray-200">{option}</span>
                  </label>
                ))}
              </div>
            ) : query.polltype === "multiple choice" ? (
              <div className="space-y-4">
                {query.options.map((option, index) => (
                  <label
                    key={index}
                    className="flex items-center w-full bg-white/10 border border-white/20 rounded-lg py-3 px-4 text-white cursor-pointer hover:bg-white/20 transition-all duration-300 transform hover:scale-[1.02]"
                  >
                    <input
                      type="checkbox"
                      name="poll"
                      value={option}
                      onClick={() => handleMultiple(option)}
                      className="mr-3 text-purple-500 focus:ring-purple-500 border-white/20 bg-transparent"
                    />
                    <span className="text-gray-200">{option}</span>
                  </label>
                ))}
              </div>
            ) : query.polltype === "yes/no" ? (
              <div className="space-y-4">
                {query.options.map((option, index) => (
                  <label
                    key={index}
                    className="flex items-center w-full bg-white/10 border border-white/20 rounded-lg py-3 px-4 text-white cursor-pointer hover:bg-white/20 transition-all duration-300 transform hover:scale-[1.02]"
                  >
                    <input
                      type="radio"
                      name="poll"
                      value={option}
                      onClick={(e) => setChoice(e.target.value)}
                      className="mr-3 text-purple-500 focus:ring-purple-500 border-white/20 bg-transparent"
                    />
                    <span className="text-gray-200">{option}</span>
                  </label>
                ))}
              </div>
            ) : query.polltype === "open ended" ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="relative group">
                  <TextSearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-hover:text-purple-400 transition-colors duration-300" />
                  <input
                    type="email"
                    value={choice}
                    onChange={(e) => setChoice(e.target.value)}
                    placeholder="Your opinion nigga"
                    className="w-full bg-white/10 border border-white/20 rounded-lg py-3 pl-12 pr-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                    required
                  />
                </div>
              </form>
            ) : (
              <p className="text-gray-400 text-center">
                This poll does not exist.
              </p>
            )}
          </div>
        </div>

        <div className="w-full max-w-md mx-auto">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl">
            <div className="text mb-8">
              <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 transform hover:scale-105 transition-transform duration-300">
                {/* Open or close voting poll*/}
                <button>
                  <Vote className="w-8 h-8 text-white" />
                </button>
              </div>
              <h3 className="text-3xl font-bold text-white mb-2">
                {" "}
                User {pollConfig.user_id}'s Poll
                <span className="font-semibold" onClick={handleCopy}>
                  <Copy className="w-4 h-4 text-white" />
                  {copy}
                </span>
              </h3>
              <p className="text-gray-300 font-semibold">
                {pollConfig.question}
              </p>
              <p className="text-gray-300 font-semibold">
                {votes.length}{" "}
                {votes.length == 1
                  ? "votes"
                  : votes.length > 1
                  ? "votes"
                  : null}
              </p>
            </div>

            <div className="relative">
              <Doughnut data={data} options={options} />
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
