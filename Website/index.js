const express = require("express");
const app = express();
const port = 8080;
const bodyParser = require("body-parser");
const mysql = require("mysql");

// const should = require("should");
const cookieSecret = "gWmJyknjfSGNj8Yy377uUkvC";
const cookieParser = require("cookie-parser");
// TODO: store secret in a better way

// register routes
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser(cookieSecret));

const db = mysql.createConnection({
	host: "database-1.czafbwnddgfu.eu-central-1.rds.amazonaws.com",
	user: "server_backend",
	password: "vEAlP9wtOCAyxy4APOYU",
	database: "HelpUsRecycle",
});

// connect to database
db.connect((err) => {
	if (err) throw err;
	console.log("Connected to database");
});

global.db = db;

require("./routes/main")(app);

// use files in public folder
app.use(express.static(__dirname + "/public"));
// interactions
app.use(bodyParser.urlencoded({ extended: true }));
// enable to use cookies

app.set("views", __dirname + "/views");
app.set("view engine", "ejs");
app.engine("html", require("ejs").renderFile);

app.listen(port, () => console.log(`HelpUsRecycle listening on port ${port}`));

// for testing to get access to the app
module.exports = app;
