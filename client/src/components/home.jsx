import React from "react";
import { HomeIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();

  function handleClick() {
    navigate("/mainpage");
  }
  return (
    <HomeIcon
      onClick={handleClick}
      className="absolute top-6 right-5 h-10 w-10 bg-white/10 border border-white/20 text-white p-2 rounded-full flex items-center justify-center hover:bg-white/20 transition-all duration-300 transform hover:scale-105"
    />
  );
}
