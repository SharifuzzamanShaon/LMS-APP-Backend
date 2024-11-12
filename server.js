const app = require("./app");
const bodyParser = require("body-parser");
const useRouter = require("./router/user");
const { connectDB } = require("./DB/ConnectDB");
const router = require("./router");
const cors = require("cors");
const path = require("path");
require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const authMiddleware = require("./middleware/authenticate/authMiddleware");
require("dotenv").config();
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URLS ? process.env.CLIENT_URLS.split(',') : [], // This should match the address of your frontend
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true, // Enable this if you need to handle cookies
  })
);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));

app.get("/", (req, res) => {
  res.status(200).json({ message: "welcome" });
});

app.post("/token", authMiddleware, (req, res) => {
  console.log("user is", req.user);
});

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "views")));

app.use(express.static(path.join(__dirname, "public")));

app.get("/show", (req, res) => {
  const data = {
    name: "Json Roy",
  };
  res.send("Hii");
});

app.use("/api", useRouter);

app.use("/api/v1", router);

app.use((error, req, res, text) => {
  const message = error.message ? error.message : "Server Error Occured";
  const status = error.status ? error.status : 500;
  res.status(status).json({ success: false, message });
});

const port =process.env.SERVER_PORT || 5000;
const server = app.listen(port, async () => {
  console.log(`server Running at http://localhost:${port}`);
  await connectDB();
});
const io = require("socket.io")(server, {
  pingTimeout: 50000,
  cors: {
    origin: [process.env.CLIENT_URL], // Allow these HTTP methods
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("connected to socket.io");
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    console.log(userData._id);
    socket.emit("connected");

    socket.on("join chat", (room) => {
      socket.join(room);
      console.log("user joined room", room);
    });
    socket.on("new message", (newMessageRecieved) => {
      const msgContent = newMessageRecieved;
      console.log("chat:::", msgContent);

      if (!msgContent.chat.users) {
        console.log("User not defined");
        return;
      }
      if (msgContent.chat.users) {
        msgContent.chat.users.forEach((user) => {
          console.log(`USER:${user}`);

          if (user._id == msgContent.sender._id) return;
          socket.in(user._id).emit("message received", msgContent);
          console.log(msgContent);
        });
      }
    });
  });
});
