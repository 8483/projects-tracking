const express = require("express");
const router = express.Router();

router.get("/api/developers/", async function (req, res, next) {
    try {
        let query = `
            select 
                d.*,
                dp.name position,
                ds.name seniority
            from developer d
                left join developerPosition dp on dp.id = developerPositionId
                left join developerSeniority ds on ds.id = developerSeniorityId
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

module.exports = router;
