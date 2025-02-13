/**
 * run test with:
 * npm run test
 */

// import the main testing functionalities
const assert = require("assert");
const request = require("supertest");

// import the app
const app = require("../index");

// main page gets rendered with the correct title
describe("Unit testing the / route", function () {
	// page gets rendered
	it("should return OK status", function () {
		return request(app)
			.get("/")
			.then((res) => {
				// page gets rendered
				assert.equal(res.status, 200);
			});
	});

	// the correct title is passed
	it("should contain 'HelpUsRecycle' as title", function () {
		request(app).get("/").expect("title", "HelpUsRecycle");
	});
});
