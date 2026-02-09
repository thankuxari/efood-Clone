import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

async function verifyShopToken(req, res, next) {
    try {
        const token = req.cookies.shop_token;

        if (!token) return res.status(400).json("No token was provided");

        const decodedToken = jwt.verify(token, process.env.JWT_SHOP_SECRET);
        req.shop_id = decodedToken._id;
        next();
    } catch (err) {
        if (err.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Token expired" });
        }
        return res.status(401).json({ message: "Invalid token" });
    }
}

export default verifyShopToken;
