import dotenv from 'dotenv';
dotenv.config(); // Cargar variables de entorno primero

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default prisma;
