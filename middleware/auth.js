import jwt from 'jsonwebtoken';

const authUser = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        // Validar si el encabezado está presente
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ success: false, message: "Not Authorized. Login Again" });
        }

        // Validar que JWT_SECRET esté configurado
        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET is not defined in environment variables");
        }

        // Extraer el token del encabezado
        const token = authHeader.split(" ")[1];

        // Verificar el token
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

        // Añadir userId al cuerpo de la solicitud (usamos req.user para consistencia)
        req.user = { id: tokenDecode.id };

        // Pasar al siguiente middleware/controlador
        next();
    } catch (error) {
        console.error("Error in auth middleware:", error);

        // Responder con mensajes más claros
        const message =
            error.name === "TokenExpiredError"
                ? "Session expired. Please login again."
                : error.message || "Invalid token. Login again.";

        // Enviar error con mensaje detallado
        res.status(401).json({ success: false, message });
    }
};

export default authUser;
