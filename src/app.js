import express from "express";
import cookieParser from "cookie-parser"
import __dirname from "./dirname.js";
import { connectMongoDB } from "./config/mongoDB.config.js";
import envs from "./config/envs.config.js";
import passport from 'passport';
import { iniciarPassport } from './config/passport.config.js';
import { router as sessionsRouter } from './routes/sessions.router.js';

const app = express();
connectMongoDB();

app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./src/public"))

iniciarPassport()

app.use(passport.initialize())
app.use("/api/sessions", sessionsRouter)

const httpServer = app.listen(envs.PORT, () => {
    console.log(`Server listening on port: ${envs.PORT}`);
});