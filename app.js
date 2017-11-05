var express = require("express");
var expressSession = require('express-session');
var bodyParser = require("body-parser");
var sqlite3 = require('sqlite3').verbose();
var crypto = require('crypto');
var passport = require('passport');
//var cookieParser = require('cookie-parser');
var LocalStrategy = require('passport-local').Strategy;

// Project files
var queries = require('./database/queries');


// Route files
var indexRoutes = require("./routes/index");
var authRoutes = require('./routes/auth');

// Opens existing database or creates a new one if timesheets.db does not exist
var db = new sqlite3.Database('./database/timesheets.db',(err) => {
    if (err) console.log('Cannot connect to database: ' + err.message);
    console.log('Connected to database');
});

// Initialises tables if needed in the new db connection
queries.init(db);

/*
// Employees, can be management, Password is a sha256 hash of the users password,
// Salt is given for this users password to hash with, Management is a boolean
db.run('CREATE TABLE IF NOT EXISTS Employees(ID INTEGER PRIMARY KEY AUTOINCREMENT, Name TEXT, Email UNIQUE TEXT, Password TEXT, Management INTEGER, Salt TEXT)');
// All the tasks employees declare
db.run('CREATE TABLE IF NOT EXISTS Tasks(ID INTEGER PRIMARY KEY, Name TEXT, PONumber INTEGER)');
// Each days hours worked and on which project, Billable is a boolean (0 is false)
db.run(`CREATE TABLE IF NOT EXISTS Hours(
    EmployeeID INTEGER, TaskID INTEGER, Date TEXT, Hours INTEGER, Billable INTEGER,
FOREIGN KEY(EmployeeID) REFERENCES Employee(ID), 
FOREIGN KEY(TaskID) REFERENCES Tasks(ID)
PRIMARY KEY(EmployeeID, TaskID))`); */

// Object to be used for routing
var app = express();

// Middleware
// Using body-parser to access post request data
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSession({secret: 'anW*2pGDi%$ad3tG', resave: false, saveUninitialized: false}));

// Sets the views used to ejs templating
app.set('view engine', 'ejs');

// Capturing the routes from route files
app.use(indexRoutes);
app.use(authRoutes);
//FUTURE USE: app.use("/timesheet", timesheetRoutes);
//This adds /timesheet to the start of all routes
//exported from the file

// Hashes password using salt generated by crypto
var hashPassword = (pass, salt) => {
    var hash = crypto.createHash('sha256');
    hash.update(pass);
    hash.update(salt);
    return hash.digest('hex');
};

// Strategy used by passport, defines authentication of a username and password
passport.use(new LocalStrategy({usernameField: 'email'},(email, password, done) => {
    db.get('SELECT Salt FROM Employees WHERE Email = ?', email, (err, row) => {
	// No username in records, return no record
	if(!row) return done(null, false, {message: "Incorrect details"});
	var hash = hashPassword(password, row.Salt);
	db.get('SELECT ID, Email, Name, Management FROM Employees WHERE Email = ? AND  Password = ?',
	       email, hash, (err, row) => {
		   // Password does not match, return no record
		   if (!row) return done(null, false, {message: "Incorrect details"});
		   return done(null, row);
	       });
    });
}));

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

// Listens on the port provided, accepting requests
app.listen(3000, function() {
    console.log("Listening on port 3000");
});

// Called on exit to close database
var exitHandler = () => {
    db.close((err) => { if(err) console.log('Cannot connect to database: ' + err.message); });
    console.log("\nClosing database");
};

// For Ctrl+C exits
process.on('SIGINT', exitHandler);
// For exit exits
process.on('exit', exitHandler);

