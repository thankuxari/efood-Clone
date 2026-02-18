import { randomUUID } from "crypto";
import { generateShopToken } from "../utils/jwt.js";
import { getQuery, runQuery, getQueryAll } from "../utils/promisesWrapper.js";
import bcrypt from "bcrypt";

async function signUpShop(req, res) {
    const { shop_name, email, password } = req.body;
    const sqlSignUpShop =
        "INSERT INTO shops(_id, shop_name, email, password) VALUES(?, ?, ?, ?)";
    const sqlExistingShop =
        "SELECT * FROM shops WHERE shop_name = ? OR email = ?";
    try {
        if (!shop_name || !email || !password)
            throw new Error("All fields must be filled");

        const existingShop = await getQuery(sqlExistingShop, [
            shop_name,
            email,
        ]);

        if (existingShop)
            throw new Error("Shop with these informations already exists");

        const SALT_ROUNDS = Number(process.env.SALT_ROUNDS) || 8;
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        const id = randomUUID();

        const shop = await runQuery(sqlSignUpShop, [
            id,
            shop_name,
            email,
            hashedPassword,
        ]);

        generateShopToken(id, res);

        res.status(201).json(`Shop created successfully! Welcome ${shop_name}`);
    } catch (err) {
        console.error(err.message);
        return res.status(400).json(err.message);
    }
}

async function loginShop(req, res) {
    const { shop_name, password } = req.body;
    const sqlLoginShop =
        "SELECT _id, password FROM shops WHERE shop_name = ? OR email = ?";
    try {
        if (!shop_name || !password)
            throw new Error("All fields must be filled!");

        const existingShop = await getQuery(sqlLoginShop, [shop_name]);
        if (!existingShop)
            throw new Error("No shop with these credentials exist");

        const isPasswordValid = await bcrypt.compare(
            password,
            existingShop.password,
        );

        if (!isPasswordValid) throw new Error("Invalid Credentials");

        generateShopToken(existingShop._id, res);

        return res.status(200).json({ _id: existingShop._id, shop_name });
    } catch (err) {
        console.error(err.message);
        return res.status(400).json(err.message);
    }
}

async function logOut(req, res) {
    try {
        res.clearCookie("shop_token");
        return res.status(200).json("User logged out successfully");
    } catch (err) {
        console.error(err.message);
        return res.status(400).json(err.message);
    }
}

async function getAllShops(req, res) {
    const sqlGetAllShops = "SELECT _id, shop_name from shops";
    try {
        const shops = await getQueryAll(sqlGetAllShops);

        if (!shops) throw new Error("There are no shops to show here!");

        return res.status(200).json(shops);
    } catch (err) {
        console.error(err.message);
        return res.status(400).json(err.message);
    }
}

async function getSingleShop(req, res) {
    const { id } = req.params;
    const sqlGetSingleShop = "SELECT * FROM shops WHERE _id = ?";
    const sqlGetSingleShopProducts = "SELECT * FROM products WHERE shop_id = ?";

    try {
        const shopInfo = await getQuery(sqlGetSingleShop, [id]);
        const shopProducts = await getQueryAll(sqlGetSingleShopProducts, [id]);
        return res.status(200).json({ shopInfo, shopProducts });
    } catch (err) {
        console.error(err.message);
        return res.status(400).json(err.message);
    }
}

async function addNewProduct(req, res) {
    const { product_name, price } = req.body;
    const shopId = req.shop_id;
    const sqlAddNewProduct =
        "INSERT INTO products(product_name, price, shop_id) VALUES(?, ?, ?)";
    try {
        if (!product_name || !price)
            throw new Error("All fields must be filled!");

        await runQuery(sqlAddNewProduct, [product_name, price, shopId]);

        return res.status(201).json(`New product ${product_name} was added`);
    } catch (err) {
        console.error(err.message);
        return res.status(400).json("");
    }
}

async function editProduct(req, res) {
    const { id } = req.params;
    const { product_name, price } = req.body;
    const shop_id = req.shop_id;
    const sqlSelectProduct =
        "SELECT * FROM products WHERE _id = ? AND shop_id = ?";
    const sqlEditProduct =
        "UPDATE products SET product_name = ?, price = ? WHERE _id = ? AND shop_id = ? ";
    try {
        if (!product_name || !price) throw new Error("All fields so be filled");

        const product = await getQuery(sqlSelectProduct, [id, shop_id]);

        if (!product) throw new Error("The product does not exist!");

        await runQuery(sqlEditProduct, [product_name, price, id, shop_id]);

        return res.status(200).json("Product was update succussfully");
    } catch (err) {
        console.error(err.message);
        return res.status(400).json(err.message);
    }
}

async function deleteProduct(req, res) {
    const { id } = req.params;
    const shop_id = req.shop_id;
    const sqlSelectProduct =
        "SELECT * FROM products WHERE _id = ? AND shop_id = ?";
    const sqlDeleteProduct =
        "DELETE FROM products WHERE _id = ? AND shop_id = ?";
    try {
        const product = await getQuery(sqlSelectProduct, [id, shop_id]);

        if (!product) throw new Error("The product does not exist!");

        await runQuery(sqlDeleteProduct, [id, shop_id]);

        return res.status(200).json("Product was deleted successfully");
    } catch (err) {
        console.error(err.message);
        return res.status(400).json(err.message);
    }
}

async function getLoggedInShop(req, res) {
    const shopId = req.shop_id;
    const sqlGetLoggedInShop = "SELECT * from shops where shop_id = ?";
    try {
        const shop = await getQuery(sqlGetLoggedInShop, [shopId]);

        if (!shop) throw new Error("No shop");

        return res.status(200).json(shop);
    } catch (err) {
        console.error(err.message);
    }
}

export {
    signUpShop,
    loginShop,
    logOut,
    getAllShops,
    addNewProduct,
    getSingleShop,
    deleteProduct,
    editProduct,
    getLoggedInShop,
};
