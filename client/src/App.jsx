import React, { useContext, useEffect } from "react";
import { Route, Routes, Navigate } from "react-router";
import LoginForm from "./pages/login";
import RegisterForm from "./pages/register";
import MainPage from "./pages/mainOptions";
import CreatePoll from "./pages/createPoll";
import PollAdmin from "./pages/pollAdmin";
import History from "./pages/historyType";
import PrivateRoute from "./context/PrivateRoute.jsx";
import PaymentTile from "./pages/prePayment.jsx";
import Context from "./context/context.js";
import ViewPoll from "./pages/viewPoll.jsx";
import DisplayedHistory from "./pages/viewHistory.jsx";
import axios from "axios";

export default function App() {
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
  const user = useContext(Context)[0]
  useEffect(() => {
    const token = sessionStorage.getItem('token')
    async function a() {
       const response = await axios.post(
    `${backendUrl}/checkPremium`,
    { user: user },
    {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true,
    }
  );
  console.log(response.data.query);
 response.data.query == 'true' ?  sessionStorage.setItem("premium", 'true'): null
      }
  a()})
  

  return (
  
    
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/login" element={<LoginForm />} />

        <Route path="/register" element={<RegisterForm />} />

        <Route
          path="/mainpage"
          element={
            <PrivateRoute>
              <MainPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/create-poll"
          element={
            <PrivateRoute>
              <CreatePoll />
            </PrivateRoute>
          }
        />

        <Route
          path="/participate-poll"
          element={
            <PrivateRoute>
              <ViewPoll />
            </PrivateRoute>
          }
        />

        <Route
          path="/poll-admin"
          element={
            <PrivateRoute>
              <PollAdmin />
            </PrivateRoute>
          }
        />

        <Route
          path="/view-history"
          element={
            <PrivateRoute>
              <History />
            </PrivateRoute>
          }
        />

        <Route
          path="/displayed-history"
          element={
            <PrivateRoute>
              <DisplayedHistory />
            </PrivateRoute>
          }
        />
        {sessionStorage.getItem("premium") === "true" ? null : (
          <Route
            path="/payment"
            element={
              <PrivateRoute>
                <PaymentTile />
              </PrivateRoute>
            }
          />
        )}
      </Routes>
 
  );
}
