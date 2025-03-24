import React, { useContext, useEffect } from "react";
import {
  Plus,
  ArrowRight,
  Users,
  Clock,
  LogOutIcon,
  Diamond,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Context from "../context/context";
import { jwtDecode } from "jwt-decode";

export default function MainPage() {
  const navigate = useNavigate();
  const context = useContext(Context);
  const email = context[0];
  const token = sessionStorage.getItem("token");

  async function logout() {
    try {
      const response = await axios.post(
        "http://localhost:3000/logout",
        {},
        {
          withCredentials: true,
        }
      );

      sessionStorage.removeItem("token");
      if (response.data.message === "Logout") {
        navigate("/login");
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }

  useEffect(() => {
    if (token) {
      context[1](jwtDecode(token).email);

      async function finallydone() {
        const response = await axios.post(
          "http://localhost:3000/checkPremium",

          { user: jwtDecode(token).email },
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );
        console.log("Premium");

        console.log(response.data);

        sessionStorage.setItem("premium", response.data.query);
      }
      finallydone();
    }
  }, [token]);

  return (
    <div className="h-screen w-full bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 flex flex-col items-center justify-center p-4 sm:p-8">
      <div className="absolute top-6 left-5 font-bold text-white text-2xl sm:text-3xl">
        <h2>Hi {email?.substring(0, email.length - 10)}</h2>
      </div>
      <button onClick={logout} className="absolute top-6 right-5">
        <LogOutIcon className="h-8 w-8 sm:h-10 sm:w-10 bg-white/10 border border-white/20 text-white p-2 rounded-full hover:bg-white/20 transition-transform hover:scale-105" />
      </button>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl w-full">
        {[
          {
            title: "Create Poll",
            description: "Create your poll to share with the community.",
            icon: Plus,
            route: "/create-poll",
          },
          {
            title: "Join Poll",
            description: "Participate in polls created by other users.",
            icon: Users,
            route: "/participate-poll",
          },
          {
            title: "View History",
            description: "View previously created and participated polls.",
            icon: Clock,
            route: "/view-history",
          },
          {
            title: "Premium Subscription",
            description: "Buy our premium features.",
            icon: Diamond,
            route: "/payment",
          },
        ].map((item, index) => (
          <div
            key={index}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 sm:p-8 shadow-lg transform hover:scale-105 transition-transform"
          >
            <div className="text-center mb-4">
              <div className="bg-white/20 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                <item.icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                {item.title}
              </h1>
              <p className="text-gray-300 text-sm sm:text-base">
                {item.description}
              </p>
            </div>
            {sessionStorage.getItem("premium") === "true" &&
            item.title === "Premium Subscription" ? (
              <button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 sm:py-3 rounded-lg font-semibold flex items-center justify-center space-x-2 hover:from-purple-600 hover:to-pink-600 focus:ring-2 focus:ring-purple-500 transition-transform hover:scale-105">
                <span>PREMIUM USER</span>
              </button>
            ) : (
              <button
                onClick={() => navigate(item.route)}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 sm:py-3 rounded-lg font-semibold flex items-center justify-center space-x-2 hover:from-purple-600 hover:to-pink-600 focus:ring-2 focus:ring-purple-500 transition-transform hover:scale-105"
              >
                <span>Get Started</span>

                <ArrowRight className="w-5 h-5" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
