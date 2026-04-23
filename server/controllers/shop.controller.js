import { randomUUID } from "crypto";
import { generateShopToken } from "../utils/jwt.js";
import { getQuery, runQuery, getQueryAll } from "../utils/promisesWrapper.js";
import { v2 as cloudinary } from "cloudinary";
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

        res.status(201).json({ _id: id, shop_name });
    } catch (err) {
        console.error(err.message);
        return res.status(400).json(err.message);
    }
}

async function loginShop(req, res) {
    const { shop_name, password } = req.body;
    const sqlLoginShop =
        "SELECT _id, shop_name, shop_category, shop_logo ,shop_banner, shop_opening_hours, shop_closing_hours, password FROM shops WHERE shop_name = ? OR email = ?";
    try {
        if (!shop_name || !password)
            return res
                .status(400)
                .json({ message: "Όλα τα στοιχεία πρέπει να συμπληρωθούν" });

        const existingShop = await getQuery(sqlLoginShop, [shop_name]);
        if (!existingShop)
            return res
                .status(400)
                .json({ message: "Λανθασμένα στοιχεία σύνδεσης" });

        const isPasswordValid = await bcrypt.compare(
            password,
            existingShop.password,
        );

        if (!isPasswordValid)
            return res
                .status(400)
                .json({ message: "Λανθασμένα στοιχεία σύνδεσης" });

        generateShopToken(existingShop._id, res);

        const { password: _, ...shopData } = existingShop;

        return res.status(200).json({ ...shopData });
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
    const sqlGetAllShops =
        "SELECT _id, shop_name, shop_category, shop_logo ,shop_banner, shop_opening_hours, shop_closing_hours from shops";
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
    const sqlGetSingleShop =
        "SELECT _id, shop_name, shop_category, shop_banner, shop_opening_hours, shop_closing_hours,shop_logo FROM shops WHERE _id = ?";
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

async function getLoggedInShopProducts(req, res) {
    const id = req.shop_id;
    const sqlGetLoggedInShopProducts =
        "SELECT * FROM products WHERE shop_id = ?";
    try {
        const shopProducts = await getQueryAll(sqlGetLoggedInShopProducts, [
            id,
        ]);
        if (!shopProducts) throw new Error("This shop has no products!");

        return res.status(200).json(shopProducts);
    } catch (error) {
        console.error(err.message);
        return res.status(400).json(err.message);
    }
}

async function addNewProduct(req, res) {
    const { product_name, price, product_description, product_image } =
        req.body;
    const shopId = req.shop_id;
    const sqlAddNewProduct =
        "INSERT INTO products(_id, product_name, price, shop_id, product_description, product_image) VALUES(?,?, ?, ?, ?, ?)";
    try {
        const id = randomUUID();

        if (!product_name || !price)
            throw new Error("All fields must be filled!");

        let uploadImageResponse = null;
        if (product_image) {
            uploadImageResponse =
                await cloudinary.uploader.upload(product_image);
        }

        await runQuery(sqlAddNewProduct, [
            id,
            product_name,
            price,
            shopId,
            product_description,
            uploadImageResponse?.secure_url,
        ]);

        return res.status(201).json({
            product_name,
            price,
            shopId,
            product_image,
            product_description,
            _id: id,
        });
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
    const { id } = req.body;
    const shop_id = req.shop_id;
    const sqlSelectProduct =
        "SELECT * FROM products WHERE _id = ? AND shop_id = ?";
    const sqlDeleteProduct =
        "DELETE FROM products WHERE _id = ? AND shop_id = ?";
    try {
        const product = await getQuery(sqlSelectProduct, [id, shop_id]);

        if (!product)
            return res
                .status(400)
                .json({ message: "The product does not exist!" });

        await runQuery(sqlDeleteProduct, [id, shop_id]);

        return res.status(200).json("Product was deleted successfully");
    } catch (err) {
        console.error(err.message);
        return res.status(400).json(err.message);
    }
}

async function getLoggedInShop(req, res) {
    const shopId = req.shop_id;
    const sqlGetLoggedInShop =
        "SELECT _id, shop_name, email, shop_logo, shop_banner, shop_opening_hours, shop_closing_hours, shop_category from shops where _id = ?";
    try {
        const shop = await getQuery(sqlGetLoggedInShop, [shopId]);

        if (!shop) throw new Error("No shop");
        return res.status(200).json(shop);
    } catch (err) {
        console.error(err.message);
    }
}

async function editShopInformation(req, res) {
    const { openingHours, closingHours, category, shop_banner, shop_logo } =
        req.body;
    const shop_id = req.shop_id;
    const sqlGetLoggedInStore = "SELECT _id from shops WHERE _id = ?";
    try {
        const shop = await getQuery(sqlGetLoggedInStore, [shop_id]);

        if (!shop) throw new Error("No shop logged in");

        if (openingHours) {
            await runQuery(
                "UPDATE shops SET shop_opening_hours = ? WHERE _id = ?",
                [openingHours, shop_id],
            );
        }

        if (closingHours) {
            await runQuery(
                "UPDATE shops SET shop_closing_hours = ? WHERE _id = ?",
                [closingHours, shop_id],
            );
        }

        const sqlEditShopCategory =
            "UPDATE shops SET shop_category = ? WHERE _id = ?";

        if (category) {
            await runQuery(sqlEditShopCategory, [category, shop_id]);
        }

        const sqlEditShopBannerImage =
            "UPDATE shops SET shop_banner = ? WHERE _id = ?";

        if (shop_banner) {
            const uploadImageResponse =
                await cloudinary.uploader.upload(shop_banner);
            await runQuery(sqlEditShopBannerImage, [
                uploadImageResponse.secure_url,
                shop_id,
            ]);
        }

        const sqlEditShopLogoImage =
            "UPDATE shops SET shop_logo = ? WHERE _id = ?";

        if (shop_logo) {
            const uploadImageResponse =
                await cloudinary.uploader.upload(shop_logo);
            await runQuery(sqlEditShopLogoImage, [
                uploadImageResponse.secure_url,
                shop_id,
            ]);
        }

        return res.status(200).json("shop was updated");
    } catch (err) {
        console.error(err.message);
        return res.status(400).json(err.message);
    }
}

async function getShopOrders(req, res) {
    const shop_id = req.shop_id;
    try {
        const sqlGetShopOrders = `SELECT DISTINCT o.*
                            FROM orders o
                            JOIN order_items oi ON oi.order_id = o._id
                            JOIN products p ON p._id = oi.product_id
                            WHERE p.shop_id = ? AND status='active'`;

        const orders = await getQueryAll(sqlGetShopOrders, [shop_id]);

        const sqlGetOrdersProducts = `SELECT * FROM order_items WHERE order_id = ?`;
        const sqlGetOrdersCustomer = `SELECT username FROM users WHERE _id = ?`;
        let order_items;
        let order_customer;
        for (let i = 0; i < orders.length; i++) {
            order_items = await getQueryAll(sqlGetOrdersProducts, [
                orders[i]._id,
            ]);

            order_customer = await getQuery(sqlGetOrdersCustomer, [
                orders[i].user_id,
            ]);

            orders[i].items = order_items;
            orders[i].customer_name = order_customer.username;
        }

        return res.status(200).json({ orders });
    } catch (err) {
        console.error(err.message);
        return res.status(400).json(err.message);
    }
}

async function editOrderStatus(req, res) {
    const { order_id } = req.body;
    const shop_id = req.shop_id;
    try {
        const sqlUpdateOrderStatus =
            "UPDATE orders SET status = 'complete' where _id = ?";

        await runQuery(sqlUpdateOrderStatus, [order_id]);

        return res.status(200).json({ message: "complete" });
    } catch (err) {
        console.error(err.message);
        return res.status(400).json(err.message);
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
    getLoggedInShopProducts,
    editShopInformation,
    getShopOrders,
    editOrderStatus,
};
