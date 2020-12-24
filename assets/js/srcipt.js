var apikey = "7c88e4c6e5de0fb0a5853c4d3d0bbbf8";

var tempQueryUrl;
var units;
var days = 5;
var recentCity;
var cities = [];

var lat;
var lon;

$("#units").on("change", function(){
    if($("#city-name").val().length >0){
        searchByName($("#city-name").val());
    }   
    
})

$("#search-button").click(function (event) {
    event.preventDefault();
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
    $("#city").text(city)
    $("#date").text(moment().format("MMM. Do YY"));

    //check if the name of the city is already in the cities array
    if(cities.includes(city)){
       cities.splice(cities.indexOf(city),1);
       cities.unshift(city);
    }else{
        cities.unshift(city);
    }
    renderRecentCity();
    
  })
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

function renderRecentCity() {
    $("#recent-search-card").css("display","block");
    $("#recent-search").text("");
    for(var i=0; i<cities.length;i++){
        recentCity = $("<p>");
        recentCity.text(cities[i]);
        recentCity.addClass("recent-city uk-padding-small");
        $("#recent-search").append(recentCity);
        addClick(recentCity);
        
    }
  
}

function addClick(city){
    city.click(function(event){
        searchByName(event.target.textContent);
    })
}



function currentForcast(data){
    var icon = $("<img>");
    icon.attr(
      "src",
      `http://openweathermap.org/img/w/${data.current.weather[0].icon}.png`
    );
    icon.attr("alt","weather icon");

    $("#city").append(icon);
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
  if (cities === null || cities.length === 0) {
    cities = [];
    $("#recent-search-card").css("display","none");
  } else {
    searchByName(cities[0]);
  }
}


//clear input field when clicked
$("#city-name").click(function(){
    $("#city-name").val("");
})
