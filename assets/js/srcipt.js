var apikey = "7c88e4c6e5de0fb0a5853c4d3d0bbbf8";

var tempQueryUrl;
var units;
var days = 5;
var recentCity;

var lat;
var lon;

$("#search-button").click(function(){
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
          
          $("#date").text(`${cityName} ${new Date(response.current.dt*1000)}`);
          $("#temp").text(`temp: ${Math.round(response.current.temp)}`);
          $("#wind").text(`wind: ${response.current.wind_speed}`);
          $("#humidity").text(`Humidity: ${response.current.humidity}%`);
          $("#uvIndex").text(response.current.uvi);
          $("#weather-info").css("display", "block")

          recentCity = $("<p>");
          recentCity.text(cityName);
          recentCity.addClass("recent-city");
        //   recentCity.click(function(){
        //       alert("clicked");
        //   })
          $("#recent-search").prepend(recentCity);

          $("#5day-forecast").text("");
          for(var i=0; i<days;i++){
            console.log(Math.round(response.daily[i].temp.max));
            var column = $("<div>");
            column.addClass("uk-width-1-5@m");
            var card = $("<div>");
            card.addClass("uk-card uk-card-primary uk-card-body");
            var icon = $("<img>");
            icon.attr("src", `http://openweathermap.org/img/w/${response.daily[i].weather[0].icon}.png`)
            var temp = $("<p>");
            temp.text(Math.round(response.daily[i].temp.max));
            var humidity = $("<p>");
            humidity.text(response.daily[i].humidity);
            card.append(icon,temp, humidity);
            column.append(card);
            $("#5day-forecast").append(column);

          }
        });
      });
      

})




/* <div class="uk-width-1-5@m">
    <div class="uk-card uk-card-primary uk-card-body">
        <h4>date</h4>
        <p>Weather</p>
        <p>Temp</p>
        <p>Humidity</p>
    </div>
</div> */

