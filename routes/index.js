var express = require("express");

// Router to declare the routes and export at the end
var router = express.Router();

router.get("/", function(req, res){
    console.log("Will not print");
    res.render("timesheets", {user: user});
/*n
    (err, html) => {
	console.log('Error: ' + err.message + '\nHtml: ' + html);
	});*/
});
module.exports = router;
