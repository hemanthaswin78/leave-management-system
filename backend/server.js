// // // require("dotenv").config();

// // // console.log("=================================");
// // // console.log("ENV CHECK");
// // // console.log("PORT:", process.env.PORT);
// // // console.log("MONGO_URI:", process.env.MONGO_URI);
// // // console.log("JWT_SECRET:", process.env.JWT_SECRET);
// // // console.log("=================================");

// // // const express = require("express");
// // // const cors = require("cors");

// // // const connectDB = require("./config/db");

// // // const app = express();

// // // // Middleware
// // // app.use(cors());
// // // app.use(express.json());

// // // // Connect Database
// // // connectDB();

// // // // Routes
// // // app.use("/api/auth", require("./routes/authRoutes"));
// // // app.use("/api/leaves", require("./routes/leaveRoutes"));

// // // // Test Route
// // // app.get("/", (req, res) => {
// // //   res.send("Leave Management System API Running");
// // // });

// // // // Start Server
// // // const PORT = process.env.PORT || 5000;

// // // app.listen(PORT, () => {
// // //   console.log(`Server running on port ${PORT}`);
// // // });



// // require("dotenv").config();

// // console.log("=================================");
// // console.log("ENV CHECK");
// // console.log("PORT:", process.env.PORT);
// // console.log("MONGO_URI:", process.env.MONGO_URI);
// // console.log("JWT_SECRET:", process.env.JWT_SECRET);
// // console.log("=================================");

// // const express = require("express");
// // const cors = require("cors");
// // const connectDB = require("./config/db");

// // const app = express();

// // // Middleware
// // app.use(cors({
// //   origin: [
// //     "http://localhost:3000",
// //     "https://leave-management-system-alpha-one.vercel.app"
// //   ],
// //   methods: ["GET", "POST", "PUT", "DELETE"],
// //   allowedHeaders: ["Content-Type", "Authorization"]
// // }));

// // app.use(express.json());

// // // Connect Database
// // connectDB();

// // // Routes
// // app.use("/api/auth", require("./routes/authRoutes"));
// // app.use("/api/leaves", require("./routes/leaveRoutes"));

// // // Health Check Route
// // app.get("/", (req, res) => {
// //   res.send("Leave Management System API Running");
// // });

// // // Start Server
// // const PORT = process.env.PORT || 5000;

// // app.listen(PORT, () => {
// //   console.log(`Server running on port ${PORT}`);
// // });



// require("dotenv").config();

// console.log("=================================");
// console.log("ENV CHECK");
// console.log("PORT:", process.env.PORT);
// console.log("MONGO_URI:", process.env.MONGO_URI);
// console.log("JWT_SECRET:", process.env.JWT_SECRET);
// console.log("=================================");

// const express = require("express");
// const cors = require("cors");
// const connectDB = require("./config/db");

// const app = express();

// // Allow ALL origins
// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
//   res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
//   if (req.method === "OPTIONS") {
//     return res.sendStatus(200);
//   }
//   next();
// });

// app.use(express.json());

// // Connect Database
// connectDB();

// // Routes
// app.use("/api/auth", require("./routes/authRoutes"));
// app.use("/api/leaves", require("./routes/leaveRoutes"));

// // Health Check
// app.get("/", (req, res) => {
//   res.send("Leave Management System API Running");
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });




require("dotenv").config();

console.log("=================================");
console.log("ENV CHECK");
console.log("PORT:", process.env.PORT);
console.log("MONGO_URI:", process.env.MONGO_URI);
console.log("JWT_SECRET:", process.env.JWT_SECRET);
console.log("=================================");

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

// Allow ALL origins
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());

connectDB();

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/leaves", require("./routes/leaveRoutes"));

app.get("/", (req, res) => {
  res.send("Leave Management System API Running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});