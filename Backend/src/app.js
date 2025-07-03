import express from "express"
import cookieParser from "cookie-parser"
import userRouter from "./routes/user.routes.js"
import productRouter from "./routes/product.routes.js"
import cors from "cors"
import { errorHandler } from "./middlewares/errorHandler.middleware.js"
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
app.use("/api/v1/products",productRouter);
app.use(errorHandler);
export default app;