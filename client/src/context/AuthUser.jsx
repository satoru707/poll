import { useEffect, useState } from "react";
import axios from "axios";
import Context from "./context";
import { jwtDecode } from "jwt-decode";
import { Navigate } from "react-router";

export default function AuthUser(props) {
  const [isAuthenticated, setAuthentication] = useState(false);
  const [email, setEmail] = useState();
  const token = sessionStorage.getItem("token");
 
  useEffect(() => {
    async function authUser() {
      try {
        const response = await axios.get("http://localhost:3000/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response.data.message);

        setAuthentication(true);
        setEmail(jwtDecode(token).email);
        console.log(email);

        // console.log("Authenticating the user");
        // console.log(response.data);
      } catch (error) {
        console.log(error);
        // console.log("error getting user token");
      }
    }
    authUser();
  }, [token, email, isAuthenticated]);
  if (isAuthenticated) {
    return (
      <Context.Provider value={[email, setEmail]}>
        {props.children}
      </Context.Provider>
    );
  } else {
    <Navigate to="/login" />;
  }
}
