/**
 * depending if a user is logged in or not,
 * the navigation is supposed to get adjusted
 */

// get elements
let loggedOut = document.getElementById("logged-out");
let loggedIn = document.getElementById("logged-in");

// check if cookie exists
function getCookie(item) {
	var cookieArr = document.cookie.split(";");
	for (var i = 0; i < cookieArr.length; i++) {
		var cookiePair = cookieArr[i].split("=");
		if (item == cookiePair[0].trim()) {
			return decodeURIComponent(cookiePair[1]);
		}
	}
	return null;
}

/**
 * toggle classes to be able to display corresponding
 * login or logout buttons in navigation
 * - check if cookie is set
 * - depending on result set classes
 */
function checkCookie() {
	// check if cookie exists
	let user = getCookie("userid");

	// depending on result set classes
	if (user == null) {
		loggedIn.classList.add("hidden");
		loggedOut.classList.remove("hidden");
	} else {
		loggedOut.classList.add("hidden");
		loggedIn.classList.remove("hidden");
	}
}

// call the function to set the classes
checkCookie();
