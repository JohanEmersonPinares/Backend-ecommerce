import dotenv from 'dotenv';
import validator from 'validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import express from 'express';

dotenv.config();

const prisma = new PrismaClient();

// Crear token JWT
const createToken = (id) => {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined');
    }
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" });
}

// Controlador para iniciar sesión
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Buscar usuario
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            res.status(404).json({ success: false, message: "User doesn't exist" });
            return;
        }

        // Comparar contraseñas
        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            const token = createToken(user.id);
            res.status(200).json({ success: true, token });
        } else {
            res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// Controlador para registrar usuario
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Verificar si ya existe
        const exists = await prisma.user.findUnique({
            where: { email },
        });

        if (exists) {
            res.status(400).json({ success: false, message: "User already exists" });
            return;
        }

        // Validaciones
        if (!validator.isEmail(email)) {
            res.status(400).json({ success: false, message: "Please enter a valid email" });
            return;
        }

        if (password.length < 8) {
            res.status(400).json({ success: false, message: "Please enter a strong password" });
            return;
        }

        // Hash de la contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Crear usuario
        const newUser = await prisma.user.create({
            data: { name, email, password: hashedPassword },
        });

        const token = createToken(newUser.id);

        res.status(201).json({ success: true, token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// Controlador para login de administrador
const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPassword = process.env.ADMIN_PASSWORD;
        const jwtSecret = process.env.JWT_SECRET;

        // Validar que las variables de entorno están definidas
        if (!adminEmail || !adminPassword || !jwtSecret) {
            return res.status(500).json({ success: false, message: "Environment variables ADMIN_EMAIL, ADMIN_PASSWORD, or JWT_SECRET are not defined." });
        }

        // Verificar si las credenciales coinciden
        if (email.trim() === adminEmail.trim() && password.trim() === adminPassword.trim()) {
            const token = jwt.sign({ email }, jwtSecret, { expiresIn: "1h" });
            return res.status(200).json({ success: true, token });
        } else {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export { loginUser, registerUser, adminLogin };
