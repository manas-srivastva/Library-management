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
import bookCopyRoutes from "./routes/bookCopyRoutes.js";
import borrowRoutes from "./routes/borrowRoutes.js";
import reservationRoutes from "./routes/reservationRoutes.js";
import fineRoutes from "./routes/fineRoutes.js";
import swaggerUi from "swagger-ui-express";
import specs from "./config/swagger.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import auditRoutes from "./routes/auditRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
const app = express();

app.use(express.json());

app.use(express.urlencoded({
    extended: true
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


app.use(

    "/api/bookcopies",

    bookCopyRoutes

);

app.use(

    "/api/borrows",

    borrowRoutes

);


app.use(

    "/api/reservations",

    reservationRoutes

);

app.use(

    "/api/fines",

    fineRoutes

);

app.use(

    "/api-docs",

    swaggerUi.serve,

    swaggerUi.setup(specs)

);


app.use(

    "/api/notifications",

    notificationRoutes

);

app.use(

    "/api/audit",

    auditRoutes

);



app.use(

    "/api/analytics",

    analyticsRoutes

);


app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "LibraAI API Running"
    })
})

export default app