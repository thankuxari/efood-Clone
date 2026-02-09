import sqlite3 from "sqlite3";
sqlite3.verbose();

// Create the DB Object

const DB = new sqlite3.Database(
    "./database.db",
    sqlite3.OPEN_READWRITE || sqlite3.OPEN_CREATE,
    databaseConnection,
);

// Function establishing the connection with the database
function databaseConnection(err) {
    if (err) {
        throw new Error(`Error on database connection 💥 : ${err.message}`);
    }
    console.log("Connection with the database successfull ✅");
}

const sqlUsers = `
    CREATE TABLE IF NOT EXISTS users(
    _id TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
`;

const sqlShops = `
    CREATE TABLE IF NOT EXISTS shops(
    _id TEXT PRIMARY KEY,
    shop_name TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
`;

const sqlProducts = `
    CREATE TABLE IF NOT EXISTS products(
    _id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_name TEXT NOT NULL,
    price REAL NOT NULL,
    shop_id TEXT NOT NULL,
    FOREIGN KEY (shop_id) REFERENCES shops(_id) ON DELETE CASCADE
)
`;

const sqlCart = `
    CREATE TABLE IF NOT EXISTS cart(
    _id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(_id) ON DELETE CASCADE
)
`;

const sqlCartItems = `
    CREATE TABLE IF NOT EXISTS cart_items(
    _id TEXT PRIMARY KEY,
    cart_id TEXT NOT NULL,
    product_id TEXT NOT NULL,
    quantity INTEGER DEFAULT 1,
    FOREIGN KEY (cart_id) REFERENCES cart(_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(_id) ON DELETE CASCADE
)
`;

DB.serialize(() => {
    // FOR THE USERS
    DB.run(sqlUsers, [], (err) => {
        if (err) {
            throw new Error(
                `Error trying to create the table with the users ${err.message}`,
            );
        }
        console.log("The table 'users' was created!");
    });

    // FOR THE SHOPS
    DB.run(sqlShops, [], (err) => {
        if (err) {
            throw new Error(
                `Error trying to create the table with the shops ${err.message}`,
            );
        }
        console.log("The table 'shops' was created");
    });

    // FOR THE PRODUCTS
    DB.run(sqlProducts, [], (err) => {
        if (err) {
            throw new Error(
                `Error trying to create the table with the products ${err.message}`,
            );
        }
        console.log("The table 'products' was created");
    });

    // FOR THE CART
    DB.run(sqlCart, [], (err) => {
        if (err) {
            throw new Error(
                `Error trying to create the table with the cart ${err.message}`,
            );
        }
        console.log("The table 'cart' was created");
    });

    // FOR THE CART ITEMS
    DB.run(sqlCartItems, [], (err) => {
        if (err) {
            throw new Error(
                `Error trying to create the table with the cart_items ${err.message}`,
            );
        }
        console.log("The table 'cart_items' was created");
    });

    DB.run("PRAGMA foreign_keys = ON");
});

export default DB;
