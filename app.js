var express = require("express");
var bodyParser = require("body-parser");

// Route files
var indexRoutes = require("./routes/index");

// Object to be used for routing
var app = express();

// Using body-parser to access post request data
app.use(bodyParser.urlencoded({extended: true}));

// Sets the views used to ejs templating
app.set('view engine', 'ejs');

// Capturing the routes from route files
app.use(indexRoutes);
//FUTURE USE: app.use("/timesheet", timesheetRoutes);
//This adds /timesheet to the start of all routes
//exported from the file

// Listens on the port provided, accepting requests
app.listen(3000, function() {
    console.log("timesheets: Listening on port 3000");
});
