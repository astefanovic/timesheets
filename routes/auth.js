//var express = require("express");
var util = require("../lib/utilities.js");

// Router to declare the routes and export at the end
//var router = express.Router();
module.exports = (app, passport) => {
    
    app.get("/login", (req, res) => {
	res.render("timesheets", { user: req });
    });

    app.get("/register", (req, res) => {
	res.render("auth/register");
    });

    app.post("/register", passport.authenticate('local-register', {
	successRedirect: '/',
	failureRedirect: '/register'
	//if(util.createEmployee(req.body.name, req.body.email, req.body.password, 0, db))
	//	console.log(;
    }));
};

//module.exports = router;
