let haversine = require("../public/scripts/haversine");
const cookie = require("cookie-signature");

// each page has some SEO meta tags
let metaTagDescription = require("../public/scripts/meta_tags.js");
let description = metaTagDescription.metaTags;
// keywords: all the same in prototype
let metaTagKeywords = "recycle, plastic, bottle, deposit, collection, give";

module.exports = function (app) {
	app.get("/", function (req, res) {
		res.render("index.html", {
			title: "Landing page",
			description: description("index"),
			keywords: metaTagKeywords,
			success: "",
		});
	});
	app.get("/account", function (req, res) {
		const userid = req.signedCookies.userid;
		if (userid === null || userid === undefined)
			res.render("account.html", {
				title: "Create an account or login",
				description: description("account"),
				keywords: metaTagKeywords,
				success: "",
			});
		else res.redirect("/profile");
	});
	app.get("/collect", function (req, res) {
		res.render("collect.html", {
			title: "Search for bottles to collect near you",
			description: description("collect"),
			keywords: metaTagKeywords,
			success: "",
		});
	});
	app.get("/about", function (req, res) {
		res.render("about.html", {
			title: "About us",
			description: description("about"),
			keywords: metaTagKeywords,
			success: "",
		});
	});
	app.get("/profile", function (req, res) {
		const userid = req.signedCookies.userid;
		if (userid === null || userid === undefined)
			res.render("account.html", {
				title: "Create an account or login",
				description: description("account"),
				keywords: metaTagKeywords,
				success: "",
			});
		else {
			const collectorid = req.body.collectorid;

			let sqlQuery =
				"SELECT Orders.*, Users.User_Name FROM Orders  INNER JOIN Users ON Orders.giverid = Users.userid WHERE collectorid = ?";
			db.query(sqlQuery, [userid], (err, result_collector) => {
				if (err) console.warn(`DB Error in account: ${err.message}`);
				else {
					let sqlQuery = "SELECT * FROM Orders WHERE giverid = ?";
					db.query(sqlQuery, [userid], (err, result_giver) => {
						if (err) console.warn(`DB Error in account: ${err.message}`);
						else {
							res.render("profile.html", {
								title: "What would you like to do?",
								orders_collector: result_collector,
								orders_giver: result_giver,
								description: description("profile"),
								keywords: metaTagKeywords,
								success: "",
							});
						}
					});
				}
			});
		}
	});
	app.get("/give", function (req, res) {
		res.render("give.html", {
			title: "Give bottles",
			description: description("give"),
			keywords: metaTagKeywords,
			success: "",
		});
	});
	app.get("/contact", function (req, res) {
		res.render("contact.html", {
			title: "Contact Us",
			description: description("contact"),
			keywords: metaTagKeywords,
			success: "",
		});
	});
	app.get("/sitemap", function (req, res) {
		res.render("sitemap.html", {
			title: "Sitemap",
			description: description("sitemap"),
			keywords: metaTagKeywords,
			success: "",
		});
	});
	app.get("/legal_notice", function (req, res) {
		res.render("legal_notice.html", {
			title: "Legal Notice",
			description: description("legal_notice"),
			keywords: metaTagKeywords,
			success: "",
		});
	});
	app.get("/terms_conditions", function (req, res) {
		res.render("terms_conditions.html", {
			title: "Terms and Conditions",
			description: description("terms_conditions"),
			keywords: metaTagKeywords,
			success: "",
		});
	});

  app.get("/logout", function (req, res) {
    res.clearCookie("userid");
    res.redirect("/");
  });

	app.post("/create_account", function (req, res) {
		const name = req.body.display_name;
		const email = req.body.email;
		const password = req.body.password;

		const sqlFindUserQuery = "SELECT * FROM Users WHERE User_Login LIKE ?";
		db.query(sqlFindUserQuery, [email], (err, result) => {
			if (err) console.warn(`DB error in create account: ${err.message}`);
			else {
				if (result.length > 0) {
					// TODO: proper error message integrated into page
					res.send("User already exist");
				} else {
					const sqlInsertUserQuery =
						"INSERT INTO Users (User_Login, User_Name, User_Password) VALUES (?, ?, ?)";
					// TODO: Salt the password!!!
					db.query(
						sqlInsertUserQuery,
						[email, name, password],
						(err, result) => {
							if (err)
								console.warn(`DB error in create account: ${err.message}`);
							res.render("account.html", {
								title: "Create an account or login",
								description: description("account"),
								keywords: metaTagKeywords,
								success: "successfully created an account",
							});
						}
					);
				}
			}
		});
	});

	app.post("/login_account", function (req, res) {
		const email = req.body.email;
		const password = req.body.password;

		const sqlFindUserQuery = "SELECT * FROM Users WHERE User_Login LIKE ?";
		db.query(sqlFindUserQuery, [email], (err, result) => {
			if (err) console.warn(`DB error in create account: ${err.message}`);
			else {
				if (result.length != 1) {
					// TODO: proper error message integrated into page
					res.send("User do not exist");
				} else {
					// TODO: Salt the password!!!
					if (result[0].User_Password == password) {
						console.log("Passwords match");
						res.cookie("userid", `${result[0].userid}`, {
							signed: true,
							maxAge: 30 * 24 * 3600 * 1000,
						});
            res.redirect("/profile");
					}
          else {
            console.warn(`Passwords do not match for ${email}`);
            res.render("account.html", {
              title: "Create an account or login",
              description: description("account"),
              keywords: metaTagKeywords,
              success: "Passwords do not match or user does not exist",
            });
          }
				}
			}
		});
	});

	app.post("/post_order", function (req, res) {
		// TODO: authorisation
		if ("userid" in req.signedCookies) {
			const giverId = req.signedCookies.userid;

			// Order info
			const num25CentBottles = parseInt(req.body.num25CentBottles);
			const num15CentBottles = parseInt(req.body.num15CentBottles);
			const bagsIncluded =
				"bagsIncluded" in req.body && req.body.bagsIncluded == "on";
			const notes = req.body.notes;

			// Location info
			const locStreet = req.body.street;
			const locStreetNr = req.body.streetNr;
			const locExtra = req.body.extra;
			const locPostcode = req.body.postcode;
			const locCity = req.body.city;

			// These we'll obtain from the browser if user allows us to do so
			const locLat = req.body.latitude;
			const locLon = req.body.longitude;

			// dates
			const collectionDate = req.body.collectionDate;
			const timeframe = req.body.timeframe;

			const streetAddress = `${locStreet}, ${locStreetNr}${
				locExtra.length > 0 ? ", " + locExtra : ""
			}, ${locCity}, ${locPostcode}`;

			const sqlQuery =
				"INSERT INTO Orders (giverid, Bottles_25, Bottles_15, Location, Location_lat, Location_lon, Day, Time_Slot) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
			db.query(
				sqlQuery,
				[
					giverId,
					num25CentBottles,
					num15CentBottles,
					streetAddress,
					locLat,
					locLon,
					collectionDate,
					timeframe,
				],
				(err, result) => {
					if (err) console.log(`DB Error in post_order: ${err.message}`);
				}
			);
		} else {
			// TODO: Error message about login
		}
		res.redirect("/profile");
	});

	app.get("/order_details", function (req, res) {
		const orderid = req.query.orderid;

		let sqlQuery =
			"SELECT Orders.*, Users.User_Name FROM Orders INNER JOIN Users ON Orders.giverid = Users.userid WHERE orderid = ?";
		db.query(sqlQuery, [orderid], (err, result) => {
			if (err) {
				console.log(`DB Error in order_details: ${err.message}`);
				res.send({});
			} else
				res.render("order_details.html", {
					orderid: orderid,
					order: result[0],
					description: description("order_details"),
					keywords: metaTagKeywords,
					success: "These are the details",
				});
		});
	});

	app.post("/accept_order", function (req, res) {
		// TODO: verify values
		const orderid = req.body.orderid;
		if ("userid" in req.signedCookies) {
			const userid = parseInt(req.signedCookies.userid);

			const sqlQuery = "UPDATE Orders SET collectorid = ? WHERE orderid = ?";
			db.query(sqlQuery, [userid, orderid], (err, result) => {
				if (err) {
					console.warn(
						`DB Error in find_orders_for_collection: ${err.message}`
					);
					// TODO: error message
				}
				// TODO: success message
				res.redirect("/profile");
			});
		} else {
			res.send({ error: "No login" });
		}
	});

	// REST-like endpoints
	app.post("/find_orders_for_collection", function (req, res) {
		// TODO: verify values
		const lat = req.body.latitude;
		const lon = req.body.longitude;
		const dist = req.body.dist;

		const minResults = 5;

		let sqlQuery =
			"SELECT orderid, Location_lat, Location_lon FROM Orders WHERE collectorid IS NULL";
		let response = [];
		db.query(sqlQuery, (err, result) => {
			if (err)
				console.log(`DB Error in find_orders_for_collection: ${err.message}`);
			else {
				// TODO: grid system for quicker filtering + grid in DB as well
				for (let coord of result)
					response.push({
						latitude: coord.Location_lat,
						longitude: coord.Location_lon,
						dist: haversine(coord.Location_lat, coord.Location_lon, lat, lon),
						orderid: coord.orderid,
					});
				response.sort((lhs, rhs) => {
					return lhs.dist - rhs.dist;
				});
				// We need to include minResults and filter everything else above it
				// just to show that system works
				if (response.length >= minResults) {
					if (response[minResults - 1].dist >= dist)
						response.splice(minResults);
					// apply distance filtering
					else
						response = response.filter((a) => {
							return a.dist < dist;
						});
				}
			}
			res.send(response);
		});
	});

	app.post("/find_orders_for_collection_bounds", function (req, res) {
		// TODO: verify values
		const ne = req.body.ne;
		const sw = req.body.sw;

		const maxOrders = 100;
		let sqlQuery =
			"SELECT orderid, Location_lat, Location_lon FROM Orders WHERE collectorid IS NULL";
		let response = [];
		db.query(sqlQuery, (err, result) => {
			if (err)
				console.log(`DB Error in find_orders_for_collection: ${err.message}`);
			else {
				// TODO: grid system for quicker filtering + grid in DB as well
				for (let coord of result) {
					if (
						coord.Location_lat < sw.lat ||
						coord.Location_lat > ne.lat ||
						coord.Location_lon < sw.lng ||
						coord.Location_lon > ne.lng
					)
						continue; // skip out-of-bounds order
					response.push({
						latitude: coord.Location_lat,
						longitude: coord.Location_lon,
						orderid: coord.orderid,
					});
					if (response.length > maxOrders) break; // skip any other orders, we cannot handle that much
				}
			}
			res.send(response);
		});
	});

	app.post("/get_all_orders_by_giver", function (req, res) {
		// TODO: verification + authentication
		const giverid = req.body.giverid;

		let sqlQuery = "SELECT * FROM Orders WHERE giverid = ?";
		// TODO: trim result to reduce amount of information
		// or add pagination
		db.query(sqlQuery, [giverid], (err, result) => {
			if (err)
				console.warn(`DB Error in get_all_orders_by_giver: ${err.message}`);
			else res.send(result);
		});
	});

	app.post("/get_all_orders_by_collector", function (req, res) {
		// TODO: verification + authentication
		const collectorid = req.body.collectorid;

		let sqlQuery = "SELECT * FROM Orders WHERE collectorid = ?";
		// TODO: trim result to reduce amount of information
		// or add pagination
		db.query(sqlQuery, [collectorid], (err, result) => {
			if (err)
				console.warn(`DB Error in get_all_orders_by_collector: ${err.message}`);
			else res.send(result);
		});
	});

	app.post("/get_order_by_id", function (req, res) {
		// TODO: verify values
		const orderid = req.body.orderid;

		let sqlQuery =
			"SELECT Orders.*, Users.User_Name FROM Orders INNER JOIN Users ON Orders.giverid = Users.userid WHERE orderid = ?";
		db.query(sqlQuery, [orderid], (err, result) => {
			if (err) {
				console.log(`DB Error in find_orders_for_collection: ${err.message}`);
				res.send({});
			} else res.send(result[0]);
		});
	});

	app.get("/complete_order", function (req, res) {
		const userid = parseInt(req.signedCookies.userid);
		if (userid !== null) {
			const orderid = req.query.orderid;
			const sqlQuery = "SELECT * From Orders WHERE orderid = ?";
			db.query(sqlQuery, [orderid], (err, result) => {
				if (err) {
					console.warn(
						`DB Error in complete_order or incorrect result: ${err.message}`
					);
				} else if (result.length < 1 || result[0].giverid !== userid) {
					console.warn("incorrect db result:");
					console.log(result);
					console.log(userid);
				} else {
					const sqlPushQuery =
						"INSERT INTO Completed_Orders (collectorid, giverid, Bottles_25, Bottles_15, Location, Location_lat, Location_lon, Day, Time_Slot) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
					const order = result[0];
					db.query(
						sqlPushQuery,
						[
							order.collectorid,
							order.giverid,
							order.Bottles_25,
							order.Bottles_15,
							order.Location,
							order.Location_lat,
							order.Location_lon,
							order.Day,
							order.Time_Slot,
						],
						(err, result) => {
							if (err)
								console.warn(
									`DB Error in complete_order or incorrect result: ${err.message}`
								);
							else {
								const sqlDeleteQuery = "DELETE FROM Orders WHERE orderid = ?";
								db.query(sqlDeleteQuery, [orderid], (err, result) => {
									if (err)
										console.warn(
											`DB Error in complete_order or incorrect result: ${err.message}`
										);
								});
							}
						}
					);
				}
			});
		}
		res.redirect("/account");
	});
};
