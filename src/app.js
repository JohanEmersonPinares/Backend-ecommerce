import express from "express";
import cors from "cors";
import "dotenv/config";
import userRouter from "../routes/userRoute.js";
import productRouter from "../routes/productRoute.js";

const app = express();

// Configuración de CORS
app.use(cors());
app.use(express.json());

// Rutas para las diferentes secciones de la API
// app.use("/api/food", foodRouter);
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
// app.use("/api/order", orderRouter);
// app.use("/api/cart", cartRouter);

// Ruta estática para servir las imágenes
app.use("/uploads", express.static("uploads"));

export default app;
