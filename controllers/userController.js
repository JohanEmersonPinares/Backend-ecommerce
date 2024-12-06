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
    // Cambiar el tiempo de expiración a 7 días
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};


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

        // Verificar si los campos están presentes
        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        // Verificar si el email es válido
        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: "Please enter a valid email" });
        }

        // Verificar si la contraseña es suficientemente fuerte
        if (password.length < 8) {
            return res.status(400).json({ success: false, message: "Password must be at least 8 characters long" });
        }

        // Verificar si el usuario ya existe
        const exists = await prisma.user.findUnique({
            where: { email },
        });

        if (exists) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        // Generar hash de la contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Crear nuevo usuario
        const newUser = await prisma.user.create({
            data: { name, email, password: hashedPassword },
        });

        // Crear token
        const token = createToken(newUser.id);

        return res.status(201).json({ success: true, token, user: { name: newUser.name, email: newUser.email } });
    } catch (error) {
        console.error("Error in registerUser:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
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
