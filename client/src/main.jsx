import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import AuthUser from "./context/AuthUser.jsx";
import process from "process";
import { BrowserRouter } from "react-router-dom";

window.process = process;

//npx tailwindcss -i ./src/index.css -o ./src/output.css --watch
createRoot(document.getElementById("root")).render(
  <StrictMode>
     <BrowserRouter>   
    <AuthUser>
      <App />
    </AuthUser>
     </BrowserRouter>
  </StrictMode>
    

);
