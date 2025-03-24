import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { Navigate } from "react-router-dom";

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
      <div>
        <h3>Loading...</h3>
      </div>
    );
  }

  if (!isValidToken) {
    console.log("Redirecting to login...");
    return <Navigate to="/login" />;
  }

  return children;
}
