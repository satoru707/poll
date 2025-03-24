import jwt from "jsonwebtoken";
import "dotenv/config";
import process from "process";

export default function authenticateToken(req, res, next) {
  const token = req.headers["authorization"]?.split(" ")[1];
  // console.log("authentication.js");
  // console.log(token);

  if (!token) return res.json({ message: "No token provided." });

  jwt.verify(token, process.env.SECRET_JWT_KEY, (err, decoded) => {
    if (err) return res.json({ message: `Invalid or expired token.` });
    req.user = decoded;
    next();
  });
}
