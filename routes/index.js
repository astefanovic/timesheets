var express = require("express");

// Router to declare the routes and export at the end
var router = express.Router();

console.log("Routing");
router.get("/", function(req, res){
    console.log("Will not print");
    res.render("timesheets", {user: "test"});
});

module.exports = router;
