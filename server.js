import express from "express";
import { connectDB } from "./config/dbConnection.js";
import morgan from "morgan";
import bodyParser from "body-parser";
import { errorHandler, notFound } from "./middlewares/errorMiddleware.js";
import cors from 'cors';
import { PORT } from "./config/environmentVariables.js";

connectDB();

// initializing our Express application here.
const app = express();
app.use(cors());
app.use('/uploads',express.static('uploads'));
// database connection


//  middleware
app.use(bodyParser.json());
app.use(morgan("dev"));

//import router
import userRoute from "./routes/userRoute.js";
import documentRoute from "./routes/documentRoute.js";
import leaveRoute from "./routes/leaveRoute.js";
// api calls
app.use("/api/user/", userRoute);
app.use("/api/document/", documentRoute);
app.use("/api/leave/", leaveRoute);
// error handling
app.use(notFound);
app.use(errorHandler);

// define port number
const port = PORT;

// listening port
app.listen(port, () => {
  console.log(`server is up and running on port: ${port}.`);
});
