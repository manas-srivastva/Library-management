import express from "express";
import errorHandler from "./middlewares/errorHandler.js";
import cors from "cors"
import helmet from "helmet";
import morgan from "morgan"
import authRoutes from "./routes/authRoutes.js";
const app=express();

app.use(express.json());

app.use(express.urlencoded({
    extended:true
}));

app.use(cors());

app.use(helmet());
app.use(morgan("dev"));
app.use(errorHandler);
app.use(

  "/api/auth",

  authRoutes

);
app.get("/",(req,res)=>{
    res.status(200).json({
        success:true,
        message:"LibraAI API Running"
    })
})

export default app