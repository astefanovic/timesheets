// Creates the schemas for Employees, Tasks and Hours, if not created already,
// taking in a database object to run the queries on
exports.init = (db) => {
    // Employees, can be management, Password is a sha256 hash of the users password,
    // Salt is given for this users password to hash with, Management is a boolean
    db.run('CREATE TABLE IF NOT EXISTS Employees(ID INTEGER PRIMARY KEY AUTOINCREMENT, Name TEXT, Email TEXT, Password TEXT, Management INTEGER, Salt TEXT)');
    
    // All the tasks employees declare
    db.run('CREATE TABLE IF NOT EXISTS Tasks(ID INTEGER PRIMARY KEY, Name TEXT, PONumber INTEGER)');
    
    // Each days hours worked and on which project, Billable is a boolean (0 is false)
    db.run(`CREATE TABLE IF NOT EXISTS Hours(
    EmployeeID INTEGER, TaskID INTEGER, Date TEXT, Hours INTEGER, Billable INTEGER,
FOREIGN KEY(EmployeeID) REFERENCES Employee(ID), 
FOREIGN KEY(TaskID) REFERENCES Tasks(ID)
PRIMARY KEY(EmployeeID, TaskID))`);
};
