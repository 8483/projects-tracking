const express = require("express");
const router = express.Router();

router.get("/api/projects/", async function (req, res, next) {
    try {
        let query = `
            select * from project
            ;
        `;

        var rows = await req.asyncQuery(query);
        res.status(200).send(rows);
    } catch (err) {
        next(err);
    } finally {
        req.connection.release();
    }
});

router.get("/api/projects/:projectId", async function (req, res, next) {
    try {
        let projectId = req.params.projectId;

        let query = `
            select * from project
            where id = ?
            ;
        `;

        var rows = await req.asyncQuery(query, [projectId]);
        res.status(200).send(rows[0]);
    } catch (err) {
        next(err);
    } finally {
        req.connection.release();
    }
});

router.get("/api/projects/:projectId/developers", async function (req, res, next) {
    try {
        let projectId = req.params.projectId;

        let query = `
            select 
                d.*,
                dp.name position,
                ds.name seniority
            from projectDeveloperMapping pdm
                left join developer d on d.id = pdm.developerId
                left join developerPosition dp on dp.id = developerPositionId
                left join developerSeniority ds on ds.id = developerSeniorityId
            where projectId = ?;
            ;
        `;

        var rows = await req.asyncQuery(query, [projectId]);
        res.status(200).send(rows);
    } catch (err) {
        next(err);
    } finally {
        req.connection.release();
    }
});

router.post("/api/projects/:projectId/developers/:developerId", async function (req, res, next) {
    try {
        let projectId = req.params.projectId;
        let developerId = req.params.developerId;

        let query = `
            insert into projectDeveloperMapping
                (projectId, developerId)
            values
                (?, ?)
            ;
        `;

        var rows = await req.asyncQuery(query, [projectId, developerId]);
        res.status(200).send(rows);
    } catch (err) {
        next(err);
    } finally {
        req.connection.release();
    }
});

router.delete("/api/projects/:projectId/developers/:developerId", async function (req, res, next) {
    try {
        let projectId = req.params.projectId;
        let developerId = req.params.developerId;

        let query = `
            delete
            from projectDeveloperMapping
            where projectId = ? and developerId = ?;
            ;
        `;

        var rows = await req.asyncQuery(query, [projectId, developerId]);
        res.status(200).send(rows);
    } catch (err) {
        next(err);
    } finally {
        req.connection.release();
    }
});

module.exports = router;
