export default function formatMoney(price) {
    return `${(price / 100).toFixed(2)} €`;
}
