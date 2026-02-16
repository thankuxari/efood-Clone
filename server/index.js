// Modules
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

// Import the routers
import userRouter from "./routes/user.routes.js";
import shopRouter from "./routes/shop.routes.js";

dotenv.config();

const app = express();

app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    }),
);
app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ limit: "10mb" }));

app.use("/v1/api/users", userRouter);
app.use("/v1/api/shops", shopRouter);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`Server is running at port ${PORT}`);
});
