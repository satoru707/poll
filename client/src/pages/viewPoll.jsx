import React, { useState, useEffect, useContext } from "react";
import { Lock, Key, ArrowLeft, HomeIcon } from "lucide-react";
import HomePage from "../components/home";
import { useNavigate } from "react-router-dom";
import PollSelection from "../components/pollPage";
import axios from "axios";
import Context from "../context/context";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

export default function ViewPoll() {
  const user = useContext(Context)[0];
  const token = sessionStorage.getItem("token");
  const [pin, setPin] = useState("");
  const [state, setState] = useState(false);
  const [query, setQuery] = useState({});
  const [send, setSend] = useState();
  const navigate = useNavigate();
  function back() {
    navigate("/mainpage");
  }
  useEffect(() => {
    setSend(pin);
    async function senPin() {
      try {
        const response = await axios.post(
          `${backendUrl}/pollData`,
          { user: user, code: send },
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );
        console.log("Error position");

        console.log(response.data);

        const pollConfig = response.data.query;
        localStorage.setItem("pollConfig", JSON.stringify(pollConfig));
        console.log("local storage");
        console.log(localStorage.getItem("pollConfig"));

        navigate("/poll-admin");
      } catch (error) {
        console.log("error", error);
      }
    }
    senPin;
  }, [pin]);
  async function handlePin() {
    try {
      const pollDataquery = await axios.post(
        `${backendUrl}/pollData`,
        { code: send, user: user },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      const pollData = pollDataquery.data.query;
      localStorage.setItem("pollConfig", JSON.stringify(pollData));
      console.log(pollDataquery);
      if (!pollData) {
        navigate("/participate-poll");
      } else {
        console.log(pollData);
        setQuery(pollData);
      }
    } catch (error) {
      console.log(error);
    }
    setState(true);
  }

  return (
    <>
      {state ? null : (
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
                  <button onClick={handlePin}>
                    <Lock className="w-8 h-8 text-white" />
                  </button>
                </div>
              </div>
              <div className="relative group">
                <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-hover:text-purple-400 transition-colors duration-300" />
                <input
                  type="password"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="Enter code"
                  className="w-full bg-white/10 border border-white/20 rounded-lg py-3 pl-12 pr-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                  required
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <PollSelection state={state} query={query} />
    </>
  );
}