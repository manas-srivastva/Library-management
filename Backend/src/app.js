import express from "express";
import errorHandler from "./middlewares/errorHandler.js";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import authRoutes from "./routes/authRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import authorRoutes from "./routes/authorRoutes.js";
import publisherRoutes from "./routes/publisherRoutes.js";
import bookRoutes from "./routes/bookRoutes.js";
import bookCopyRoutes from "./routes/bookCopyRoutes.js";
import borrowRoutes from "./routes/borrowRoutes.js";
import reservationRoutes from "./routes/reservationRoutes.js";
import fineRoutes from "./routes/fineRoutes.js";
import swaggerUi from "swagger-ui-express";
import specs from "./config/swagger.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import auditRoutes from "./routes/auditRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import healthRoutes from "./routes/healthRoutes.js";

const app = express();
const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:5173,http://localhost:3000").split(",").map((origin) => origin.trim()).filter(Boolean);

app.disable("x-powered-by");

app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
                return;
            }

            callback(new Error("Not allowed by CORS"));
        },
        credentials: true,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

app.use(
    helmet({
        contentSecurityPolicy: false,
        crossOriginResourcePolicy: { policy: "cross-origin" },
    })
);

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({
    extended: true,
    limit: "1mb",
}));

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many requests, please try again later.",
    },
});

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true,
    message: {
        success: false,
        message: "Too many login attempts. Please wait and try again later.",
    },
});

app.use(apiLimiter);
app.use("/api/auth", authLimiter);
app.use(morgan("dev"));

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
app.use("/api/users", userRoutes);

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


app.use(

    "/api/uploads",

    uploadRoutes

);

app.use("/health",healthRoutes);


app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "LibraAI API Running"
    })
})


app.use(errorHandler);
export default app