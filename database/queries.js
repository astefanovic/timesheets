var util = require('../lib/utilities.js');

// Takes an employees details and creates a record if unique,
// returning the error and record, where error is null if successful
function createEmployee(name, email, password, management, db) {
    var salt = util.getSalt();
    var hash = util.hashPassword(password, salt);
    db.run(`INSERT INTO Employees (Name, Email, Password, Management, Salt)
SELECT ?, ?, ?, ?, ? 
WHERE NOT EXISTS (SELECT * FROM Employees WHERE ID = 1)`,
	   name, email, hash, management, salt,
	   (err, row) => {
	       return {err: err, row: row};
	   }
	  );
}

// Creates the schemas for Employees, Tasks and Hours, if not created already,
// taking in a database object to run the queries on
exports.init = (db) => {
    //Runs the following queries in series, so tables are made before insertion
    db.serialize(() => {
	
	// Employees, can be management, Password is a sha256 hash of the users password,
	// Salt is given for this users password to hash with, Management is a boolean
	db.run('CREATE TABLE IF NOT EXISTS Employees(ID INTEGER PRIMARY KEY AUTOINCREMENT, Name TEXT, Email TEXT UNIQUE, Password TEXT, Management INTEGER, Salt TEXT)');
	
	// All the tasks employees declare
	db.run('CREATE TABLE IF NOT EXISTS Tasks(ID INTEGER PRIMARY KEY AUTOINCREMENT, Name TEXT, PONumber INTEGER)');
	
	// Each days hours worked and on which project, Billable is a boolean (0 is false)
	db.run(`CREATE TABLE IF NOT EXISTS Hours(
    EmployeeID INTEGER, TaskID INTEGER, Date TEXT, Hours INTEGER, Billable INTEGER,
FOREIGN KEY(EmployeeID) REFERENCES Employee(ID), 
FOREIGN KEY(TaskID) REFERENCES Tasks(ID)
PRIMARY KEY(EmployeeID, TaskID))`);

	// Add the admin account to the new tables
	/*
	var salt = util.getSalt();
	var hash = util.hashPassword('admin', salt);
	db.run(`INSERT INTO Employees (Name, Email, Password, Management, Salt)
SELECT 'admin', 'admin', ?, 0, ? 
WHERE NOT EXISTS (SELECT * FROM Employees WHERE ID = 1)`, hash, salt); */
	createEmployee('admin', 'admin', 'admin', 1, db);
    });
};

exports.createEmployee = createEmployee;
