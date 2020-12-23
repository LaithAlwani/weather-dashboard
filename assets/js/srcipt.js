var apikey = "7c88e4c6e5de0fb0a5853c4d3d0bbbf8";

var tempQueryUrl;
var units;
var days = 5;
var recentCity;

var lat;
var lon;

$("#search-button").click(function () {
  var cityName = $("#city-name").val();
  tempQueryUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apikey}`;
  console.log(cityName);
  units = $("#units").val();
  console.log(units);

  $.ajax({
    url: tempQueryUrl,
    method: "GET",
  }).then(function (response) {
    lat = response.coord.lat;
    lon = response.coord.lon;

    var queryUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=${units}&appid=${apikey}`;

    $.ajax({
      url: queryUrl,
      method: "GET",
    }).then(function (response) {
      console.log(response);

      $("#date").text(
        `${cityName.toUpperCase()} (${moment().format("MMM, Do YYYY")})`
      );

      var icon = $("<img>");
      icon.attr(
        "src",
        `http://openweathermap.org/img/w/${response.current.weather[0].icon}.png`
      );

      $("#date").append(icon);
      $("#temp").text(`temp: ${Math.round(response.current.temp)}`);
      $("#wind").text(`wind: ${response.current.wind_speed}`);
      $("#humidity").text(`Humidity: ${response.current.humidity}%`);
      $("#uvIndex").text(response.current.uvi);
      //   checking uv Index to decide background color
      if (response.current.uvi >= 0 && response.current.uvi < 3) {
        $("#uvIndex").addClass("low");
      } else if (response.current.uvi >= 3 && response.current.uvi < 6) {
        $("#uvIndex").addClass("moderate");
      } else if (response.current.uvi >= 6 && response.current.uvi < 8) {
        $("#uvIndex").addClass("high");
      } else if (response.current.uvi >= 8 && response.current.uvi < 11) {
        $("#uvIndex").addClass("very-high");
      } else {
        $("#uvIndex").addClass("extrem");
      }
      //changing disoplay for weather info
      $("#weather-info").css("display", "block");

      recentCity = $("<p>");
      recentCity.text(cityName);
      recentCity.addClass("recent-city");
      //   recentCity.click(function(){
      //       alert("clicked");
      //   })
      $("#recent-search").prepend(recentCity);

      //   5 day forecast
      futrueFroecast(response);
    });
  });
});

//5 day future forcast function
function futrueFroecast(data) {
  $("#5day-forecast").text("");
  for (var i = 0; i < days; i++) {
    console.log(Math.round(data.daily[i].temp.max));
    var column = $("<div>");
    column.addClass("uk-width-1-5@s");
    var card = $("<div>");
    card.addClass("uk-card uk-card-primary card ");
    var date = $("<h4>");
    date.text(
      moment()
        .add(1 + i, "days")
        .format("MMM. Do")
    );
    var icon = $("<img>");
    icon.attr(
      "src",
      `http://openweathermap.org/img/w/${data.daily[i].weather[0].icon}.png`
    );
    var temp = $("<p>");
    temp.addClass("future-temp");
    temp.text(Math.round(data.daily[i].temp.max));
    var humidity = $("<p>");
    humidity.addClass("future-humidity");
    humidity.text(data.daily[i].humidity);
    card.append(date, icon, temp, humidity);
    column.append(card);
    $("#5day-forecast").append(column);
  }
}
