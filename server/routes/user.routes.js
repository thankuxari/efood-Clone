import express from "express";
import {
    signUpUser,
    loginUser,
    logOut,
    addProductToCart,
    getCart,
    deleteProductFromCart,
    getLoggedInUser,
    completeOrder,
    searchForShops,
} from "../controllers/user.controller.js";
import verifyUserToken from "../middleware/verifyUserToken.js";

const userRouter = express.Router();

userRouter.post("/signup", signUpUser);
userRouter.post("/login", loginUser);
userRouter.post("/logout", logOut);
userRouter.post("/add_cart", verifyUserToken, addProductToCart);
userRouter.get("/get_cart", verifyUserToken, getCart);
userRouter.delete("/delete_item", verifyUserToken, deleteProductFromCart);
userRouter.post("/complete_order", verifyUserToken, completeOrder);
userRouter.post("/search", verifyUserToken, searchForShops);
userRouter.get("/me", verifyUserToken, getLoggedInUser);

export default userRouter;
