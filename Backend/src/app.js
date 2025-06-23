import express from "express"
import cookieParser from "cookie-parser"
import userRouter from "./routes/user.routes.js"
import productRouter from "./routes/product.routes.js"
import cors from "cors"
const app = express();
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}));
app.use(express.json({limit:"16kb"}));
app.use(express.urlencoded({extended:true,limit:"16kb"}));
app.use(cookieParser());
app.use(express.static("public"));

app.use("/api/v1/user",userRouter);
app.use("/api/v1/product",productRouter);
export default app;