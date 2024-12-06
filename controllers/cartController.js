import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Añadir productos al carrito
const addToCart = async (req, res) => {
    try {
        console.log("Request body:", req.body); // Agregar este log
        const { userId, itemId, size } = req.body;

        if (!userId || !itemId || !size) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        const userData = await prisma.user.findUnique({ where: { id: userId } });

        if (!userData) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const cartData = userData.cartData || {};
        cartData[itemId] = cartData[itemId] || {};
        cartData[itemId][size] = (cartData[itemId][size] || 0) + 1;

        await prisma.user.update({
            where: { id: userId },
            data: { cartData },
        });

        res.json({ success: true, message: "Item added to cart", cartData });
    } catch (error) {
        console.error("Error in addToCart:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};


// Actualizar carrito de compras
const updateCart = async (req, res) => {
    try {
        const { userId, itemId, size, quantity } = req.body;

        if (!userId || !itemId || !size || quantity === undefined) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        const userData = await prisma.user.findUnique({ where: { id: userId } });

        if (!userData) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const cartData = userData.cartData || {};
        if (!cartData[itemId] || !cartData[itemId][size]) {
            return res.status(404).json({ success: false, message: "Item or size not found in cart" });
        }

        cartData[itemId][size] = quantity;

        if (quantity === 0) {
            delete cartData[itemId][size];
            if (Object.keys(cartData[itemId]).length === 0) {
                delete cartData[itemId];
            }
        }

        await prisma.user.update({
            where: { id: userId },
            data: { cartData },
        });

        res.json({ success: true, message: "Cart updated", cartData });
    } catch (error) {
        console.error("Error in updateCart:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// Obtener carrito del usuario
const getUserCart = async (req, res) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({ success: false, message: "Missing userId" });
        }

        const userData = await prisma.user.findUnique({ where: { id: userId } });

        if (!userData) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const cartData = typeof userData.cartData === "string"
            ? JSON.parse(userData.cartData)
            : userData.cartData || {};

        res.json({ success: true, cartData });
    } catch (error) {
        console.error("Error in getUserCart:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export { addToCart, updateCart, getUserCart };
