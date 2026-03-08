import express from "express";
import {
    signUpShop,
    loginShop,
    getAllShops,
    addNewProduct,
    getSingleShop,
    deleteProduct,
    editProduct,
    logOut,
    getLoggedInShop,
    getLoggedInShopProducts,
    editShopInformation,
} from "../controllers/shop.controller.js";
import verifyShopToken from "../middleware/verifyShopToken.js";

const shopRouter = express.Router();

shopRouter.post("/signup", signUpShop);
shopRouter.post("/login", loginShop);
shopRouter.post("/logout", logOut);
shopRouter.get("/", getAllShops);
shopRouter.get("/me", verifyShopToken, getLoggedInShop);
shopRouter.get("/shop_products", verifyShopToken, getLoggedInShopProducts);
shopRouter.get("/:id", getSingleShop);
shopRouter.post("/add_product", verifyShopToken, addNewProduct);
shopRouter.delete("/delete_product", verifyShopToken, deleteProduct);
shopRouter.put("/edit_product/:id", verifyShopToken, editProduct);
shopRouter.put("/edit_shop", verifyShopToken, editShopInformation);

export default shopRouter;
