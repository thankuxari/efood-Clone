import DB from "../config/db.js";

function getQuery(sql, params) {
    return new Promise((resolve, reject) => {
        DB.get(sql, params, (err, row) => {
            if (err) return reject(err);
            resolve(row);
        });
    });
}

function getQueryAll(sql, params) {
    return new Promise((resolve, reject) => {
        DB.all(sql, params, (err, rows) => {
            if (err) return reject(err);
            resolve(rows);
        });
    });
}

function runQuery(sql, params) {
    return new Promise((resolve, reject) => {
        DB.run(sql, params, function (err) {
            if (err) return reject(err);
            resolve(this);
        });
    });
}

export { getQuery, runQuery, getQueryAll };
