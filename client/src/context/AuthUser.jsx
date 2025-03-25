// import { useEffect, useState } from "react";
// import axios from "axios";
// import Context from "./context";
// import { jwtDecode } from "jwt-decode";
// import { Navigate } from "react-router";

// export default function AuthUser(props) {
//   const [isAuthenticated, setAuthentication] = useState(false);
//   const [email, setEmail] = useState();
//   const token = sessionStorage.getItem("token");
//   const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

//   useEffect(() => {
//     async function authUser() {
//          try {
//         const response = await axios.get(`${BACKEND_URL}/user`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });       
//         console.log(response.data.message);
//         setAuthentication(true);
//         const decoded = jwtDecode(token);
//           setEmail(decoded.email);
//           console.log(decoded.email);
//           console.log('Authenitcate')
//           console.log(isAuthenticated);  
        
//       } catch (error) {
//         console.error("Authentication error:", error);
//         sessionStorage.removeItem("token");
//         setAuthentication(false);
//       }}
//     authUser();
//   }, [token])

//   if (!isAuthenticated) {
//     return <Navigate to="/login" replace />;
//   }

//   return (
//     <Context.Provider value={[email, setEmail]}>
//       {props.children}
//     </Context.Provider>
//   );
// }

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
