import express from "express";
import errorHandler from "./middlewares/errorHandler.js";
import cors from "cors"
import helmet from "helmet";
import morgan from "morgan"
import authRoutes from "./routes/authRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import authorRoutes from "./routes/authorRoutes.js"
import publisherRoutes from "./routes/publisherRoutes.js";
import bookRoutes from "./routes/bookRoutes.js"
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
app.use(

"/api/categories",

categoryRoutes

);

app.use(

"/api/authors",

authorRoutes

);

app.use(
"/api/publishers",
publisherRoutes
);

app.use(

"/api/books",

bookRoutes

);


app.get("/",(req,res)=>{
    res.status(200).json({
        success:true,
        message:"LibraAI API Running"
    })
})

export default app