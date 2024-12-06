import jwt from 'jsonwebtoken';

const adminAuth = async (req, res, next) => {
    try {
        const { token } = req.headers;
        if (!token) {
            return res.status(401).json({ success: false, message: "Not Authorized. Login Again" });
        }

        const JWT_SECRET = process.env.JWT_SECRET;
        const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

        if (!JWT_SECRET || !ADMIN_EMAIL) {
            return res.status(500).json({ success: false, message: "Server configuration error. Please try again later." });
        }

        const token_decode = jwt.verify(token, JWT_SECRET);
        console.log("Token decodificado:", token_decode);

        if (token_decode.email !== ADMIN_EMAIL) {
            return res.status(401).json({ success: false, message: "Not Authorized. Login Again" });
        }

        next();
    } catch (error) {
        console.log("Error en la validación del token:", error.message);
        return res.status(500).json({ success: false, message: error.message });
    }
};

export default adminAuth;
