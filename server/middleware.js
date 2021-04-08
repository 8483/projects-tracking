const util = require("util");
const config = require("./config");


let databaseHandler = (pool) => {
    console.log("database middleware");

    return (req, res, next) => {
        // Get a connection from the main pool in app.js
        pool.getConnection((err, conn) => {
            if (err) {
                console.log("DATABASE MIDDLEWARE ERROR", err);
                return;
            }

            // Promisify for Node.js async/await.
            const asyncQuery = util.promisify(conn.query).bind(conn);

            // Pass the modified query method down the chain as a property of req, avaiable via next()
            // req.query is used for queryStrings, so we use asyncQuery to avoid overwriting it
            // connection.release() is called in the routes
            req.asyncQuery = asyncQuery;
            req.connection = conn;

            next();
        });
    };
};

// let accessHandler = (req, res, next) => {
//     console.log("accessHandler", req.userId, req.method, req.url);
//     next();
// };

module.exports = {
    databaseHandler,
    // accessHandler
};
