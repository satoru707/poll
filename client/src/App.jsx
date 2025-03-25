import React, { useContext } from "react";
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

export default function App() {
  const user = useContext(Context);
  console.log(user);

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
