import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoute from './routes/user.route.js';
import gigRoute from './routes/gig.route.js';
import reviewRoute from './routes/review.route.js';
import orderRoute from './routes/order.route.js';
import conversationRoute from './routes/conversation.route.js';
import messageRoute from './routes/message.route.js';
import authRoute from './routes/auth.route.js';
import adminRoute from './routes/admin.route.js';
import cookieParser from "cookie-parser";
import cors from 'cors';
import rateLimit from "express-rate-limit";
import createError from './utils/createError.js';

const app = express();
dotenv.config();
mongoose.set('strictQuery', true);
mongoose.set('sanitizeFilter', true);
const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO);
    console.log('database connected');
  } catch (error) {
    console.log(error);
  }
};
//middleware
//frontend port number
app.use(cors({origin:process.env.CLIENT_URL || "http://localhost:3000",credentials:true}));
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());
app.use(
  "/api",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

app.use((req, res, next) => {
  if (["GET", "HEAD", "OPTIONS"].includes(req.method)) return next();
  if (!req.cookies.accessToken) return next();

  const csrfCookieToken = req.cookies.csrfToken;
  const csrfHeaderToken = req.get("x-csrf-token");

  if (!csrfCookieToken || !csrfHeaderToken || csrfCookieToken !== csrfHeaderToken) {
    return next(createError(403, "Invalid CSRF token"));
  }
  next();
});

app.use('/api/auth/', authRoute);
app.use('/api/users', userRoute);
app.use('/api/gigs', gigRoute);
app.use('/api/reviews', reviewRoute);
app.use('/api/orders', orderRoute);
app.use('/api/conversations', conversationRoute);
app.use('/api/messages', messageRoute);
app.use('/api/admin', adminRoute);


app.use((err, req, res, next) => {
  const errorStatus = err.status || 500
  const errorMessage = err.message || "Something went wrong"

  return res.status(errorStatus).send(errorMessage);
})
//backend port number
app.listen(8000, () => {
  connect();
  console.log('localserver running');
});