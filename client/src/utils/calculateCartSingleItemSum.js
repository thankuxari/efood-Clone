import formatMoney from "./formatMoney.js";

export default function calculateCartSingleItemSum(cartItem) {
    let totalSum = +cartItem.price * cartItem.quantity;
    return formatMoney(totalSum);
}
