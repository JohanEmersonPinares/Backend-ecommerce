import { v2 as cloudinary } from 'cloudinary';
import prisma from '../config/db.js';
import upload from '../middleware/multer.js';

// Función para agregar un producto
export const addProduct = async (req, res) => {
    try {
        const { name, description, price, category, subCategory, sizes, bestseller } = req.body;

        const image1 = req.files?.image1 ? req.files.image1[0] : undefined;
        const image2 = req.files?.image2 ? req.files.image2[0] : undefined;
        const image3 = req.files?.image3 ? req.files.image3[0] : undefined;
        const image4 = req.files?.image4 ? req.files.image4[0] : undefined;

        const images = [image1, image2, image3, image4].filter((item) => item !== undefined);

        if (images.length === 0) {
            return res.status(400).json({ success: false, message: "No images uploaded." });
        }

        const imagesUrl = await Promise.all(
            images.map(async (item) => {
                const result = await cloudinary.uploader.upload(item.path, { resource_type: "image" });
                return result.secure_url;
            })
        );

        const productData = {
            name,
            description,
            category,
            price: parseFloat(price),
            subCategory,
            bestseller: bestseller === 'true',
            sizes: JSON.parse(sizes),
            image: imagesUrl,
            date: new Date().toISOString(),
        };

        const product = await prisma.product.create({
            data: productData,
        });

        return res.json({ success: true, message: "Product Added", product });
    } catch (error) {
        console.log(error);
        const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred.";
        return res.status(500).json({ success: false, message: errorMessage });
    }
};

// Función para listar productos
export const listProducts = async (req, res) => {
    try {
        const products = await prisma.product.findMany();
        return res.json({ success: true, products });
    } catch (error) {
        console.log(error);
        const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred.";
        return res.status(500).json({ success: false, message: errorMessage });
    }
};

// Función para eliminar un producto
export const removeProduct = async (req, res) => {
    try {
        // Asegúrate de obtener el id correctamente desde el body o params
        const { id } = req.body;  // O usa req.params.id si el id se pasa en la URL

        if (!id) {
            return res.status(400).json({ success: false, message: "Product ID is required" });
        }

        const product = await prisma.product.delete({
            where: { id: Number(id) }
        });

        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        return res.json({ success: true, message: "Product Removed" });
    } catch (error) {
        console.log(error);
        const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred.";
        return res.status(500).json({ success: false, message: errorMessage });
    }
};

// Función para obtener un producto individual
export const singleProduct = async (req, res) => {
    try {
        const { productId } = req.body;
        const product = await prisma.product.findUnique({
            where: { id: Number(productId) },
        });

        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        return res.json({ success: true, product });
    } catch (error) {
        console.log(error);
        const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred.";
        return res.status(500).json({ success: false, message: errorMessage });
    }
};
