import express from "express";
import morgan from "morgan";
import connect from "./db/db.js";
import userRoutes from "./routes/user.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
connect();
const app = express();

app.use(morgan("dev"));

// debug: log raw request body to diagnose parsing errors
app.use((req, res, next) => {
    let data = "";
    req.on("data", chunk => { data += chunk; });
    req.on("end", () => {
        if (data) console.log("raw body:", data);
    });
    next();
});

app.use(express.json());
app.use(cors());
app.use("/users", userRoutes);
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

export default app;