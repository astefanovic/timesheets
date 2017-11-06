var util = require("../lib/utilities.js");
var LocalStrategy = require('passport-local').Strategy;

module.exports = function(passport) {
    // Strategy used by passport, defines authentication of a username and password
    passport.use
    ('local-login', new LocalStrategy({usernameField: 'email'},(email, password, done) => {
	db.get('SELECT Salt FROM Employees WHERE Email = ?', email, (err, row) => {
	    // No username in records, return no record
	    if(!row) return done(null, false, {message: "Incorrect details"});
	    var hash = util.hashPassword(password, row.Salt);
	    db.get('SELECT ID, Email, Name, Management FROM Employees WHERE Email = ? AND  Password = ?',
		   email, hash, (err, row) => {
		       // Password does not match, return no record
		       if (!row) return done(null, false, {message: "Incorrect details"});
		       return done(null, row);
		   });
	});
    }));

    passport.use
    ('local-register',
     new LocalStrategy({usernameField: 'email'}, (name, email, password, done) => {
	 console.log("REGISTERING");
	 var ret = util.createEmployee(name, email, password, 0, db);
	 if(!ret.row) {
	     console.log(err.message);
	     return done(null, {message: "Email already registered"});
	 }
	 return done(null, row);
     })
    );


    // To add employee id to session
    passport.serializeUser(function(employee, done) {
	return done(null, employee.id);
    });

    // Returns the details of the employee with the it given
    passport.deserializeUser(function(id, done) {
	db.get('SELECT ID, Email, Name, Management FROM Employees WHERE ID = ?', id, function(err, row) {
	    if (!row) return done(null, {message: "Incorrect Employee ID"});
	    return done(null, row);
	});
    });
};
