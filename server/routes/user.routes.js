import express from "express";
import {
    signUpUser,
    loginUser,
    logOut,
    addProductToCart,
    getCart,
    deleteProductFromCart,
    getLoggedInUser,
} from "../controllers/user.controller.js";
import verifyUserToken from "../middleware/verifyUserToken.js";
import { deleteProduct } from "../controllers/shop.controller.js";

const userRouter = express.Router();

userRouter.post("/signup", signUpUser);
userRouter.post("/login", loginUser);
userRouter.post("/logout", logOut);
userRouter.post("/add_cart", verifyUserToken, addProductToCart);
userRouter.get("/get_cart", verifyUserToken, getCart);
userRouter.delete("/delete_item", verifyUserToken, deleteProductFromCart);
userRouter.get("/me", verifyUserToken, getLoggedInUser);

export default userRouter;
