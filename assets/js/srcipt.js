var apikey = "7c88e4c6e5de0fb0a5853c4d3d0bbbf8";

var tempQueryUrl;
var units;
var days = 5;
var recentCity;
var cities = [];

var lat;
var lon;

$("#search-button").click(function () {
  var cityName = $("#city-name").val().toUpperCase();
  searchByName(cityName);
});

function searchByName(city) {
  tempQueryUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apikey}`;
  $.ajax({
    url: tempQueryUrl,
    method: "GET",
  }).then(function (response) {
    lat = response.coord.lat;
    lon = response.coord.lon;
    searchByCoordinates(lat, lon);
    $("#date").text(
      `${city} (${moment().format("MMM, Do YYYY")})`
    );
    // for(var i=0;i<cities.length; i++){

    // }
    if(cities.includes(city)){
       cities.splice(cities.indexOf(city),1);
       cities.unshift(city);
       console.log(cities);
    }else{
        cities.unshift(city);
    }
    renderRecentCity();
    
  });
}

function renderRecentCity() {
    $("#recent-search").text("");
    for(var i=0; i<cities.length;i++){
        recentCity = $("<p>");
        recentCity.text(cities[i]);
        recentCity.addClass("recent-city");
    // recentCity.click(function(){
    //     console.log($(this));
    // })
        $("#recent-search").append(recentCity);
    }
  
}

function searchByCoordinates(lat, lon) {
  units = $("#units").val();
  var queryUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=${units}&appid=${apikey}`;

  $.ajax({
    url: queryUrl,
    method: "GET",
  }).then(function (response) {
    currentForcast(response);
    futrueFroecast(response);
    storeData(cities);
  });
}

function currentForcast(data){
    var icon = $("<img>");
    icon.attr(
      "src",
      `http://openweathermap.org/img/w/${data.current.weather[0].icon}.png`
    );

    $("#date").append(icon);
    $("#temp").text(`temp: ${Math.round(data.current.temp)}`);
    $("#wind").text(`wind: ${data.current.wind_speed}`);
    $("#humidity").text(`Humidity: ${data.current.humidity}%`);
    $("#uvIndex").text(data.current.uvi);
    //   checking uv Index to decide background color
    if (data.current.uvi >= 0 && data.current.uvi < 3) {
      $("#uvIndex").addClass("low");
    } else if (data.current.uvi >= 3 && data.current.uvi < 6) {
      $("#uvIndex").addClass("moderate");
    } else if (data.current.uvi >= 6 && data.current.uvi < 8) {
      $("#uvIndex").addClass("high");
    } else if (data.current.uvi >= 8 && data.current.uvi < 11) {
      $("#uvIndex").addClass("very-high");
    } else {
      $("#uvIndex").addClass("extrem");
    }
    //changing disoplay for weather info
    $("#weather-info").css("display", "block");
}

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

function storeData(array) {
  localStorage.setItem("cities", JSON.stringify(array));
}

getData();
function getData() {
  cities = JSON.parse(localStorage.getItem("cities"));
  console.log(cities);
  if (cities === null || cities.length === 0) {
    cities = [];
  } else {
    searchByName(cities[0]);
  }
}
