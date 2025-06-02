import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import 'dotenv/config';
import connectDB from './utils/db.js';
import authRoutes from './routes/authRoutes.js'
import customerRoutes from './routes/customerRoutes.js'
import segmentRoutes from './routes/segmentRoutes.js'

const app = express();
const PORT = process.env.PORT || 5000;

await connectDB();
app.use(cookieParser());
app.use(cors(
    {
        origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true
    }
));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api", customerRoutes);
app.use("/api", segmentRoutes);


app.get('/', (req, res) => {
    res.send('Hello from the server!');
}
);
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
