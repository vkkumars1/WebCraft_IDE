const express = require("express");
const mongoose = require("mongoose");

const userRoutes = require("./routes/userRoutes");
const projectRoutes = require("./routes/projectRoutes");
const cors = require("cors");
const path = require("path");
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;


//Backend Folder path
const _dirname = path.resolve();
// Middleware


app.use(express.json());
// CORS configuration

// Define allowed origins
const allowedOrigins = ['http://localhost:3000'];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
};

app.use(cors(corsOptions));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected..."))
  .catch((err) => console.log(err));

app.use("/api",userRoutes);
app.use("/create",projectRoutes);

app.use(express.static(path.join(_dirname,"/Frontend/dist")));
app.get('*',(_,res)=>{
  res.sendFile(path.resolve(_dirname, "Frontend" ,"dist" , "index.html"))
})

app.listen(PORT, () => console.log(`Listening at ${PORT}...`));
