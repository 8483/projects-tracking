const { db } = require("../config.js");

const mysql = require("mysql");
let util = require("util");

console.log(db);

// used for db.database creation
let poolOnce = mysql.createPool({
    connectionLimit: 100,
    server: "localhost",
    user: db.user,
    password: db.password,
    multipleStatements: true,
    dateStrings: true,
});
poolOnce.query = util.promisify(poolOnce.query);

// used for table creation
let pool = mysql.createPool(db);
pool.query = util.promisify(pool.query);

function getRandomNonZeroNumber(max) {
    return Math.floor(Math.random() * max) + 1;
}

async function build() {
    try {
        // INIT ===========================================================================

        await poolOnce.query(`
            DROP DATABASE IF EXISTS ${db.database};
        `);

        console.log(`DELETED DATABASE: ${db.database}`);

        await poolOnce.query(`
            CREATE DATABASE ${db.database};
            USE ${db.database};
        `);
        console.log(`CREATED DATABASE: ${db.database}`);
        console.log(`-----------------`);

        // TABLES ===========================================================================

        await pool.query(`
            CREATE TABLE technology (
                id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,

                name VARCHAR(255)
            );
        `);
        console.log("CREATED TABLE: technology");

        await pool.query(`
            CREATE TABLE developerPosition (
                id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,

                name VARCHAR(255)
            );
        `);
        console.log("CREATED TABLE: developerPosition");

        await pool.query(`
            CREATE TABLE developerSeniority (
                id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,

                name VARCHAR(255)
            );
        `);
        console.log("CREATED TABLE: developerSeniority");

        await pool.query(`
            CREATE TABLE developer (
                id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,

                name VARCHAR(255),
                yearStart INT,

                developerPositionId INT,
                FOREIGN KEY (developerPositionId) REFERENCES developerPosition(id) ON DELETE CASCADE,

                developerSeniorityId INT,
                FOREIGN KEY (developerSeniorityId) REFERENCES developerSeniority(id) ON DELETE CASCADE
            );
        `);
        console.log("CREATED TABLE: developer");

        await pool.query(`
            CREATE TABLE project (
                id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,

                name VARCHAR(255),
                description VARCHAR(255),

                frontEndTechnologyId INT,
                FOREIGN KEY (frontEndTechnologyId) REFERENCES technology(id) ON DELETE CASCADE,

                backendTechnologyId INT,
                FOREIGN KEY (backendTechnologyId) REFERENCES technology(id) ON DELETE CASCADE,

                budget DECIMAL(50, 2),

                startDate DATE,
                endDate DATE
            );
        `);
        console.log("CREATED TABLE: project");

        await pool.query(`
            CREATE TABLE projectDeveloperMapping (
                id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,

                projectId INT,
                FOREIGN KEY (projectId) REFERENCES project(id) ON DELETE CASCADE,

                developerId INT,
                FOREIGN KEY (developerId) REFERENCES developer(id) ON DELETE CASCADE
            );
        `);
        console.log("CREATED TABLE: project");

        // SEED ===========================================================================

        await pool.query(`
            INSERT INTO technology (name)
            VALUES 
                ('Java'),
                ('.NET'),
                ('Javascript'),
                ('Python'),
                ('Dark Magic')
            ;
        `);
        console.log("SEED: technology");

        await pool.query(`
            INSERT INTO developerPosition (name)
            VALUES 
                ('frontend'),
                ('backend')
            ;
        `);
        console.log("SEED: developerPosition");

        await pool.query(`
            INSERT INTO developerSeniority (name)
            VALUES 
                ('apprentice'),
                ('junior'),
                ('mid'),
                ('senior'),
                ('architect'),
                ('consultant')
            ;
        `);
        console.log("SEED: developerSeniority");

        for (let i = 0; i < 100; i++) {
            await pool.query(`
                    INSERT INTO developer (
                        name,
                        yearStart,
                        developerPositionId,
                        developerSeniorityId
                    )
                    VALUES 
                        ('developer ${i + 1}', ${2000 + getRandomNonZeroNumber(20)}, ${getRandomNonZeroNumber(2)}, ${getRandomNonZeroNumber(6)})
                    ;
            `);
        }
        console.log("SEED: developer");

        for (let i = 0; i < 100; i++) {
            await pool.query(`
                INSERT INTO project (
                    name,
                    description,
                    frontEndTechnologyId,
                    backendTechnologyId,
                    budget,
                    startDate,
                    endDate
                )
                VALUES 
                    (
                        'project ${i + 1}', 
                        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.', 
                        ${getRandomNonZeroNumber(5)}, 
                        ${getRandomNonZeroNumber(5)}, 
                        ${100000 + getRandomNonZeroNumber(100000)}, 
                        now(), 
                        now()
                    )
                ;
            `);
        }
        console.log("SEED: project");

        for (let i = 0; i < 100; i++) {
            let projectId = i + 1;
            for (let j = 0; j < 1 + getRandomNonZeroNumber(9); j++) {
                await pool.query(`
                    INSERT INTO projectDeveloperMapping (
                        projectId,
                        developerId
                    )
                    VALUES 
                        (${projectId}, ${getRandomNonZeroNumber(100)})
                    ;
                `);
            }
        }
        console.log("SEED: project");

        console.log(`-----------------`);
        console.log(`DATABASE ${db.database} BUILD DONE!`);
    } catch (err) {
        console.log(err);
    } finally {
        poolOnce.end(function (err) {
            console.log("poolOnce closed");
        });
        pool.end(function (err) {
            console.log("pool closed");
        });
    }
}

build();
