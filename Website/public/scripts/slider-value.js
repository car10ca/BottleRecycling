var slider = document.getElementById("income_range");
var output = document.getElementById("range_income_value");
output.innerHTML = slider.value;

slider.oninput = function() {
  output.innerHTML = this.value;
}



var slider_bottles = document.getElementById("bottles_range");
var output_bottles = document.getElementById("range_bottles_value");
output.innerHTML = slider_bottles.value;

slider_bottles.oninput = function() {
  output_bottles.innerHTML = this.value;
}