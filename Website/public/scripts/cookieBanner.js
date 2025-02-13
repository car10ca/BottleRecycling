// ensure user accepts the use of cookies

// get elements
let cookieBanner = document.getElementById("cookieBanner");
let cookieBannerBtn = document.getElementById("cookieBannerBtn");

// check if the cookie is set
if (localStorage.getItem("cookieBanner") != "cookiesAccepted") {
	// add an event and set the cookie and hide div on click
	cookieBannerBtn.addEventListener("click", (e) => {
		localStorage.setItem("cookieBanner", "cookiesAccepted");
		cookieBanner.classList.add("hidden");
	});
} else {
	// if session cookie is there, don't show the div
	cookieBanner.classList.add("hidden");
}
