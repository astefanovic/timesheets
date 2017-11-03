var express = require("express");

// Route files
var indexRoutes = require("./routes/index");

// Variable that runs express routing functions
var app = express();

console.log("TEST");

// Home page
app.get("/", function(req, res) {
    res.send("Home Page");
});

// Capturing the routes from route files
app.use(indexRoutes);
//FUTURE USE: app.use("/timesheet", timesheetRoutes);
//This adds /timesheet to the start of all routes
//exported from the file

// Listens on the port provided, accepting requests
app.listen(3000, function() {
    console.log("timesheets: Listening on port 3000");
});
