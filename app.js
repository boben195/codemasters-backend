import https from "https";
import fs from "fs";
import "dotenv/config";
import mongoose from "mongoose";
import express from "express";
import morgan from "morgan";
import cors from "cors";
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger.js';

import authRouter from "./routes/authRouter.js";
import usersRouter from "./routes/userRouter.js";
import waterRouter from "./routes/waterRouter.js";

const DB_URI = process.env.DB_URI;
const app = express();

app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/auth", authRouter);
app.use("/users", usersRouter);
app.use("/water", waterRouter);

app.use((_, res) => {
    res.status(404).json({message: "Route not found"});
});

app.use((err, _, res, __) => {
    const {status = 500, message = "Server error"} = err;
    res.status(status).json({message});
});

if (process.env.RUN_MODE === 'PROD') {
    const privateKey = fs.readFileSync('../epowhost.com.key', 'utf8');
    const certificate = fs.readFileSync('../epowhost.com.cert', 'utf8');
    const ca = fs.readFileSync('../epowhost.com.bundle', 'utf8');
    const credentials = {key: privateKey, cert: certificate, ca: ca};

    mongoose.connect(DB_URI)
        .then(() => {
            console.info("Database connection successfully");
            const httpsServer = https.createServer(credentials, app);
            httpsServer.listen(3443, () => {
                console.log("Server is running. Use our API on port: 3443");
            });
        })
        .catch(err => {
            console.error("Database connection error:", err);
        });

} else {
    mongoose.connect(DB_URI)
        .then(() => {
            console.info("Database connection successfully");
            app.listen(3000, () => {
                console.log("Server is running. Use our API on port: 3000");
            });
        })
        .catch((error) => {
            console.error("Database connection error", error);
            process.exit(1);
        });
}


