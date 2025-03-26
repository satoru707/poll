import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { Navigate } from "react-router-dom";
import { LoaderIcon } from "lucide-react";

export default function PrivateRoute({ children }) {
  const [isValidToken, setIsValidToken] = useState(false);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const token = sessionStorage.getItem("token");

        if (!token) {
          throw new Error("No token found");
        }

        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        // console.log("Decoded token");
        // console.log(decodedToken);

        if (decodedToken.exp < currentTime) {
          throw new Error("Token expired");
        }
        setIsValidToken(true);
      } catch (error) {
        console.error("Token verification failed:", error);
        setIsValidToken(false);
        sessionStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 flex items-center justify-center p-4 sm:p-6">
      <div className="fixed inset-0 flex items-center justify-center">
        <LoaderIcon className="h-10 w-10 z-20 sm:h-10 sm:w-10 bg-white/10 border border-white/20 text-white p-2 rounded-full hover:bg-white/20 transition-transform hover:scale-105" />
      </div>
    </div>
    );
  }

  if (!isValidToken) {
    console.log("Redirecting to login...");
    return <Navigate to="/login" />;
  }

  return children;
}
