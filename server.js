import express from "express";
import { connectDB } from "./config/dbConnection.js";
import morgan from "morgan";
import bodyParser from "body-parser";
import { errorHandler, notFound } from "./middlewares/errorMiddleware.js";
import cors from "cors";
import { PORT } from "./config/environmentVariables.js";

connectDB();

// initializing our Express application here.
const app = express();
app.use(cors());
app.use("/uploads", express.static("uploads"));
// database connection

// MIDDLEWARE
app.use(bodyParser.json());
app.use(morgan("dev"));

//import router
import userRoute from "./routes/userRoute.js";
import documentRoute from "./routes/documentRoute.js";
import leaveRoute from "./routes/leaveRoute.js";
import holidayRoute from "./routes/holidayRoute.js";
import dashboardRoute from "./routes/dashboardRoute.js";
// api calls
app.use("/api/user/", userRoute);
app.use("/api/document/", documentRoute);
app.use("/api/leave/", leaveRoute);
app.use("/api/holiday/", holidayRoute);
app.use("/api/dashboard", dashboardRoute);
// error handling
app.get("/", (req, res) => {	
  res.status(200).send("Welcome to ems-backend!");	
});	

app.use(notFound);
app.use(errorHandler);

// DEFINING PORT
const port = PORT;

// LISTENING TO PORT
app.listen(port, () => {
  console.log(`server is up and running on port: ${port}.`);
});
