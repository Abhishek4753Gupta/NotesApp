
import rateLimit from '../config/upstash.js';

const rateLimiterMiddleware = async (req, res, next) => {
    try {
        const { success } = await rateLimit.limit(req.ip);  
        if (!success) {
            return res.status(429).json({ message: "Too many requests. Please try again later." });
        }
        next();
    } catch (error) {
        console.error("Rate limit error:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};

export default rateLimiterMiddleware;