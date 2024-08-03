import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    // Check if the Authorization header is present and starts with 'Bearer '
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: "Authorization header missing or improperly formatted" });
    }

    // Extract the token from the Authorization header
    const token = authHeader.split(' ')[1];

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Add relevant decoded data to the request object based on the HTTP method
        if (req.method === 'GET') {
            req.query.userId = decoded.id;
            req.query.username = decoded.username; // Assuming the token contains username
        } else {
            req.body.userId = decoded.id;
            req.body.username = decoded.username; // Assuming the token contains username
        }

        // Proceed to the next middleware or route handler
        next();
    } catch (error) {
        // Handle specific JWT verification errors
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ success: false, message: "Token expired" });
        }
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ success: false, message: "Invalid token" });
        }

        // Handle any other errors
        console.error("Authentication error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export default authMiddleware;
