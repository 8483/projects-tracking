# Stack

-   Frontend: Svelte
-   Backend: Node
-   Database: MySQL

# 1. Database credentials

Change the default ones with your own...

```js
// /server/config.js

module.exports = {
    db: {
        connectionLimit: 100,
        server: "localhost",
        database: "oneInside",
        user: "root",
        password: "",
        multipleStatements: true,
        dateStrings: true,
    },
};
```

# 2. Build the database

Create and populate the database in `/server/database`

```
node build.js
```

# 3. Install app and server dependencies

```bash
# run in both /app and /server directories
npm i
```

# 4. Run the server

```bash
# run from the server directory
nodemon server.js
```
