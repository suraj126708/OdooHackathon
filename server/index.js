const bodyParser = require("body-parser");
const express = require("express");
const cors = require("cors");
const path = require("path");

const AuthRouter = require("./routes/AuthRouter");
const ProductsRouter = require("./routes/ProductsRouter");
const attendanceRoutes = require("./routes/attendanceRoutes");
const ContactRoute = require("./routes/ContactRoute");
const workerRoute = require("./routes/workerRoute");

const app = express();
require("dotenv").config();
require("./models/db");

const PORT = process.env.PORT || 8080;

app.use(bodyParser.json());

app.use(cors());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/auth", AuthRouter);
app.use("/userinfo", ProductsRouter);
app.use("/attendance", attendanceRoutes);
app.use("/contact", ContactRoute);
app.use("/workers", workerRoute);

app.get("/ping" , (req , res )=> {
  res.send("hello server");
});

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
