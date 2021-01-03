var apikey = "7c88e4c6e5de0fb0a5853c4d3d0bbbf8";

var tempQueryUrl;
var units;
var days = 5;
var recentCity;
var cities = [];

var lat;
var lon;

//makes an ajax call to the api when the value of the units is changed
$("#units").on("change", function(){
    if($("#city-name-input").val().length >0){
        searchByName($("#city-name-input").val().toUpperCase());
    }   
})

$("#search-button").click(function (event) {
    event.preventDefault();
  var cityName = $("#city-name-input").val().toUpperCase();
  searchByName(cityName);
});
// ajax call by cities name to get the city coordinates
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
//uses the city coordinates from the function above to get the weather data for 7 days
function searchByCoordinates(lat, lon) {
    units = $("#units").val();
    var queryUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=${units}&appid=${apikey}`;
  
    $.ajax({
      url: queryUrl,
      method: "GET",
    }).then(function (response) {
      currentForcast(response, units);
      futrueFroecast(response,units);
      storeData(cities);
    });
  }

//renders recently searched cities
function renderRecentCity() {
    $("#recent-search-card").css("display","block");
    $("#recent-search").text("");
    //limits the recent search list to 5 cities
    if(cities.length >5){
      cities.length = 5;
    }
    //loops through cities array and rendes the values
    for(var i=0; i<cities.length;i++){
        recentCity = $("<p>");
        recentCity.text(cities[i]);
        recentCity.addClass("recent-city uk-padding-small");
        $("#recent-search").append(recentCity);
        recentCity.click(function(event){
            searchByName(event.target.textContent);
            $("#city-name-input").val(event.target.textContent);
        })
        
    } 
}
    
function currentForcast(data,unit){
    var icon = $("<img>");
    icon.attr(
      "src",
      `http://openweathermap.org/img/w/${data.current.weather[0].icon}.png`
    );
    icon.attr("alt","weather icon");

    $("#city").append(icon);
    $("#date").text(moment().format("MMM. Do, YYYY"));
    if(unit ==="Metric"){
        $("#temp").text(`Temperature: ${Math.round(data.current.temp)}${String.fromCharCode(176)}C`);
        $("#wind").text(`Wind: ${data.current.wind_speed} Kmh`);
    }else{
        $("#temp").text(`Temperature: ${Math.round(data.current.temp)}${String.fromCharCode(176)}F`);
        $("#wind").text(`Wind: ${data.current.wind_speed} Mph`);
    }
    
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
function futrueFroecast(data,unit) {
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
    if(unit === "Metric"){
        temp.text(Math.round(data.daily[i].temp.max)+String.fromCharCode(176)+"C");
    }else{
        temp.text(Math.round(data.daily[i].temp.max)+String.fromCharCode(176)+"F");
    }
    
    var humidity = $("<p>");
    humidity.addClass("future-humidity");
    humidity.text(data.daily[i].humidity+"%");
    card.append(date, icon, temp, humidity);
    column.append(card);
    $("#5day-forecast").append(column);
  }
}

//stores recent seached cities to local storage
function storeData(array) {
  localStorage.setItem("cities", JSON.stringify(array));
}

//fetches local storage data and saved it as an array of cities
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
$("#city-name-input").click(function(){
    $("#city-name-input").val("");
})
