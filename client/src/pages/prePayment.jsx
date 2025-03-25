import React, { useState, useContext, useEffect } from "react";
import { ArrowRight, Plus, ArrowLeft, DollarSign } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Context from "../context/context";
import axios from "axios";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

export default function PaymentTile() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const user = useContext(Context)[0];
  const token = sessionStorage.getItem("token");

  function back() {
    navigate("/mainpage");
  }

  async function handleClick() {
    // Handle payment logic here
    setIsLoading(true);
    console.log("Payment button clicked");
    try {
      // Step 1: Initialize Payment
      const response = await axios.post(
        `${backendUrl}/initialize-payment`,
        {
          email: user,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      // Step 2: Redirect to Paystack Payment Page
      const { authorization_url } = response.data.data;
      console.log(response.data);

      console.log("authorization url", authorization_url);

      window.location.href = authorization_url;
      console.log("over here");
    } catch (error) {
      console.error("Error initializing payment:", error);
      alert("Payment initialization failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }
  useEffect(() => {
    const reference = new URLSearchParams(window.location.search).get(
      "reference"
    );
    console.log("URL SEACRH PARAMETERS", window.location.search);
    console.log("Reference", reference);

    async function verifyPayment() {
      if (reference) {
        try {
          setIsLoading(true);
          const response = await axios.get(
            `${backendUrl}/verify-payment/${reference}`,
            {
              headers: { Authorization: `Bearer ${token}` },
              withCredentials: true,
            }
          );
          console.log(response.data);

          if (response.data.data.status === "success") {
            alert("Payment successful!.");
            await axios.post(
              `${backendUrl}/premium-user`,
              {
                email: user,
              },
              {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true,
              }
            );
            const response = await axios.post(
              `${backendUrl}/checkPremium`,
              { user: user },
              {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true,
              }
            );
            sessionStorage.setItem("premium", response.data.query);

            // Handle successful payment (e.g., update user subscription)
          } else {
            alert("Payment failed");
          }

          // Clear the reference parameter from the URL
        } catch (error) {
          console.error("Error verifying payment:", error);
          alert("Payment verification failed. Please contact support.");
        } finally {
          setIsLoading(false);
          window.history.replaceState({}, "", window.location.pathname);
        }
      }
    }

    verifyPayment();
  }, [navigate]);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 flex flex-col items-center justify-center p-6">
      {/* Back Button */}
      <button
        onClick={back}
        className="absolute top-6 left-5 bg-white/10 border border-white/20 text-white p-2 rounded-full flex items-center justify-center hover:bg-white/20 transition-all duration-300 transform hover:scale-105"
        title="Go Back"
      >
        <ArrowLeft className="w-6 h-6" />
      </button>

      {/* Payment Tile */}
      <div className="w-full md:w-3/4 lg:w-1/2 xl:w-1/3 max-w-2xl mx-auto flex flex-col items-center justify-center space-y-8">
        <div className="w-full justify-center bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl transform hover:scale-105 transition-transform duration-300">
          <div className="text-center mb-8">
            <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <DollarSign className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
              Yearly Sub
            </h1>
            <p className="text-gray-300">Just pay nigga</p>
          </div>
          <button
            onClick={handleClick}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-lg font-semibold flex items-center justify-center space-x-2 hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-300 transform hover:scale-[1.02]"
          >
            <span>{isLoading ? "Processing..." : ": )"}</span>
            {isLoading ? null : <ArrowRight className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </div>
  );
}