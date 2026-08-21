import jwt from "jsonwebtoken";

const getSecretKey = () => process.env.SECRET_KEY || "jobportal_jwt_secret_key_2026_secure";

const isAuthenticated = async (req, res, next) => {
    try {
        let token = req.cookies?.token;
        
        // Also support Bearer token in Authorization header
        if (!token && req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            return res.status(401).json({
                message: "User not authenticated. Please log in.",
                success: false,
            });
        }

        const secretKey = getSecretKey();
        const decode = jwt.verify(token, secretKey);
        if (!decode || !decode.userId) {
            return res.status(401).json({
                message: "Invalid or expired token.",
                success: false
            });
        }

        req.id = decode.userId;
        next();
    } catch (error) {
        console.error("Auth middleware error:", error.message);
        return res.status(401).json({
            message: "Authentication failed. Invalid or expired token.",
            success: false
        });
    }
};

export default isAuthenticated;