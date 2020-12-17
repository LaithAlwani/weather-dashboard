var apikey = "7c88e4c6e5de0fb0a5853c4d3d0bbbf8";
var cityName = "ottawa";
var units = "metric";
var days = 5;
var queryUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apikey}`;

var lat;
var lon;

$.ajax({
  url: queryUrl,
  method: "GET",
}).then(function (response) {
  lat = response.coord.lat;
  lon = response.coord.lon;
  var queryUrl2 = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&exclude=hourly,minutely&appid=${apikey}`;

  $.ajax({
    url: queryUrl2,
    method: "GET",
  }).then(function (response) {
      for(var i=0; i<response.daily.length;i++){
        console.log(response);
        var weatherDiv = $("<div>");
        weatherDiv.text(`temp is: ${response.daily[i].temp.max}C`);
        $("#response").append(weatherDiv);
      }
    
  });
});

