/* eslint-disable no-undef */
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

// CORS configuration for Express
const corsOptions = {
  origin: "http://localhost:5173",
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
const REDIRECT_URI = "http://localhost:3000/auth/google/callback";
const oAuth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
//paystack key
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
        amount: amount * 100, // Paystack expects amount in kobo (1 NGN = 100 kobo)
        callback_url: "http://localhost:5173/payment",
      },
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("Paystack data");

    console.log(response.data);

    res.json(response.data);
  } catch (error) {
    console.error("Error initializing payment:", error);
    res.status(500).json({ error: "Payment initialization failed" });
  }
});

// Verify Payment
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
    console.log("Verfiying paystack payment");

    console.log(reference, response.data);

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
    console.log(userExists);
    console.log("Checked if user existed");

    if (userExists.length !== 0) {
      return res.status(400).json({ message: "User already exists." });
    } else {
      const hashed = await bcrypt.hash(password, saltRound);
      const query = await addUser(email, hashed);
      console.log("registered user in register route");

      console.log(query[0]);

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
        message: "User registered successfully",
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
  // console.log(authUrl);

  res.json({ url: authUrl, message: "Is it working" });
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
    console.log(googleId, email, name);

    const token = jwt.sign({ email }, process.env.SECRET_JWT_KEY, {
      expiresIn: "1h",
    });

    const existingUser = await checkUser(email);
    console.log(existingUser);

    if (existingUser.length > 0) {
      null;
    } else {
      try {
        addUser(email, "google");
      } catch (error) {
        console.log(error);
      }
    }
    return res.redirect(`http://localhost:5173/login?token=${token}`);
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
    res.json({ message: "Internal server error" });
  }
});

app.post("/pollconfig", authenticateToken, async (req, res) => {
  const pollconfig = req.body.QandA;
  console.log(pollconfig);
  try {
    const user = await checkUser(pollconfig.email);
    const poll = await addPoll(pollconfig, user[0].id);
    console.log(user[0].id);

    console.log(poll);
  } catch (error) {
    console.log(error);
    return res.json({ message: "error" });
  }
  res.json({ message: "done" });
});

app.post("/pollData", authenticateToken, async (req, res) => {
  try {
    const { code, user } = req.body;
    const id = await checkUser(user);
    console.log(id);

    const fromdb = await getDataFromPin(code);
    const viewed = await checkviewed(fromdb[0].id, id[0].id);
    console.log("Polldata route");
    console.log(fromdb[0]);

    console.log(fromdb[0].id);
    console.log("userid", id[0].id);
    console.log(viewed);

    if (
      viewed.length > 0 ||
      viewed[0]?.user_id == id[0].id ||
      viewed[0]?.datevoted
    ) {
      console.log("no need to add");
      console.log(fromdb);

      //votes is undefined
    } else {
      const prob = await viewedPoll(fromdb[0], id[0].id);
      console.log("start");
      console.log("fromdb", fromdb);
      console.log("viewed", viewed);

      console.log("code", code);
      console.log("user", user);

      console.log("The cause of the problems");
      console.log(prob);
    }

    if (fromdb.length == 0) {
      console.log("No poll found");

      return res.json({ message: "No poll found" });
    }
    console.log("Poll found");

    console.log(fromdb[0]);
    return res.json({ query: fromdb[0] });
  } catch (error) {
    console.log(error);
  }
});

app.post("/getHistory", authenticateToken, async (req, res) => {
  const { email, type } = req.body;
  console.log(email);
  console.log(type);
  const id = await checkUser(email);
  const history = await getHistory(id[0].id, type);
  console.log(history);
  res.json({ data: history });
});

app.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.json({ message: "Failed" });
    } else {
      return res.json({ message: "Logout" });
    }
  });
});

app.post("/saveOption", authenticateToken, async (req, res) => {
  const { email, choice, code, token } = req.body;
  console.log(email);
  console.log(choice, code);
  if (choice == undefined) {
    return null;
  }
  console.log("Choice", choice);
  const data = await getDataFromPin(code);

  try {
    const id = await checkUser(email);
    console.log(id[0].id);
    if (choice.length > 0) {
      if (data[0].polltype == "multiple choice") {
        await addOption(JSON.stringify(choice), code, id[0].id);
      } else {
        await addOption(choice, code, id[0].id);
      }

      console.log(choice.length);
    } else {
      console.log("You is not");
    }
    //the token is the problem
    const newVote = await axios.post(
      "http://localhost:3000/votes",
      { code: data[0].codelink },
      {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      }
    );
    io.emit("newVotes", {
      data: newVote.data,
      message: "Seems like it worked",
    });
    console.log("new votes");
    console.log(newVote);
    console.log(newVote.data);

    return res.json({ message: "Done" });
  } catch (error) {
    console.log(error);
    return res.json({ message: "Error" });
  }
});

app.post("/votes", authenticateToken, async (req, res) => {
  const { code } = req.body;
  console.log(code);
  const votes = await collectVotes(code);
  console.log(votes);
  res.json({ message: "Done", data: votes });
});

app.post("/premium-user", authenticateToken, async (req, res) => {
  const user = req.body.email;
  await setPremium(user);
  res.json("Done");
});

app.post("/checkPremium", authenticateToken, async (req, res) => {
  const user = req.body.user;
  const response = await checkPremium(user);
  console.log("query");
  console.log(response);
  res.json({ query: response });
});

const port = process.env.PORT || 3000;
server = app.listen(port, () => {
  console.log(`Server is running on PORT ${port}`);
});

io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);
  const token = socket.handshake.auth;
  console.log(token);

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
});
