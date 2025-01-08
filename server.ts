import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import userRouter from './routes/user_routes';
import postRouter from './routes/post_routes';
import comenntRouter from './routes/comments_routes';
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";


dotenv.config();

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api/auth', userRouter);
app.use('/api/post', postRouter);
app.use('/api/comment', comenntRouter);

const swaggerOptions = {
  definition: {
      openapi: "3.0.0",
      info: {
          title: "Auth API",
          version: "1.0.0",
          description: "User authentication API"
      },
      servers: [{ url: "http://localhost:3000" }]
  },
  apis: ["./routes/*.ts"]
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocs));

export default app;