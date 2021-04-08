const express = require("express");
const cors = require("cors");
const middleware = require("./middleware.js");

// A tiny, accurate, fast Express middleware for single page apps with client side routing.
const history = require("connect-history-api-fallback");

const mysql = require("mysql");
const config = require("./config");

let projects = require("./api/projects");
let developers = require("./api/developers");

let app = express();

app.use(
    cors({
        credentials: true,
        origin: "http://localhost:3000",
    })
);

let pool = mysql.createPool(config.db);

app.all("/api/*", middleware.databaseHandler(pool));

app
    // Allows API calls i.e. bypass client side routing
    .use(
        history({
            rewrites: [
                {
                    from: /^\/api\/.*$/,
                    to: function (context) {
                        return context.parsedUrl.path;
                    },
                },
            ],
        })
    )
    .use(express.static(`../public`))
    .use(express.json())

    .use(projects)
    .use(developers);

module.exports = app;
