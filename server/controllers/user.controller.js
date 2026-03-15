import { getQuery, getQueryAll, runQuery } from "../utils/promisesWrapper.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { generateUserToken } from "../utils/jwt.js";
import { randomUUID } from "crypto";

dotenv.config();

async function signUpUser(req, res) {
    const { username, email, password } = req.body;

    const sqlExistingUser = "SELECT * FROM users WHERE username = ?";
    const sqlSignUpUser =
        "INSERT INTO users(_id, username, email, password) VALUES (?, ?, ?, ?)";

    const sqlCreateDefaultCart = "INSERT INTO cart(_id, user_id) VALUES (?, ?)";
    try {
        if (!username || !email || !password)
            throw new Error(`All fields need to be filled!`);

        // Check if the user already exists
        const existingUser = await getQuery(sqlExistingUser, [username]);

        if (existingUser) throw new Error(`User already exists`);

        // Encrypt the password
        const SALT_ROUNDS = Number(process.env.SALT_ROUNDS) || 8;
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        // Create a unique ID
        const userId = randomUUID();
        const cart_id = randomUUID();

        // Sign Up the user
        const user = await runQuery(sqlSignUpUser, [
            userId,
            username,
            email,
            hashedPassword,
        ]);

        // Create user default cart

        await runQuery(sqlCreateDefaultCart, [cart_id, userId]);

        // Generate JWT Token
        generateUserToken(userId, res);

        // Response to the client
        return res.status(200).json({
            _id: userId,
            username,
        });
    } catch (err) {
        console.error(err.message);
        return res.status(400).json(err.message);
    }
}

async function loginUser(req, res) {
    const { username, password } = req.body;
    const sqlLoginUser = "SELECT _id, password FROM users WHERE username = ?";

    try {
        if (!username || !password)
            return res
                .status(400)
                .json({ message: "Όλα τα στοιχεία πρέπει να συμπληρωθούν" });

        //Check is the user exists
        const existingUser = await getQuery(sqlLoginUser, [username]);

        if (!existingUser)
            return res.status(400).json({
                message: "Λανθασμένα στοιχεία σύνδεσης",
            });

        // Compare the password that the user gave with the one stored in the db
        const isPasswordValid = await bcrypt.compare(
            password,
            existingUser.password,
        );

        if (!isPasswordValid) throw new Error("Invalid Credentials");

        // JWT Token
        generateUserToken(existingUser._id, res);

        // Response to the client
        return res.status(200).json({
            _id: existingUser._id,
            username,
        });
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
}

async function logOut(req, res) {
    try {
        res.clearCookie("user_token");
        return res.status(200).json("User logged out successfully");
    } catch (err) {
        console.error(err.message);
        return res.status(400).json(err.message);
    }
}

async function addProductToCart(req, res) {
    const { id } = req.body;
    try {
        if (!id) throw new Error("Product does not exist!");

        // Get users cart
        const userId = req.user_id;
        const sqlGetUsersCart = "SELECT * FROM cart WHERE user_id = ?";
        const userCart = await getQuery(sqlGetUsersCart, [userId]);

        // Check if the item already exists on the users cart
        let existingItem;
        const sqlCheckExistingItem =
            "SELECT * FROM cart_items WHERE cart_id = ? AND product_id = ?";
        existingItem = await getQuery(sqlCheckExistingItem, [userCart._id, id]);

        // Get the product
        const sqlFindProduct = "SELECT * FROM products WHERE _id = ?";
        const product = await getQuery(sqlFindProduct, [id]);

        // Add the product
        const itemId = randomUUID();

        if (existingItem) {
            const sqlUpdateQuantity =
                "UPDATE cart_items SET quantity = quantity + 1 WHERE _id = ?";
            await runQuery(sqlUpdateQuantity, [existingItem._id]);
        } else {
            const sqlAddProductToCartItems =
                "INSERT INTO cart_items(_id, cart_id, product_id, product_image, quantity) VALUES(?, ?, ?, ?,?)";
            await runQuery(sqlAddProductToCartItems, [
                itemId,
                userCart._id,
                product._id,
                product.product_image,
                1,
            ]);
        }

        return res.status(200).json("Product was added successfully!");
    } catch (err) {
        console.error(err.message);
        return res.status(400).json(err.message);
    }
}

async function getCart(req, res) {
    const userId = req.user_id;
    const sqlGetUsersCart = "SELECT * FROM cart WHERE user_id = ?";
    try {
        if (!userId) return res.status(400).json({ message: "Unauthorized" });

        // Get the users cart
        const cart = await getQuery(sqlGetUsersCart, [userId]);

        if (!cart) throw new Error("cart not found!");

        // Get cart products with JOIN
        const sqlGetCartProducts = `
            SELECT 
                p._id AS product_id,
                p.product_name,
                p.price,
                p.shop_id,
                p.product_image,
                ci.quantity
            FROM cart_items ci
            JOIN products p ON p._id = ci.product_id
            WHERE ci.cart_id = ?
        `;

        const products = await getQueryAll(sqlGetCartProducts, [cart._id]);
        return res.status(200).json(products);
    } catch (err) {
        console.error(err.message);
        return res.status(400).json(err.message);
    }
}

async function deleteProductFromCart(req, res) {
    const { id } = req.body;
    const userId = req.user_id;
    try {
        // Get the cart by the userid
        const sqlGetUsersCart = "SELECT * FROM cart WHERE user_id = ? ";
        const cart = await getQuery(sqlGetUsersCart, [userId]);

        // Get the product
        const sqlDeleteProductFromCart =
            "DELETE FROM cart_items WHERE cart_id = ? AND product_id = ?";
        const product = await runQuery(sqlDeleteProductFromCart, [
            cart._id,
            id,
        ]);

        return res.status(200).json("The product was deleted succussfully!");
    } catch (err) {
        console.error(err.message);
        return res.status(400).json(err.message);
    }
}

async function getLoggedInUser(req, res) {
    const sqlGetLoggedInUser =
        "SELECT _id, username, email FROM users WHERE _id = ?";
    const userId = req.user_id;
    try {
        const user = await getQuery(sqlGetLoggedInUser, [userId]);

        if (!user) throw new Error("No user");

        return res.status(200).json(user);
    } catch (err) {
        console.error(err.message);
        return res.status(400).json(err.message);
    }
}

// async function completeOrder(req, res) {
//     const { id } = req.body;
//     const userId = req.user_id;

//     try {
//         // Get the cart by the id
//         const sqlGetUsersCart =
//             "SELECT * FROM cart WHERE _id = ? AND user_id ?";
//         const cart = await getQuery(sqlGetUsersCart, [id, userId]);

//         console.log(cart);
//     } catch (err) {
//         console.error(err.message);
//         return res.status(400).json(err.message);
//     }
// }

export {
    signUpUser,
    loginUser,
    logOut,
    addProductToCart,
    getCart,
    deleteProductFromCart,
    getLoggedInUser,
};
