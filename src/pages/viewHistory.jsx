import React, { useEffect, useState, useContext } from "react";
import { Vote, View, ArrowLeft, Copy } from "lucide-react";
import HomePage from "../components/home";
import { useNavigate } from "react-router-dom";
import Context from "../context/context";
import axios from "axios";

export default function DisplayedHistory() {
  const [history, setHistory] = useState([]);
  const navigate = useNavigate();
  const email = useContext(Context)[0];
  //   console.log(email);
  const type = sessionStorage.getItem("htype");

  useEffect(() => {
    const type = sessionStorage.getItem("htype");
    // console.log(type);
    //delete this

    const token = sessionStorage.getItem("token");
    async function gettingit() {
      const response = await axios.post(
        "http://localhost:3000/getHistory",

        { email: email, type: type },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      //   console.log(response.data.data);
      setHistory(response.data.data);
      //   console.log("History");
      //   console.log(history);
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
    //issue
    const token = sessionStorage.getItem("token");
    async function handleClick(code) {
      try {
        const response = await axios.post(
          "http://localhost:3000/pollData",

          { user: email, code: code },
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );
        console.log("Error position");

        console.log(response.data);

        const pollConfig = response.data.query;
        await localStorage.setItem("pollConfig", JSON.stringify(pollConfig));
        console.log("local storage");
        console.log(localStorage.getItem("pollConfig"));

        navigate("/poll-admin");
      } catch (error) {
        console.log("error", error);
      }
    }

    function back() {
      navigate("/view-history");
    }
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 flex items-center justify-center p-6">
        <HomePage />
        <button
          onClick={back}
          className="absolute top-6 left-5 bg-white/10 border border-white/20 text-white p-2 rounded-full flex items-center justify-center hover:bg-white/20 transition-all duration-300 transform hover:scale-105"
          title="Go Back"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="w-full max-w-5xl max-h-max mx-auto">
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 min-h-96 shadow-2xl">
            <div className="text-center mb-3">
              <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 transform hover:scale-105 transition-transform duration-300">
                <Vote className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-2">
                Poll History
              </h3>
              <p className="text-gray-300 font-semibold">
                {sessionStorage.getItem("htype")} {history.length} polls
              </p>
            </div>

            <div className="max-h-[400px] overflow-y-scroll scrollbar-hidden">
              {history.length > 0 ? (
                history.map((entry, index) => (
                  <div
                    key={index}
                    className="flex items-center font-mono justify-between mt-4 bg-white/5 hover:bg-white/10 transition-colors duration-200 rounded-lg p-3 mb-2 last:mb-0 shadow-sm"
                  >
                    <span className="text-white text-xl font-bold truncate flex-2">
                      {entry.question || entry.choice}
                    </span>
                    <span
                      onClick={handleCopy(entry.codelink)}
                      className="text-gray-200 ml-7 text-xl font-bold truncate flex-1 text-center"
                    >
                      {entry.codelink}
                    </span>
                    <span className="text-gray-300 text-xl font-bold truncate flex-1 text-right">
                      {entry.datecreated || entry.datevoted || entry.dateviewed}
                    </span>
                    {type == "created" ? (
                      <span className="text-gray-300 text-xl font-bold truncate flex-1 text-right">
                        <button onClick={() => handleClick(entry.codelink)}>
                          <View className="w-8 h-8 text-white" />
                        </button>
                      </span>
                    ) : (
                      <span className="ml-8 text-gray-300 text-xl font-bold truncate flex-1 text-right">
                        <button onClick={() => navigate("/participate-poll")}>
                          <View className="w-8 h-8 text-white" />
                        </button>
                      </span>
                    )}
                  </div>
                ))
              ) : (
                <div className="flex items-center font-mono justify-between mt-4 bg-white/5 hover:bg-white/10 transition-colors duration-200 rounded-lg p-3 mb-2 last:mb-0 shadow-sm bar">
                  <h2>No poll found</h2>
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
