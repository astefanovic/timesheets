var express = require("express");
// Router to declare the routes and export at the end
var router = express.Router();

router.get("/", function(req, res) {
    res.send("Homepage");
});

module.exports = router;
