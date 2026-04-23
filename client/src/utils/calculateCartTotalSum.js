import formatMoney from "./formatMoney.js";

export default function calculateCartTotalSum(cart) {
    let totalSum = 0;
    for (let i = 0; i < cart.length; i++) {
        totalSum += cart[i].price * cart[i].quantity;
    }

    return formatMoney(totalSum);
}
