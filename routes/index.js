var express = require("express");

// Router to declare the routes and export at the end
var router = express.Router();

router.get("/", function(req, res) {
    res.render("timesheets", { user: req.user });
});

module.exports = router;
