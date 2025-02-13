/** 
text slideshow 
copied and adjusted from:
https://www.w3schools.com/howto/howto_js_quotes_slideshow.asp 
*/

/** enable to track events */
// direction from arrows
const previous = document.getElementById("prev");
const next = document.getElementById("next");

// page from dots - fill array with all dots
let dots = [];

function addDots() {
	dots.push(document.getElementById("dot_1"));
	dots.push(document.getElementById("dot_2"));
	dots.push(document.getElementById("dot_3"));
}

addDots();

// get all slides
let slides = document.getElementsByClassName("individualSlides");

/** show corresponding page */
// start by showing first slide
let slideIndex = 1;
showSlides(slideIndex);

// click on arrows
previous.addEventListener("click", (e) => {
	showSlides((slideIndex -= 1));
});

next.addEventListener("click", (e) => {
	showSlides((slideIndex += 1));
});

// click dots
for (let i = 0; i < dots.length; i++) {
	dots[i].addEventListener("click", (e) => {
		showSlides((slideIndex = i + 1));
	});
}

// show the corresponding slide
function showSlides(n) {
	let i;
	if (n > slides.length) {
		slideIndex = 1;
	}
	if (n < 1) {
		slideIndex = slides.length;
	}
	for (i = 0; i < slides.length; i++) {
		slides[i].style.display = "none";
	}
	for (i = 0; i < dots.length; i++) {
		dots[i].className = dots[i].className.replace(" active", "");
	}
	slides[slideIndex - 1].style.display = "block";
	dots[slideIndex - 1].className += " active";
}
