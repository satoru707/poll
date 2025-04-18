import express from "express";
import cors from "cors";
import session from "express-session";
import jwt from "jsonwebtoken";
import authenticateToken from "./authentication.js";
import { OAuth2Client } from "google-auth-library";
import { Server } from "socket.io";
import axios from "axios";
import "dotenv/config";
import process from "process";
import bcrypt from "bcryptjs";
  
import {
  addUser,
  checkUser,
  addPoll,
  getDataFromPin,
  viewedPoll,
  getHistory,
  checkviewed,
  addOption,
  collectVotes,
  setPremium,
  checkPremium,
} from "./database.js";

const app = express();
let server;
let io;
const saltRound = 15;

// Environment variables
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3000";

// CORS configuration for Express
const corsOptions = {
  origin: FRONTEND_URL,
  methods: ["GET", "POST"],
  credentials: true,
  optionsSuccessStatus: 200,
  allowedHeaders: ["Authorization", "Content-Type"],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true, maxAge: 1000 * 60 },
  })
);

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = `${BACKEND_URL}/auth/google/callback`;
const oAuth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

// Paystack key
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

// Initialize Payment
app.post("/initialize-payment", authenticateToken, async (req, res) => {
  const { email } = req.body;
  const amount = 500;
  try {
    const response = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        email,
        amount: amount * 100,
        callback_url: `${FRONTEND_URL}/payment`,
      },
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error("Error initializing payment:", error);
    res.status(500).json({ error: "Payment initialization failed" });
  }
});

app.get("/verify-payment/:reference", authenticateToken, async (req, res) => {
  const { reference } = req.params;

  if (!reference) {
    return res.status(400).json({ error: "Reference is required" });
  }

  try {
    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        },
      }
    );
    return res.json(response.data);
  } catch (error) {
    console.error("Error verifying payment:", error);
    res.status(500).json({ error: "Payment verification failed" });
  }
});

// Routes
app.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;
    const userExists = await checkUser(email);

    if (userExists.length !== 0) {
      return res.status(400).json({ message: "User already exists." });
    } else {
      const hashed = await bcrypt.hash(password, saltRound);
      const query = await addUser(email, hashed);

      const token = jwt.sign({ email }, process.env.SECRET_JWT_KEY, {
        expiresIn: "1h",
      });

      res.status(200).json({
        success: true,
        message: "User registered successfully",
        token: token,
      });
    }
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({
      success: false,
      message: "Failed to register user",
      error: error.message,
    });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const userExists = await checkUser(email);

    if (userExists.length == 0) {
      return res.status(400).json({ message: "User doesn't exists." });
    } else {
      const compare = await bcrypt.compare(password, userExists[0].password);
      if (!compare) {
        return res.json({ message: "Invalid password" });
      }
      const token = jwt.sign({ email }, process.env.SECRET_JWT_KEY, {
        expiresIn: "1h",
      });

      res.status(200).json({
        success: true,
        message: "User logged in successfully",
        token: token,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to log in user",
      error: error.message,
    });
  }
});

app.get("/auth/google", (req, res) => {
  const authUrl = oAuth2Client.generateAuthUrl({
    scope: ["profile", "email"],
  });
  res.json({ url: authUrl, message: "Google auth URL generated" });
});

app.get("/auth/google/callback", async (req, res) => {
  try {
    const { code } = req.query;
    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);

    const userInfoResponse = await oAuth2Client.request({
      url: "https://www.googleapis.com/oauth2/v3/userinfo",
    });
    const { sub: googleId, email, name } = userInfoResponse.data;

    const token = jwt.sign({ email }, process.env.SECRET_JWT_KEY, {
      expiresIn: "1h",
    });

    const existingUser = await checkUser(email);

    if (existingUser.length === 0) {
      try {
        await addUser(email, "google");
      } catch (error) {
        console.log(error);
      }
    }
    return res.redirect(`${FRONTEND_URL}/login?token=${token}`);
  } catch (error) {
    console.error("Authentication error:", error.message);
    return res.status(500).send("Authentication failed");
  }
});

app.get("/user", authenticateToken, async (req, res) => {
  try {
    res.json({ token: req.user, message: "Auth done" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/pollconfig", authenticateToken, async (req, res) => {
  const pollconfig = req.body.QandA;
  try {
    const user = await checkUser(pollconfig.email);
    const poll = await addPoll(pollconfig, user[0].id);
    console.log(poll)
    
    res.json({ message: "Poll created successfully", poll: poll });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error creating poll" });
  }
});

app.post("/pollData", authenticateToken, async (req, res) => {
  try {
    const { code, user } = req.body;
    const id = await checkUser(user);
    const fromdb = await getDataFromPin(code);
    const viewed = await checkviewed(fromdb[0].id, id[0].id);

    if (fromdb.length === 0) {
      return res.status(404).json({ message: "No poll found" });
    }

    if (
      viewed.length === 0 ||
      viewed[0]?.user_id !== id[0].id ||
      !viewed[0]?.datevoted
    ) {
      await viewedPoll(fromdb[0], id[0].id);
    }

    return res.json({ query: fromdb[0] });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching poll data" });
  }
});

app.post("/getHistory", authenticateToken, async (req, res) => {
  try {
    const { email, type } = req.body;
    const id = await checkUser(email);
    const history = await getHistory(id[0].id, type);
    res.json({ data: history });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching history" });
  }
});

app.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Failed to logout" });
    } else {
      return res.json({ message: "Logged out successfully" });
    }
  });
});

app.post("/saveOption", authenticateToken, async (req, res) => {
  try {
    const { email, choice, code, token } = req.body;
    if (choice === undefined) {
      return res.status(400).json({ message: "No choice provided" });
    }

    const data = await getDataFromPin(code);
    const id = await checkUser(email);

    if (choice.length > 0) {
      if (data[0].polltype === "multiple choice") {
        await addOption(JSON.stringify(choice), code, id[0].id);
      } else {
        await addOption(choice, code, id[0].id);
      }
    }

    const newVote = await axios.post(
      `${BACKEND_URL}/votes`,
      { code: data[0].codelink },
      {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      }
    );

    io.emit("newVotes", {
      data: newVote.data,
      message: "Vote recorded successfully",
    });

    return res.json({ message: "Vote saved successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error saving vote" });
  }
});

app.post("/votes", authenticateToken, async (req, res) => {
  try {
    const { code } = req.body;
    const votes = await collectVotes(code);
    res.json({ message: "Votes retrieved", data: votes });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error retrieving votes" });
  }
});

app.post("/premium-user", authenticateToken, async (req, res) => {
  try {
    const user = req.body.email;
    await setPremium(user);
    res.json({ message: "Premium status updated" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error updating premium status" });
  }
});

app.post("/checkPremium", authenticateToken, async (req, res) => {
  try {
    const user = req.body.user;
    const response = await checkPremium(user);
    res.json({ query: response });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error checking premium status" });
  }
});

const port = process.env.PORT || 3000;
server = app.listen(port, () => {
  console.log(`Server is running on PORT ${port}`);
});

io = new Server(server, {
  cors: {
    origin: FRONTEND_URL,
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);
  const token = socket.handshake.auth;
  
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});