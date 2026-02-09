import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

async function generateUserToken(id, res) {
    const token = jwt.sign({ _id: id }, process.env.JWT_USER_SECRET, {
        expiresIn: "5d",
    });

    res.cookie("user_token", token, {
        maxAge: 5 * 24 * 60 * 60 * 1000,
    });

    return token;
}

async function generateShopToken(id, res) {
    const token = jwt.sign({ _id: id }, process.env.JWT_SHOP_SECRET, {
        expiresIn: "5d",
    });

    res.cookie("shop_token", token, {
        maxAge: 5 * 24 * 60 * 60 * 1000,
    });

    return token;
}

export { generateUserToken, generateShopToken };
